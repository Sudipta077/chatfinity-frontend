import React from 'react';
import logo from '../../../public/logoheader.png'
import Image from 'next/image';
function Header(props) {
    return (
        <div className='w-full bg-[#FFB22C] h-fit flex px-7 items-center justify-between'>
                <Image src={logo} className='w-24 h-24'></Image>
                <h1 className='text-foreground text-6xl'>Chatfinity</h1>
                <button className="bg-red-400 px-5 py-2 rounded-lg h-fit" onClick={()=>{signOut({callbackUrl:'/login'});toast.success("Logged out")}}>Logout</button>
        </div>
    );
}

export default Header;