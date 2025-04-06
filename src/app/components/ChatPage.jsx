'use client'
import React, { useEffect, useState,useRef } from 'react';
import Image from 'next/image';
import { useAppSelector } from '../../lib/hooks/hook.js';
import { IoSend } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import ChatDefault from './ChatDefault.jsx';
import ChatPageModal from './ChatPageModal.jsx';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { isSameSender } from '../config/messageConfig.js';
import { io } from 'socket.io-client';

const ENDPOINT = 'http://localhost:8080';
let socket, selectedChatCompare;

function ChatPage() {
    const user = useAppSelector((state) => state.user);
    const [showModal, setShowModal] = useState(false);
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIstyping] = useState(false);

    const token = session?.user?.token;



    async function fetchMessages() {
        if (!token && !user?.id)
            return;
        setLoading(true);
        try {

            const result = await axios.get(`${process.env.NEXT_PUBLIC_URL}/message/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-type': 'application/json'
                }
            })
            // console.log("all messages---->", result.data);
            setLoading(false);
            setMessages(result.data);

            // joins the chat room of the chatId, not user ID : chatId = roomId
            // a house is a chatId/roomId, clicks on a chat then the user enters that house.
            socket.emit('join chat', user.id);

        }
        catch (err) {
            console.log(err);
            toast.error("Error occurred while fetching messages.");
        }
    }






    async function sendMessage(e) {
        e.preventDefault();
        // text na thakle return korte hobe 
        //   if (!text.trim()) return;
        socket.emit('stop typing', user.id)
        try {
            const newMessage = text;
            setText("");
            const result = await axios.post(`${process.env.NEXT_PUBLIC_URL}/message`, { content: newMessage, chatId: user.id }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-type': 'application/json'
                }
            })
            setMessages([...messages, result.data]);
            // console.log(result);
            // console.log("senderId-->", result.data);
            socket.emit('new message', result.data);
        }
        catch (err) {
            console.log("ERRROR---->", err);
            toast.error("Error occurred while sending message.")
        }
    }

    useEffect(() => {
        if (!user.id) return;
        socket = io(ENDPOINT);
        socket.emit('setup', user);
        socket.on('connected', () => {
            setSocketConnected(true);
            console.log("connnnnennenenne");
        })

        socket.on('typing', () => {
            console.log("get typing.........eee");
            setIstyping(true);
        })
        socket.on('stop typing', () => setIstyping(false));

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };


    }, [user?.id])

    useEffect(() => {
        console.log("✍️ istyping changed:", istyping);
    }, [istyping]);



    useEffect(() => {
        if (user?.id)
            fetchMessages();
        selectedChatCompare = user;

    }, [user?.id, token]);




    useEffect(() => {
        if (!socket) return;

        // Remove existing listener before adding a new one to prevent duplicates
        socket.off('message received');

        // Add new listener
        socket.on('message received', (newMessage) => {
            // console.log("newMessage.chat._id------------------------>", newMessage.chat._id)
            // console.log("selectedChatCompare.id------------------------>", selectedChatCompare.id)

            if (!selectedChatCompare || selectedChatCompare.id !== newMessage.chat._id) {
                // send notification
                // console.log("Notification: New message received");
            } else {
                console.log("New message received:", newMessage);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
        });

    }, [messages, socket]);

    const typingTimeoutRef = useRef(null);

    const handleTyping = (e, value) => {
        setText(value);

        // console.log("typing.......",socket);

        if (!socket) return;

        if (!typing) {
            // console.log("hulalla");
            setTyping(true);
            socket.emit('typing', user.id)
        };


        if(typingTimeoutRef.current)
            clearTimeout(typingTimeoutRef.current);




       
        typingTimeoutRef.current =  setTimeout(() => {
          
           
                socket.emit('stop typing', user.id);
                setTyping(false)
     
        }, 1000);


    }






    // console.log("userId--->", user);
    // console.log("loggedin user--->", session?.user);
    // console.log(`messages of  chatid : ${user.id} is :`, messages);

    return (
        <>
            {!user?.id ? (
                <ChatDefault />
            ) : (
                <div className="w-3/4 rounded-md max-h-screen relative bg-background border-l-[0px] border-myyellow">
                    {/* Chat Header */}
                    <div className="h-16 rounded-t-md  bg-myyellow w-full px-5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Image src={user.picture} width={40} height={40} alt="User" className="rounded-full" />
                            <h2 className="text-[#303841] font-medium text-3xl">{user.name}</h2>
                        </div>

                        <button onClick={() => setShowModal(!showModal)}>
                            <BsThreeDotsVertical className={`text-2xl text-[#303841] hover:bg-foreground hover:text-gray-200 ${showModal && 'bg-foreground'} h-12 w-12 p-2 rounded-full transition`} />
                        </button>
                    </div>

                    {/* Chat Messages */}

                    <div className='w-full h-4/5  overflow-y-auto bg-background px-5'>
                        {loading ?

                            <div className="h-full inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
                                <div className="bg-transparent p-5 rounded-lg flex items-center justify-center">

                                    <div className="animate-spin h-10 w-10 border-t-4 border-myyellow border-solid rounded-full"></div>
                                </div>
                            </div>


                            :



                            messages && messages.map((item, key) => {

                                return (
                                    <div
                                        key={key}
                                        className={`w-full flex ${isSameSender(session?.user?.email, item.sender.email) ? "justify-end" : "justify-start"} py-2`}
                                    >
                                        <div className={`w-2/5 px-3 rounded-xl py-2 my-2 ${isSameSender(session.user.email, item.sender.email) ? 'bg-[#FFE893]' : 'bg-white'} shadow-lg`}>
                                            <p className="text-myblack">{item.content}</p>
                                            <p className="text-[10px]">{isSameSender(session.user.email, item.sender.email) ? 'You' : item.sender.email}</p>
                                        </div>
                                    </div>
                                );
                            })


                        }

                        {istyping ? (
                            <div className='text-myblack text-sm bottom-7 bg-myyellow w-fit py-2 px-4 rounded'>
                                typing...
                            </div>
                        ) : (
                            <></>
                        )}

                    </div>


                    {istyping ? (
                        <div className='text-myblack text-4xl bottom-7'>
                            typing...
                        </div>
                    ) : (
                        <></>
                    )}


                    {/* Message Input */}
                    <form action="" className='absolute bottom-0 w-full shadow-sm'>
                        <div className="w-full flex items-center gap-2 p-2 bg-background">
                            <textarea
                                className="w-full h-14 px-3 text-lg focus:outline-none border border-background rounded-md resize-none overflow-hidden"
                                placeholder="Type messages here..."
                                value={text}
                                onChange={(e) => handleTyping(e, e.target.value)}
                                rows="1"
                                style={{ minHeight: "56px", maxHeight: "200px", whiteSpace: "pre-wrap" }}
                            />
                            <button onClick={sendMessage}>
                                <IoSend className="text-4xl hover:cursor-pointer text-myyellow bg-background" />
                            </button>
                        </div>
                    </form>

                    {
                        showModal &&
                        <ChatPageModal user={user} />
                    }



                </div>
            )}
        </>
    );
}

export default ChatPage;