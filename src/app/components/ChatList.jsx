'use client'
import React, { useEffect, useState } from 'react';
import SearchChat from './SearchChat';
import { messages } from '../data/users.js';
import SideDrawer from "./SideDrawer";
import ListItems from './ListItems';
import { MdGroups } from "react-icons/md";
import Tooltip from '@mui/material/Tooltip';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import ListLoader from './ListLoader';
import Image from 'next/image';
import notfound from '../../../public/searchResult.png'
import { useAppSelector, useAppDispatch } from '../../lib/hooks/hook.js';
import { fetchChats } from "../../lib/features/chats/chatSlice.js";
import GroupCreate from './GroupCreate';
import { BsStars } from "react-icons/bs";
import { setUser } from '../../lib/features/users/userSlice.js'


function ChatList(props) {
    const [users, setUsers] = useState(messages);
    const [chats, setChats] = useState([]);
    const [showGroup, setShowGroup] = useState(false);
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.chat);

    // console.log("data set from chat-->", user);
    const token = session?.user?.token;
    const loggedUser = session?.user;

    const onSearch = (name) => {
        const newarr = user.chats.filter((item) => item.users && item.users[0].name.toLowerCase().includes(name.toLowerCase()));
        setChats(newarr);
    };

    // Fetch chats when session is available
    useEffect(() => {
        if (token) {
            dispatch(fetchChats({ token }));
        }
    }, [dispatch, token]);

    const handleAi = (e) => {
        dispatch(setUser({
            name:"Chatfinity Assistant",
            email: "",
            picture: "/logoheader.png",
            id:"artificial intelligence",
            members: [],
            isGroupChat: false,
            admin: "none"

        }));
    }

    // Update state when user.chats changes
    useEffect(() => {
        setChats(user.chats);
    }, [user.chats]); // Runs only when user.chats updates

    // console.log("all chatsss------->",chats);

    return (
        <div className="w-1/4 max-h-screen flex flex-col relative overflow-hidden">
            <div className="sticky top-0 bg-foreground z-10">
                <div className='flex justify-between px-2 items-center'>
                    <h1 className='text-2xl text-textcolor font-semibold'>Chats</h1>
                    <div className='flex gap-2'>
                        <Tooltip title="Chat with ai" onClick={handleAi}>

                            <BsStars className='bg-gradient-to-r from-indigo-400 to-cyan-400 text-foreground w-16 h-7 hover:cursor-pointer rounded m-auto px-6 text-sm' />
                        </Tooltip>

                        <Tooltip title="Create or Join a Group" onClick={() => setShowGroup(!showGroup)}>
                            <MdGroups className='bg-myyellow text-foreground w-16 h-7 hover:cursor-pointer rounded m-auto px-1 text-2xl' />
                        </Tooltip>
                        <SideDrawer className="bg-myyellow" />
                    </div>
                </div>
                <SearchChat onSearch={onSearch} />
            </div>

            {loading ? (
                <ListLoader />
            ) : chats.length > 0 ? (
                <div className="overflow-y-auto flex-1 mt-3 max-h-screen">
                    {chats.slice().reverse().map((item, key) => (
                        <ListItems item={item} key={key} token={token} loggedUser={loggedUser} />
                    ))}
                </div>
            ) : (
                <Image src={notfound} width={300} height={300} alt='not found' className='m-auto' />
            )}

            {
                showGroup &&
                <GroupCreate userSession={session} onShow={() => setShowGroup(!showGroup)} users={user.chats} />
            }


        </div>
    );
}

export default ChatList;