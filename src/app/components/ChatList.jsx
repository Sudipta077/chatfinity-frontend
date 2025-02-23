'use client'
import React, { useState } from 'react';
import SearchChat from './SearchChat';
import { messages } from '../data/users.js';
import SideDrawer from "./SideDrawer";
import ListItems from './ListItems';
import { MdGroups } from "react-icons/md";
import Tooltip from '@mui/material/Tooltip';
function ChatList(props) {
    const [users, setUsers] = useState(messages);

    const onSearch = (name) => {
        console.log(name);
    };


    return (
        <div className="w-1/4 max-h-screen flex flex-col relative overflow-hidden">

            <div className="sticky top-0 bg-foreground z-10">
                <div className='flex justify-between px-2 items-center'>
                    <h1 className='text-2xl text-textcolor font-semibold'>Chats</h1>
                    <div className='flex gap-2'>
                        <Tooltip title="Create or Join a Group">
                            <MdGroups className='bg-myyellow text-foreground w-16 h-7 hover:cursor-pointer rounded m-auto px-1 text-2xl' />
                        </Tooltip>

                       
                            <SideDrawer />
                     
                    </div>
                </div>
                <SearchChat onSearch={onSearch} />
            </div>


            <div className="overflow-y-auto flex-1 mt-3 min-h-screen">
                {users && users.map((item, key) => (
                    <ListItems item={item} key={key} />
                ))}
            </div>
        </div>
    );
}

export default ChatList;
