'use client'
import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";

function GroupCreate({ token, onShow, users }) {
    const [selected, setSelected] = useState([]);

    console.log("users from group --->", users);

    // Function to add a user to the selected list
    const handleSelectUser = (item) => {
        const userId = item.users[0]?._id;

        // Check if the user is already in the selected list
        if (!selected.some((user) => user.users[0]?._id === userId)) {
            setSelected((prev) => [...prev, item]);
        }
    };

    // Function to remove a user from the selected list
    const handleRemoveUser = (userId) => {
        setSelected((prev) => prev.filter((user) => user.users[0]?._id !== userId));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-background p-5 rounded-lg shadow-lg flex-col items-center justify-center w-[500px] overflow-y-auto max-h-[500px]">
                {/* Close Modal Button */}
                <IoClose className='text-2xl text-textcolor float-right hover:cursor-pointer hover:bg-background bg-opacity-55' onClick={onShow} />

                <h1 className='text-center text-textcolor text-xl'>Create Group</h1>
                <form action="" className='flex-col flex'>
                    {/* Group Name Input */}
                    <input type="text" id='name' name='name' placeholder='Group Name' 
                        className='focus:outline-none bg-foreground text-textcolor text-xl px-2 py-1 rounded placeholder:font-light mt-5' 
                    />

                    {/* Search for Members */}
                    <div className="w-full max-w-xs mt-5">
                        <div className="flex-col">
                            {/* Members Dropdown */}
                            <div className="mt-2 relative inline-flex items-center px-3 py-2 bg-foreground rounded-l-md w-full">
                                <select
                                    className="appearance-none focus:outline-none text-sm text-textcolor w-full px-2 bg-foreground"
                                    name="members"
                                    id="members"
                                    onChange={(e) => {
                                        const selectedUser = users.find(user => user.users[0]?._id === e.target.value);
                                        if (selectedUser) handleSelectUser(selectedUser);
                                    }}
                                >
                                    <option value="" className='text-textcolor px-2'>Select a user</option>
                                    {
                                        users && users.map((item, key) => (
                                            <option key={key} value={item.users[0]?._id} className='text-textcolor px-2'>
                                                {item.users[0]?.name}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Display Selected Members */}
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

                    {/* Submit Button */}
                    <button type='submit' className='bg-mygreen px-3 py-2 mt-5 rounded text-myblack text-xl'>
                        Create
                    </button>
                </form>
            </div>
        </div>
    );
}

export default GroupCreate;
