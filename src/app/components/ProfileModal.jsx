import Image from 'next/image';
import React from 'react';
import { useAppSelector } from '@/lib/hooks/hook';
import { MdEdit } from "react-icons/md";
import { IoTrashBin } from "react-icons/io5";
import { HiUserAdd } from "react-icons/hi";
function ProfileModal({ user, toggleShow }) {
    const user2 = useAppSelector((state) => state.user);
    console.log("user from profile ---->", user2);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="max-h-[500px] bg-background justify-center w-[500px] p-5 rounded-lg shadow-lg overflow-auto">
                <Image src={user2.picture} width={100} height={100} alt='image' className='rounded-full m-auto' />



                {/* Centered Name with Edit Icon */}
                <div className="flex justify-center items-center gap-2 mt-5">
                    <h1 className="text-textcolor text-2xl text-center">{user2.name}</h1>
                    <MdEdit className="text-textcolor text-xl cursor-pointer" />
                </div>

                <h1 className="text-textcolor mt-3 text-md text-center">{user2.email}</h1>

                {user2.isGroupChat && user2.members.map((item, key) => (
                    <div key={key} className="flex items-center h-16 justify-start bg-myyellow rounded mt-2 px-2 py-1">
                        <div className="w-1/4">
                            <Image src={item.picture} width={50} height={50} alt='image' className='rounded-full m-auto' />
                        </div>
                        <h1 className="w-3/4 text-myblack text-md">{item.name}</h1>
                    <button>
                    <IoTrashBin className='text-myblack text-xl' />
                    </button>
                    </div>
                ))}
              <div className='flex gap-5'>
              <button onClick={toggleShow} className="mt-5 float-right bg-mygreen px-5 py-2 rounded border-b border-b-green-700">
                    <HiUserAdd className='text-xl' /></button>
                <button onClick={toggleShow} className="mt-5 float-right bg-mygreen px-5 py-2 rounded border-b border-b-green-700">
                    OK
                </button>
              </div>
            </div>
        </div>
    );
}

export default ProfileModal;
