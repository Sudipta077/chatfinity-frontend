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
import { TfiClip } from "react-icons/tfi";
import { IoMdClose } from "react-icons/io";
import ImageMessage from './ImageMessage.jsx';
import LoadingModal from './Loading.jsx';
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
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const isAiChat = user?.id === "artificial intelligence";

    // console.log("user-=--->",user);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, istyping]);


    // console.log("selected file ----->", file);

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

            const encryptedMessages = result.data;

            const key = await deriveKey(user.id, user.salt);

            const decryptedMessages = await Promise.all(
                encryptedMessages.map(async (msg) => {

                    try {
                        const parsed = JSON.parse(msg.content);
                        const decrypted = await decryptMessage(parsed, key);
                        return {
                            ...msg,
                            content: decrypted,
                        };
                    } catch (e) {
                        console.error("Failed to decrypt message:", e);
                        return msg;
                    }

                })
            );


            setLoading(false);
            setMessages(decryptedMessages);
            // console.log("all messages---->", result.data);
            // console.log("all messages after decypt---->", decryptedMessages);


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
                createdAt: Date.now(),
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

                // console.log("Encrypted:", encrypted);

                let msg = {
                    content: JSON.stringify(encrypted),
                    chatId: user.id,
                    sender: {
                        email: session.user?.email,
                        name: session.user?.name
                    },
                    createdAt: Date.now()
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

    async function sendFile(e) {
        e.preventDefault();

        const userFile = file;
        setFile(null);


        try {

            const result = await axios.put(
                `${process.env.NEXT_PUBLIC_URL}/message/sendFile/${user.id}`,
                {
                    fileName: userFile.name,
                    fileSize: userFile.size,
                    fileType: userFile.type
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-type': 'application/json'
                    }
                }
            );

            // console.log("result of sendFIle-->", result.data.url);

            const presignedUrl = result.data.url;
            const s3key = result.data.key;
            // console.log("keyyyyy opti->", s3key);
            // console.log("url->",presignedUrl);


            const tempId = `temp-${Date.now()}`;
            const optimisticMsg = {
                _id: tempId,
                content: s3key,
                sender: {
                    name: session?.user?.name,
                    email: session?.user?.email,
                    picture: session?.user?.image,
                },
                messageType: 'image',
                key: imagePreview,
                createdAt: Date.now(),
                optimistic: true,
                loading: true,

            };

            // 1. Show the message immediately
            setMessages((prev) => [...prev, optimisticMsg]);

            // setMessages((prevMessages) =>
            //     prevMessages.map(msg =>
            //         msg.optimistic && msg.content === ''
            //             ? { ...msg, content: s3key }
            //             : msg
            //     )
            // );


            // 2. Upload the file directly to S3 using the presigned URL
            const uploaded = await axios.put(presignedUrl, userFile, {
                headers: {
                    'Content-Type': userFile.type
                }
            });
            if (uploaded.status === 200) {
                // toast.success("File uploaded successfully!");

                let messageType = 'file';
                if (userFile.type) {

                    if (userFile.type.startsWith('image/')) {
                        messageType = 'image';
                    } else if (userFile.type.startsWith('application/')) {
                        messageType = 'file';
                    }
                }

                const key = await deriveKey(user.id, user.salt);
                const encrypted = await encryptMessage(s3key, key);


                let msg = {
                    content: JSON.stringify(encrypted),
                    chatId: user.id,
                    sender: {
                        email: session.user?.email,
                        name: session.user?.name
                    },
                    messageType: messageType,
                    fileName: userFile.name,
                    fileSize: userFile.size,
                    mimeType: userFile.type,
                }
                // console.log("Session------>",session.user);
                socket.emit('new message', msg);
            }
            else {
                throw new Error("Error occurred to upload in s3");
            }

        }
        catch (err) {
            console.log("Error to send file :", err);
            toast.error("Error to send file");
        }

    }

    async function getFile(key) {

        try {
            const result = await axios.get(`${process.env.NEXT_PUBLIC_URL}/message/getFile`, { key: key }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-type': 'application/json'
                }
            });
            // console.log("get FIle url ::::->", result);
            return result.url;
        }
        catch (err) {
            console.log("Failed to get image");
        }
    }


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
        socket.on('message received', async (newMessage) => {
            // console.log("newMessage.chat._id------------------------>", newMessage.chat._id)
            // console.log("selectedChatCompare.id------------------------>", selectedChatCompare.id)
            // console.log("recvd msg ----->", newMessage);
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
                // console.log("keyyyyy on rcv->", newMessage.message.content);


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

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getFileSize = (size) => {

        const mb = size / (1024 * 1024);
        if (mb >= 1) {
            return mb.toFixed(2) + " MB";
        } else {
            const kb = size / 1024;
            return kb.toFixed(2) + " KB";
        }

    }

    // console.log("messages------->", messages);

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

                                        {

                                            item.messageType === 'image' ?

                                                item.loading === true ?
                                                    <div className="relative w-40 h-40">
                                                        {/* The image itself */}
                                                        <Image
                                                            src={imagePreview}
                                                            width={160}
                                                            height={160}
                                                            className="w-40 h-40 object-cover rounded-md"
                                                            alt="Uploading..."
                                                        />

                                                        {/* Overlay loader */}
                                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-md">
                                                            <div className="animate-spin h-10 w-10 border-t-4 border-yellow-400 border-solid rounded-full"></div>
                                                        </div>
                                                    </div>

                                                    :
                                                    <ImageMessage item={item} token={token} />


                                                :

                                                <div
                                                    className={`w-fit max-w-[40%] break-words px-3 rounded-lg py-2 my-2 ${isSameSender(session.user.email, item.sender?.email)
                                                        ? 'bg-[#FFE893]'
                                                        : 'bg-white'
                                                        } shadow-lg`}
                                                >
                                                    <p className="text-myblack">{item.content}</p>
                                                    <div className="text-[10px] text-gray-400">
                                                        {isSameSender(session.user.email, item.sender?.email)
                                                            ?
                                                            <>
                                                                {
                                                                    item?.optimistic === true ?
                                                                        <div className='flex gap-2'>

                                                                            <p className='text-myblack text-[10px]'>{formatTime(item?.createdAt)}</p>
                                                                            <TbClockUp className='text-myblack text-sm' />
                                                                        </div>

                                                                        :
                                                                        <div className='flex gap-2'>
                                                                            <p className='text-myblack text-[10px]'>{formatTime(item?.createdAt)}</p>
                                                                            <MdDone className='text-myblack text-sm' />
                                                                        </div>
                                                                }


                                                            </>
                                                            :
                                                            // <div className='flex justify-between gap-5'>
                                                            /* {item.sender?.name} */
                                                            <p className='text-[10px]'>{formatTime(item?.createdAt)}</p>
                                                            // </div>

                                                        }
                                                    </div>
                                                </div>
                                        }
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
                        {file && (
                            <div className="h-20 w-fit bg-myyellow rounded px-2 py-2 ml-2 flex items-center gap-2">
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="preview"
                                        className="w-14 h-14 rounded shadow-md"
                                    />
                                )}

                                <div className="relative">
                                    <IoMdClose
                                        className="absolute top-[-40px] right-[-20px] bg-background bg-opacity-50 rounded-full text-3xl hover:cursor-pointer text-red-600 p-1"
                                        onClick={() => setFile(null)}
                                    />
                                    <div className="flex flex-col text-sm">
                                        <span className="font-medium text-myblack">{file.name}</span>
                                        <span className="text-[10px] text-myblack">
                                            {getFileSize(file.size)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="w-full relative flex items-center gap-2 p-2 bg-background">
                            {!isAiChat &&
                                <div className='bg-myyellow h-14 w-14 rounded p-2 hover:cursor-pointer grid items-center' onClick={() => fileInputRef.current.click()}>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*,application/pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const MAX_SIZE = 20 * 1024 * 1024; // 20MB in bytes

                                                if (file.size > MAX_SIZE) {
                                                    toast.error("File size should be less than 20Mb.");
                                                    e.target.value = ""; // reset input
                                                    return;
                                                }
                                                // console.log("Selected file:", file);
                                                setFile(file);

                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setImagePreview(reader.result); // base64 string
                                                };
                                                reader.readAsDataURL(file);
                                                // handle upload logic here
                                            }
                                        }}
                                    />
                                    <TfiClip className='text-gray-800 text-3xl' />
                                </div>
                            }
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
                            <button onClick={file === null ? sendMessage : sendFile}>
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