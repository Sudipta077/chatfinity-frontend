'use client'
import React, { useEffect, useState } from 'react';
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

function ChatPage() {
    const user = useAppSelector((state) => state.user);
    const [showModal, setShowModal] = useState(false);
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

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

        }
        catch (err) {
            console.log(err);
            toast.error("Error occurred while fetching messages.");
        }
    }

    async function sendMessage(e) {
        e.preventDefault();
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

            console.log("senderId-->", result);
        }
        catch (err) {
            console.log(err);
            toast.error("Error occurred while sending message.")
        }
    }

    useEffect(() => {
        if (user?.id)
            fetchMessages();

    }, [user?.id, token]);

    console.log("userId--->", user);
    console.log("loggedin user--->", session?.user);


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
                            <BsThreeDotsVertical className="text-2xl text-[#303841]" />
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
                                        className={`w-full flex ${isSameSender(session?.user?.email, item.sender.email) ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`w-2/5 px-3 rounded-xl py-2 my-2 ${isSameSender(user.email, item.sender.email) ? 'bg-mygreen' : 'bg-myblue'}`}>
                                            <p className="text-myblack">{item.content}</p>
                                            <p className="text-xs">{item.sender.email}</p>
                                        </div>
                                    </div>
                                );
                            })


                        }
                    </div>

                    {/* Message Input */}
                    <form action="">
                        <div className="w-full flex items-center gap-2 p-2 bg-background">
                            <textarea
                                className="w-full h-14 px-3 text-lg focus:outline-none border border-background rounded-md resize-none overflow-hidden"
                                placeholder="Type messages here..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
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
