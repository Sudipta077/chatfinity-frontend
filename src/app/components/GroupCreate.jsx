'use client'
import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { IoClose } from "react-icons/io5";
import { useAppDispatch } from '@/lib/hooks/hook';
import { fetchChats } from '@/lib/features/chats/chatSlice';
import { getsender } from '../config/messageConfig';
function GroupCreate({ userSession, onShow, users }) {
    const [selected, setSelected] = useState([]);
    const [name,setName] = useState("");
    const dispatch = useAppDispatch();
    const token = userSession.user?.token
    // console.log("users from group --->", users);

    // Function to add a user to the selected list
    const handleSelectUser = (item) => {
        const userId = getsender(item, userSession.user)?._id;

        // if (!selected.some((user) => user.users[0]?._id === userId)) {
            setSelected((prev) => [...prev, item]);
            
            // }
        };
        // console.log("selected---->", selected);

  
    const handleRemoveUser = (userId) => {
        setSelected((prev) => prev.filter((user) => user.users[0]?._id !== userId));
    };


    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(selected.length<2){
            toast.error("Select more than 2 members.");
            return;
        }
        else if(name==""){
            toast.error("Group name is empty.")
            return;
        }
        else{

            try{
                let userIds=[];
                selected.forEach((elem)=>userIds.push(getsender(elem,userSession.user)._id));  
                console.log("group members-->",userIds);
                const result = await axios.post(`${process.env.NEXT_PUBLIC_URL}/chat/group`,{
                    name:name.trim(),
                    users:userIds
                },{
                    headers:{
                        Authorization:`Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                })
    
                // console.log("result after group--->",result);
                dispatch(fetchChats({token}));
                onShow();
            }
            catch(err){
                toast.error("Error Occurred");
                console.log(err);
            }
           
        }
    }


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-background p-5 rounded-lg shadow-lg flex-col items-center justify-center w-[500px] overflow-y-auto max-h-[500px]">
             
                <IoClose className='text-2xl text-textcolor float-right hover:cursor-pointer hover:bg-background bg-opacity-55' onClick={onShow} />

                <h1 className='text-center text-textcolor text-xl'>Create Group</h1>
                <form action="" className='flex-col flex' onSubmit={handleSubmit}>
                 
                    <input type="text" id='name' name='name' onChange={(e)=>setName(e.target.value)} placeholder='Group Name' 
                        className='focus:outline-none bg-foreground text-textcolor text-xl px-2 py-1 rounded placeholder:font-light mt-5' 
                    />

           
                    <div className="w-full max-w-xs mt-5">
                        <div className="flex-col">
                      
                            <div className="mt-2 relative inline-flex items-center px-3 py-2 bg-foreground rounded-l-md w-full">
                                <select
                                    className="appearance-none focus:outline-none text-sm text-textcolor w-full px-2 bg-foreground"
                                    name="members"
                                    id="members"
                                    onChange={(e) => {
                                        const selectedUser = users.find(user => getsender(user, userSession.user)?._id === e.target.value);

                                        if (selectedUser) {
                                            console.log("selecteduser---->", selectedUser);
                                            handleSelectUser(selectedUser);

                                        }
                                    }}
                                >
                                    <option value="" className='text-textcolor px-2'>Select a user</option>
                                    {
                                        users && users.slice().filter((item)=>!item.isGroupChat).map((item, key) => (
                                            <option key={key} value={getsender(item,userSession.user)._id} className='text-textcolor px-2'>
                                                {getsender(item,userSession.user).name}
                                                {getsender(item,userSession.user).email}

                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
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
            
                    <button type='submit' className='bg-mygreen px-3 py-2 mt-5 rounded text-myblack text-xl'>
                        Create
                    </button>

                </form>
            </div>
        </div>
    );
}

export default GroupCreate;
