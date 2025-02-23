import React from 'react';
import Image from 'next/image';
import { messages } from '../data/users.js';
import { useAppSelector } from '../../lib/hooks/hook.js';
import { IoSend } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import ChatDefault from './ChatDefault.jsx';

function ChatPage() {
    const user = useAppSelector((state) => state.user);

    // if (!user?.id) {
    //     console.log("No user");
    // } else {
    //     console.log(user);
    // }

    return (
        <>
            { !user?.id ? ( 
                <ChatDefault />
            ) : (
                <div className="w-3/4 max-h-screen relative">
                    {/* Chat Header */}
                    <div className="h-16 bg-myyellow w-full px-5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Image src={user.picture} width={40} height={40} alt="User" className="rounded-full" />
                            <h2 className="text-[#303841] font-medium text-3xl">{user.name}</h2>
                        </div>

                        <button>
                            <BsThreeDotsVertical className="text-2xl text-[#303841]" />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="p-4">
                        {messages && messages.map((item, key) => (
                            <li className="text-textcolor" key={key}>
                                {item.content}
                            </li>
                        ))}
                    </div>

                    {/* Message Input */}
                    <div className="absolute bottom-0 w-full flex items-center gap-2 p-2 bg-background">
                        <input 
                            type="text" 
                            className="w-full h-12 px-3 text-lg focus:outline-none border border-background rounded-md"
                            placeholder="Type messages here..."
                        />
                        <button>
                            <IoSend className="text-4xl hover:cursor-pointer text-myyellow bg-background" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default ChatPage;
