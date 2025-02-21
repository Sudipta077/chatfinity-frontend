"use client";
import React, { useEffect, useState } from "react";
import logo from "../../../public/logoheader.png";
import Image from "next/image";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import headerimage from "../../../public/headerimg2.jpg";

function Header(props) {
  // Manage dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false);



  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="w-full bg-myyellow dark:bg-zinc-800 h-fit flex py-0 px-2 sm:px-7 sm:py-0 items-center justify-between">
      <Image src={logo} className="sm:w-24 sm:h-24 w-12 h-12" alt="" />
      <Image src={headerimage} className="h-12 sm:h-24 w-fit" alt="" />

      <div className="flex gap-5">
        {/* Dark Mode Toggle */}
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

        {/* Logout Button */}
        <button
          className="bg-red-400 sm:px-5 sm:py-2 px-2 py-1 sm:text-lg text-sm rounded-lg h-fit border-b-[5px] text-foreground border-r border-b-red-700 border-r-red-700"
          onClick={() => {
            signOut({ callbackUrl: "/login" });
            toast.success("Logged out");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Header;
