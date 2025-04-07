'use client'
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../lib/hooks/hook.js'
import { setUser } from '../../lib/features/users/userSlice.js'
import { fetchChats } from '@/lib/features/chats/chatSlice.js';
import axios from 'axios';
import { getsender } from '../config/messageConfig.js';
// import { headers } from 'next/headers.js';


function ListItems({ item, token, loggedUser }) {

    const [sender, setSender] = useState(null);

    const dispatch = useAppDispatch();



    const handleChat = async (item) => {

        try {
            const result = await axios.post(`${process.env.NEXT_PUBLIC_URL}/chat`, { userId: item._id }, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },

            })
            // console.log("result after creating chat----->", result);

            // console.log("chatname----->", item.users?item.users : "nothing" );

            // console.log("item.usersssssssssssss->",item.users);
            // console.log("senderd----->", item);

            if (item.isGroupChat) {
                dispatch(setUser({
                    name: item.chatName, 
                    email:"xyz@gmail.com",
                    picture: item.picture,
                    id: item._id,
                    members: item.users,
                    isGroupChat: item.isGroupChat,
                    admin: item.groupAdmin
                }))
                if (!item.users) {
                    dispatch(fetchChats({ token }));
                }
            }
            else {
                dispatch(setUser({
                    name: item.users ? sender?.name : item.name,
                    email: item.users ? sender?.email : item.email,
                    picture: item.users ? sender?.picture : item.picture,
                    id: result.data?._id,
                    members: result.data?.users,
                    isGroupChat: result.data.isGroupChat,
                    admin: "none"

                }))

                if (!item.users) {
                    dispatch(fetchChats({ token }));
                }
            }
        }
        catch (err) {
            console.log("Error at chatList--->", err);
        }

    }


    // const getsender=()=>{

    //     if(item.isGroupChat){

    //     }

    //     if (item.users) {
    //         const filteredSender = item.users.find((user) => user._id !== loggedUser.id);
    //         setSender(filteredSender);
    //     }
    // }

    useEffect(() => {
        setSender(getsender(item, loggedUser));
    }, [item.users, loggedUser.id])



    return (
        <div className="group border-b hover:bg-myyellow border-b-background text-center h-16 flex items-center px-2 hover:cursor-pointer" onClick={() => handleChat(sender!=null ? sender : item)}>
            <div className='rounded-full' width={50} height={50}>
                <Image src={item.users ? (item.isGroupChat ? item.picture : sender?.picture) : item.picture} alt="User Avatar" width={50} height={50} className="rounded-full" />
            </div>

            <div className='w-[60%] text-left m-auto'>
                <p className='text-textcolor group-hover:text-myblack'>{item.name ? item.name : (item.isGroupChat ? item.chatName : sender?.name)}</p>
                {item?.sender?.content && <p className='text-textcolor overflow-hidden text-md h-6'>{item.content}...</p>}
            </div>

        </div>
    );
}

export default ListItems;