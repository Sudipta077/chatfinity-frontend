'use client'
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useAppSelector } from '../../lib/hooks/hook.js';
import { IoSend } from "react-icons/io5";
import { TbClockUp } from "react-icons/tb";
import { MdDone } from "react-icons/md";
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
    const messagesEndRef = useRef(null);
    const token = session?.user?.token;

    const isAiChat = user?.id === "artificial intelligence";

    // console.log("user-=--->",user);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, istyping]);

    async function fetchMessages() {
        if (isAiChat) return setMessages([]);
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
            setLoading(false);
            setMessages(result.data);
            // console.log("all messages---->", result.data);

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

        if (!text.trim()) return;



        const messageToSend = text;

        setText("");

        if (isAiChat) {

            const aiMsg = {
                _id: `ai-${Date.now()}`,
                content: text,
                sender: {
                    name: "You",
                    email: session.user?.email,
                    picture: session.user?.image,
                },
                createdAt: new Date().toISOString(),
                optimistic: false
            };

            setMessages((prev) => [...prev, aiMsg]);


            try {

               


                const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/chat/ai`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ prompt: messageToSend })
                });

                if (!response.ok) {
                    throw new Error("AI response failed");
                }

                const aiMsg2 = {
                    _id: `ai-${Date.now()}`,
                    content: '',
                    sender: {
                        name: "assistant",
                        email: '',
                        picture: "/logo.png", // AI image from public
                    },
                    createdAt: new Date().toISOString(),
                    optimistic: false
                };
                setMessages((prev) => [...prev, aiMsg2]);


                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");
                let aiText = '';



                // Add the empty AI message initially

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    aiText += chunk;

                    // Update the last message as it grows
                    setMessages((prev) => {
                        const updated = [...prev];
                        const lastMsg = updated[updated.length - 1];

                        updated[updated.length - 1] = {
                            ...lastMsg,
                            content: aiText,
                            optimistic: false,
                        };

                        return updated;
                    });
                }
            } catch (err) {
                console.log("erorrr ai -->", err);
                toast.error("Failed to get AI response.");
            }
        }






        else {

            const tempId = `temp-${Date.now()}`;
            const optimisticMsg = {
                _id: tempId,
                content: text,
                sender: {
                    name: session?.user?.name,
                    email: session?.user?.email,
                    picture: session?.user?.image, // optional
                },
                createdAt: new Date().toISOString(),
                optimistic: true, // mark this one
            };

            // 1. Show the message immediately
            setMessages((prev) => [...prev, optimisticMsg]);

            socket.emit('stop typing', user.id);


            try {
                // 2. Send to backend
                // const result = await axios.post(`${process.env.NEXT_PUBLIC_URL}/message`, {
                //     content: messageToSend,
                //     chatId: user.id
                // }, {
                //     headers: {
                //         Authorization: `Bearer ${token}`,
                //         'Content-type': 'application/json'
                //     }
                // });

                // 3. Emit real message to socket

                const key = await deriveKey(user.id, user.salt);
                const encrypted = await encryptMessage(messageToSend, key);

                console.log("Encrypted:", encrypted);

                let msg = {
                    content: JSON.stringify(encrypted),
                    chatId: user.id,
                    sender: {
                        email: session.user?.email,
                        name: session.user?.name
                    }
                }
                // console.log("Session------>",session.user);

           


                socket.emit('new message', msg);

                // 4. Replace optimistic message with real one
                // setMessages((prevMessages) => prevMessages.map(msg =>
                //     msg._id === tempId ? result.data : msg
                // ));

            } catch (err) {
                // 5. Optionally, remove the temp message or mark as failed
                setMessages((prevMessages) => prevMessages.filter(msg => msg._id !== tempId));
                toast.error("Error occurred while sending message.");
            }
        }
    }



    // async function sendMessage(e){
    //      e.preventDefault();
    //      socket.emit('stop typing', user.id)
    //      try {
    //         const newMessage = text;
    //         setText("");

    //         // while calling api i send:------->  token,content,chatId 



    //         const result = await axios.post(`${process.env.NEXT_PUBLIC_URL}/message`, { content: newMessage, chatId: user.id }, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //                 'Content-type': 'application/json'
    //             }
    //         })
    //         // sender.email,sender.name,content

    //         setMessages([...messages, {_id:Date.now(),content:newMessage,sender:{name:session.user?.name,email:session.user?.email}}]);
    //         // console.log(result);
    //         // console.log("senderId-->", result.data);
    //         socket.emit('new message', result.data);
    //     }
    //     catch (err) {
    //         console.log("ERRROR---->", err);
    //         toast.error("Error occurred while sending message.")
    //     }

    // }





    // async function sendMessage(e) {
    //     e.preventDefault();
    //     // text na thakle return korte hobe 
    //     //   if (!text.trim()) return;
    //     socket.emit('stop typing', user.id)
    //     try {
    //         const newMessage = text;
    //         setText("");
    //         const result = await axios.post(`${process.env.NEXT_PUBLIC_URL}/message`, { content: newMessage, chatId: user.id }, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //                 'Content-type': 'application/json'
    //             }
    //         })
    //         setMessages([...messages, result.data]);
    //         // console.log(result);
    //         // console.log("senderId-->", result.data);
    //         socket.emit('new message', result.data);
    //     }
    //     catch (err) {
    //         console.log("ERRROR---->", err);
    //         toast.error("Error occurred while sending message.")
    //     }
    // }

    useEffect(() => {
        if (!user.id || isAiChat) return;
        socket = io(ENDPOINT, {
            auth: {
                token: token,
            },
        });
        socket.emit('setup', user);
        socket.on('connected', () => {
            setSocketConnected(true);
            // console.log("connnnnennenenne");
        })

        socket.on('typing', () => {
            // console.log("get typing.........eee");
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
        // console.log("✍️ istyping changed:", istyping);
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
        socket.on('message received', async(newMessage) => {
            // console.log("newMessage.chat._id------------------------>", newMessage.chat._id)
            // console.log("selectedChatCompare.id------------------------>", selectedChatCompare.id)

            if (!selectedChatCompare || selectedChatCompare.id !== newMessage.message.chatId) {
                // send notification
                // console.log("Notification: New message received");
            } else {
                // setMessages((prevMessages) => [...prevMessages, newMessage.message]);
                const encrypted = JSON.parse(newMessage.message.content);

                // 2. Derive key from chatId and salt (you need access to salt!)
                const key = await deriveKey(newMessage.message.chatId, user.salt); // <-- make sure `user.salt` is available here
    
                // 3. Decrypt
                const decrypted = await decryptMessage(encrypted, key);
    
                // 4. Replace encrypted content with decrypted
                newMessage.message.content = decrypted;
                setMessages((prevMessages) => {
                    const isOptimistic = prevMessages.some(msg => msg.optimistic && msg.content === newMessage.message.content);
                    if (isOptimistic) {
                        return prevMessages.map(msg =>
                            msg.optimistic && msg.content === newMessage.message.content
                                ? newMessage.message
                                : msg
                        );
                    }
                    return [...prevMessages, newMessage.message];
                });

            }
        });

    }, [user?.id]);

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


        if (typingTimeoutRef.current)
            clearTimeout(typingTimeoutRef.current);





        typingTimeoutRef.current = setTimeout(() => {


            socket.emit('stop typing', user.id);
            setTyping(false)

        }, 1000);


    }



    async function deriveKey(chatId, salt) {
        const enc = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey(
            "raw",
            enc.encode(chatId),
            { name: "PBKDF2" },
            false,
            ["deriveKey"]
        );

        return await window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: enc.encode(salt),
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt", "decrypt"]
        );
    }


    async function encryptMessage(message, key) {
        const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
        const enc = new TextEncoder();

        const ciphertext = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            key,
            enc.encode(message)
        );

        return {
            iv: Array.from(iv),
            ciphertext: Array.from(new Uint8Array(ciphertext)),
        };
    }



    async function decryptMessage({ iv, ciphertext }, key) {
        const dec = new TextDecoder();

        const decrypted = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: new Uint8Array(iv) },
            key,
            new Uint8Array(ciphertext)
        );

        return dec.decode(decrypted);
    }


    //   const runChatEncryption = async (chatId, salt, plainTextMessage) => {
    //     const key = await deriveKey(chatId, salt);
    //     const encrypted = await encryptMessage(plainTextMessage, key);

    //     console.log("Encrypted:", encrypted);

    //     const decrypted = await decryptMessage(encrypted, key);
    //     console.log("Decrypted:", decrypted);
    //   };












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
                                        className={`w-full flex ${isSameSender(session?.user?.email, item.sender?.email) ? "justify-end" : "justify-start"} py-2`}
                                    >
                                        <div
                                            className={`w-fit max-w-[40%] break-words px-3 rounded-lg py-2 my-2 ${isSameSender(session.user.email, item.sender?.email)
                                                ? 'bg-[#FFE893]'
                                                : 'bg-white'
                                                } shadow-lg`}
                                        >
                                            <p className="text-myblack">{item.content}</p>
                                            <p className="text-[10px] text-gray-400">
                                                {isSameSender(session.user.email, item.sender?.email)
                                                    ?
                                                    <>
                                                        {
                                                            item?.optimistic === true ?
                                                                <TbClockUp className='text-myblack text-sm' />
                                                                :
                                                                <MdDone className='text-myblack text-sm' />
                                                        }


                                                    </>
                                                    : item.sender?.name}
                                            </p>
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

                        <div ref={messagesEndRef} />

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
                                className="w-full h-14 p-3 text-lg focus:outline-none border border-background rounded-md resize-none overflow-hidden"
                                placeholder="Type messages here..."
                                value={text}
                                onChange={(e) => handleTyping(e, e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault(); // prevent newline
                                        sendMessage(e);
                                    }
                                }}
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