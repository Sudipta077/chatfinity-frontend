'use client'
import Image from 'next/image';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/hook';
import { MdEdit } from "react-icons/md";
import { IoTrashBin } from "react-icons/io5";
import { HiUserAdd } from "react-icons/hi";
import toast from 'react-hot-toast';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { fetchChats } from '@/lib/features/chats/chatSlice';
import { IoClose } from "react-icons/io5";
import { setUser } from '@/lib/features/users/userSlice';
import { getsender } from '../config/messageConfig';
function ProfileModal({ toggleShow, profile }) {
    const user2 = useAppSelector((state) => state.user);
    const user = useAppSelector((state) => state.chat);
    const { data: session } = useSession();
    const [name, setName] = useState(profile.name?profile.name:profile.user.name);
    const [show, setShow] = useState(false);
    const [add, setAdd] = useState(false);
    const [selected, setSelected] = useState([]);

    const handleSelectUser = (item) => {
        const userId = getsender(item,session.user);

        if (!selected.some((user) => user.users[0]?._id === userId)) {
            setSelected((prev) => [...prev, item]);
        }
    };
    console.log("sesssion->",session.user);
    const dispatch = useAppDispatch();

    console.log("total ---->", user.chats);
    const totalUsers = user.chats;

    console.log("group members ---->", user2);
    const memberIds = user2.members.map(member => member._id);


    const addable = totalUsers.filter((item) => !memberIds.includes(getsender(item.users,session.user?.id)?._id) && !item.isGroupChat)
    console.log("addable--->", addable);
    const handleEdit = async (e) => {
        e.preventDefault();
        if (!session.user.token)
            return;
        try {
            const result = await axios.put(`${process.env.NEXT_PUBLIC_URL}/chat/renamegroup`, {
                chatId: user2.id,
                chatName: name
            }, {
                headers: {
                    Authorization: `Bearer ${session.user.token}`,
                    'Content-type': "application/json"
                }
            })
            toast.success("Group name updated.")
            dispatch(fetchChats({ token: session.user.token }));
            dispatch(setUser({
                            name: name,
                            email: user2.email,
                            picture: user2.picture,
                            id: user2.id,
                            members:user2.members,
                            isGroupChat : user2.isGroupChat
                        }))
            setShow(!show)
            console.log(result);
        }
        catch (err) {
            toast.error("Error Occurred");
            console.log(err);
        }
    }

    const handleRemoveUser = (userId) => {
        setSelected((prev) => prev.filter((user) => user.users[0]?._id !== userId));
    };

    async function removeUser(item) {

        try {
            const result = await axios.post(`${process.env.NEXT_PUBLIC_URL}/chat/groupremove`, {
                chatId: user2.id,
                userId: item._id
            }, {
                headers: {
                    Authorization: `Bearer ${session.user.token}`,
                    'Content-type': 'application/json'
                }
            })
            toast.success("Member has been removed.");
            dispatch(fetchChats({ token: session.user.token }));
            const newMembers = user2.members.filter((member)=>member._id!=item._id);
            console.log("newmembers-->",newMembers);
            dispatch(setUser({
                ...user2, // Spread existing user details
                members: newMembers // Update only the members list
            }));
            setShow(!show);
        }
        catch (err) {
            toast.error("Error occurred");
            console.log(err);
        }

    }

    const addMember=async()=>{
        const userIds= selected.map((item)=>item.users[0]._id);
        // console.log("selected---->",userIds);
        try{
            const result = await axios.post(`${process.env.NEXT_PUBLIC_URL}/chat/groupadd`,{
                chatId:user2.id,
                userId:userIds
            },{
                headers:{
                    Authorization:`Bearer ${session.user.token}`,
                    'Content-type':'application/json'
                }
            })
            toast.success("Member added")
            const newMembers = [...user2.members, ...selected.map((item) => ({ _id: item.users[0]._id,picture:item.users[0].picture,name:item.users[0].name }))];
            console.log("newmembers-->",newMembers);
            dispatch(setUser({
                ...user2, // Spread existing user details
                members: newMembers // Update only the members list
            }));
            setSelected([]);
            console.log(result);
        }
        catch(err){
            toast.error("Error Occurred");
            console.log(err);
        }
    
    }


    const handleDelete = (e, item) => {
        e.preventDefault();
        console.log(item);
        toast.custom((t) => (
            <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <Image src={item.picture} width={50} height={50} alt='user' />
                        </div>
                        <div className="ml-3 flex-1">

                            <p className="mt-1 text-sm text-gray-500">
                                Do you want to remove <span className='font-bold'>{item.name}</span>
                            </p>

                        </div>
                    </div>
                </div>
                <div className="flex border-l border-gray-200">
                    <button
                        onClick={() => { toast.dismiss(t.id); removeUser(item) }}
                        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Yes
                    </button>
                </div>
            </div>
        ))

    }


    console.log("profileeeeeeeeeeeeee--->",profile);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="max-h-[500px] bg-background justify-center w-[500px] p-5 rounded-lg shadow-lg overflow-auto">


                <Image src={profile.picture ? profile.picture : profile.user.pic } width={100} height={100} alt='image' className='rounded-full m-auto' />


                {
                    show
                        ?
                        <div className="flex justify-center items-center gap-2 mt-5">

                            <input className="text-textcolor text-2xl bg-foreground rounded focus:outline-none" type='text' value={name} onChange={(e) => setName(e.target.value)} />

                            <div className='flex gap-2 items-center'>
                                <button className='bg-mygreen rounded px-2 py-1 text-myblack' onClick={handleEdit}>OK</button>

                                <button className='bg-mygreen rounded px-2 py-1 text-myblack' onClick={() => setShow(!show)}>Cancel</button>

                            </div>

                        </div>
                        :
                        <div className="flex justify-center items-center gap-2 mt-5">
                            <h1 className="text-textcolor text-2xl text-center">{name}</h1>
                            {user2.isGroupChat &&
                                <MdEdit className="text-textcolor text-xl cursor-pointer" onClick={() => setShow(!show)} />
                            }
                        </div>

                }


                <h1 className="text-textcolor mt-3 text-md text-center">{profile.email?profile.email:profile.user.email}</h1>

                {!profile.user && user2.isGroupChat && user2.members.map((item, key) => (
                    <div key={key} className="flex items-center h-16 justify-start bg-myyellow rounded mt-2 px-2 py-1">
                        <div className="w-1/4">
                            <Image src={item.picture} width={50} height={50} alt='image' className='rounded-full m-auto' />
                        </div>
                        <h1 className="w-3/4 text-myblack text-md">{item.name}</h1>
                        <button onClick={(e) => handleDelete(e, item)}>
                            <IoTrashBin className='text-myblack text-xl' />
                        </button>
                    </div>
                ))}


                {/* select users */}


                {
                    user2.isGroupChat && add &&
                    <div className="flex-col">

                        <div className="mt-2 relative inline-flex items-center px-3 py-2 bg-myyellow rounded-l-md w-full">
                            <select
                                className="bg-myyellow appearance-none focus:outline-none text-sm text-textcolor w-full px-2"
                                name="members"
                                id="members"
                                onChange={(e) => {
                                    const selectedUser = addable.find(item =>
                                      getsender(item, session.user)?._id === e.target.value
                                    );
                                    if (selectedUser) handleSelectUser(selectedUser);
                                  }}
                                
                            >
                                <option value="" className='text-myblack px-2'>Select a user</option>
                                
                                {    addable && addable.map((item, key) => 
                                    

                                         (
                                        <option key={key} value={getsender(item, session.user)?._id} className='text-textcolor px-2'>
                                            {getsender(item, session.user)?.name}
                                        </option>
                                    ))}
                                
                            </select>
                        </div>

                        {selected.length > 0 && (
                            <div className="mt-4">
                                <h2 className="text-textcolor text-lg font-semibold">Selected Members:</h2>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selected.map((item, key) => (
                                        <div key={key} className="flex items-center bg-mygreen px-3 py-1 rounded text-myblack">
                                            <span>{item.users[0]?.name}</span>
                                            <IoClose
                                                className="ml-2 text-lg cursor-pointer text-myblack"
                                                onClick={() => handleRemoveUser(item.users[0]?._id)}
                                            />
                                        </div>
                                    ))}
                                </div>

                            </div>
                        )}


                    </div>
                }
                <div className='flex gap-5 justify-end'>

                    {user2.isGroupChat &&

                        <button onClick={() => setAdd(!add)} className="mt-5 float-right bg-mygreen px-5 py-2 rounded border-b border-b-green-700">
                            <HiUserAdd className='text-xl' /></button>
                    }

                    {selected.length > 0 ?
                        <button onClick={addMember} className="mt-5 float-right bg-mygreen px-5 py-2 rounded border-b border-b-green-700">
                            Add
                        </button>
                        :

                        <button onClick={toggleShow} className="mt-5 float-right bg-mygreen px-5 py-2 rounded border-b border-b-green-700">
                            OK
                        </button>
                    }
                </div>
            </div>
        </div>
    );
}

export default ProfileModal;
