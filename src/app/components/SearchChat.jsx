'use client'
import React,{useState} from 'react';
import { IoSearch } from "react-icons/io5";
function SearchChat({ onSearch }) {

    const[search,setSearch] = useState("");



    return (
        <form action=""  onSubmit={(e) => { e.preventDefault(); onSearch(search); }}>
            <div className='w-fullblack flex items-center border border-background rounded-full shadow-sm bg-foreground px-2 mt-2 z-10'>

                <input type="text" className='focus:outline-none  w-full text-textcolor  rounded-full h-12 placeholder:font-thin text-xl bg-foreground px-5' placeholder='Search by names...' onChange={(e)=>setSearch(e.target.value)} />
                <button type='submit'><IoSearch className='text-2xl text-textcolor' /></button>
            </div>
        </form>
    );
}

export default SearchChat;