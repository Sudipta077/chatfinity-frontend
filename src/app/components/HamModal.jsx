'use client'
import React, { useState, useEffect } from 'react';
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import Image from 'next/image';

function HamModal({ user }) {
    const [showProfile, setShowProfile] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Check localStorage and apply the theme when the component mounts
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark") {
            document.documentElement.classList.add("dark");
            setIsDarkMode(true);
        } else {
            document.documentElement.classList.remove("dark");
            setIsDarkMode(false);
        }
    }, []);

    const toggleShow = () => {
        setShowProfile(!showProfile);
    }

    const toggleTheme = () => {
        const newTheme = isDarkMode ? "light" : "dark";
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark");
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className="absolute top-[90px] right-6 flex transition z-50">
            <div className="bg-background text-textcolor h-fit w-32 p-2 rounded-lg shadow-lg">
                <label className="inline-flex items-center relative">
                    <input
                        className="peer hidden"
                        id="toggle"
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={toggleTheme}
                    />
                    <div
                        className="relative w-[70px] h-[35px] bg-white dark:bg-zinc-500 rounded-full
                        after:absolute after:content-[''] after:w-[28px] after:h-[28px]
                        after:bg-gradient-to-r from-orange-500 to-yellow-400 dark:after:from-zinc-900 dark:after:to-black
                        after:rounded-full after:top-[3.5px] after:left-[3.5px] 
                        peer-checked:after:left-[66px] peer-checked:after:translate-x-[-100%]
                        shadow-sm duration-300 after:duration-300 after:shadow-md"
                    ></div>

                    {/* Sun Icon (Light Mode) */}
                    <svg
                        height="0"
                        width="20"
                        viewBox="0 0 24 24"
                        className="fill-white dark:opacity-60 absolute w-4 h-4 left-[7px]"
                    >
                        <path d="M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5,5,2.24,5,5-2.24,5-5,5ZM13,0h-2V5h2V0Zm0,19h-2v5h2v-5ZM5,11H0v2H5v-2Zm19,0h-5v2h5v-2Zm-2.81-6.78l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54ZM7.76,17.66l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54Zm0-11.31l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Zm13.44,13.44l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Z"></path>
                    </svg>

                    {/* Moon Icon (Dark Mode) */}
                    <svg
                        height="512"
                        width="512"
                        viewBox="0 0 24 24"
                        className="fill-black opacity-60 peer-checked:opacity-70 peer-checked:fill-white absolute w-4 h-4 right-[7px]"
                    >
                        <path d="M12.009,24A12.067,12.067,0,0,1,.075,10.725,12.121,12.121,0,0,1,10.1.152a13,13,0,0,1,5.03.206,2.5,2.5,0,0,1,1.8,1.8,2.47,2.47,0,0,1-.7,2.425c-4.559,4.168-4.165,10.645.807,14.412h0a2.5,2.5,0,0,1-.7,4.319A13.875,13.875,0,0,1,12.009,24Z"></path>
                    </svg>
                </label>

                <p className='border-b hover:cursor-pointer py-1 mt-2' onClick={toggleShow}>Profile</p>

                <p className='hover:cursor-pointer py-1 text-red-500' onClick={() => {
                    signOut({ callbackUrl: "/login" });
                    toast.success("Logged out");
                }}>
                    Logout
                </p>
            </div>

            {showProfile &&
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-background h-72 w-72 p-5 rounded-lg shadow-lg">
                        <Image src={user?.user?.pic} width={100} height={100} alt='image' className='rounded-full m-auto'></Image>
                        <h1 className='text-textcolor mt-5 text-2xl text-center'>{user?.user?.name}</h1>
                        <h1 className='text-textcolor mt-5 text-md text-center'>{user?.user?.email}</h1>
                        <button onClick={toggleShow} className='mt-5 float-right bg-mygreen px-5 py-2 rounded border-b border-b-green-700'>OK</button>
                    </div>
                </div>
            }
        </div>
    );
}

export default HamModal;
