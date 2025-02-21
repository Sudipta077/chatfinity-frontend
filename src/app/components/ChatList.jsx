import React, { useState } from 'react';
import SearchChat from './SearchChat';
import { messages } from '../data/users.js';
import Image from 'next/image';
function ChatList(props) {
    const [users, setUsers] = useState(messages);
    const onSearch = (name) => {
        if (name.trim() === "") {
            setUsers(messages); // Reset when search is empty
        } else {
            const filtered = messages.filter((item) =>
                item.sender.name.toLowerCase().includes(name.toLowerCase()) // Case-insensitive search
            );
            setUsers(filtered);
        }
    };

    return (
        <div className="w-1/4 max-h-screen flex flex-col relative overflow-hidden">

            <div className="sticky top-0 bg-foreground z-10">
                <SearchChat onSearch={onSearch} />
            </div>


            <div className="overflow-y-auto flex-1 mt-3 min-h-screen">
                {users && users.map((item, key) => (
                    <div key={key} className="border-b border-b-background text-center h-16 flex items-center px-2">
                        <div className='rounded-full' width={50} height={50}>
                            <Image src={item.sender.pic} alt="User Avatar" width={50} height={50} className="rounded-full" />
                        </div>

                        <div className='w-[60%] text-left m-auto'>
                            <p className='text-textcolor'>{item.sender.name}</p>
                            <p className='text-textcolor overflow-hidden text-md h-6'>{item.content}...</p>
                        </div>
                        <div className='h-7 w-7 grid place-content-center bg-myyellow rounded-full p-1 text-xs text-foreground'>
                            12
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChatList;
