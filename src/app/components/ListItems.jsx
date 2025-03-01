'use client'
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../lib/hooks/hook.js'
import { setUser } from '../../lib/features/users/userSlice.js'
import { fetchChats } from '@/lib/features/chats/chatSlice.js';
import axios from 'axios';
import { getsender } from '../config/messageConfig.js';
// import { headers } from 'next/headers.js';


function ListItems({ item, token , loggedUser}) {

    const[sender,setSender] = useState(null);
    
    const dispatch = useAppDispatch();

    

    const handleChat = async (item) => {

        try {
            const result = await axios.post(`${process.env.NEXT_PUBLIC_URL}/chat`, { userId: item.users ? item.users[0]._id : item._id }, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },

            })
            console.log("result after creating chat----->", result);

            dispatch(setUser({
                name: sender?.name,
                email: sender?.email,
                picture: sender?.picture,
                id: result.data?._id,
                members: result.data?.users,
                isGroupChat: result.data.isGroupChat
            }))

            if (!item.users) {
                dispatch(fetchChats({ token }));
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
    
    useEffect(()=>{
        setSender(getsender(item,loggedUser));
    },[item.users,loggedUser.id])
    
    // console.log("sender----->",sender);

    return (
        <div className="group border-b hover:bg-myyellow border-b-background text-center h-16 flex items-center px-2 hover:cursor-pointer" onClick={() => handleChat(item)}>
            <div className='rounded-full' width={50} height={50}>
                <Image src={item.users ? sender?.picture : item.picture} alt="User Avatar" width={50} height={50} className="rounded-full" />
            </div>

            <div className='w-[60%] text-left m-auto'>
                <p className='text-textcolor group-hover:text-myblack'>{item.chatName ? item.chatName : sender?.name}</p>
                {item?.sender?.content && <p className='text-textcolor overflow-hidden text-md h-6'>{item.content}...</p>}
            </div>

        </div>
    );
}

export default ListItems;