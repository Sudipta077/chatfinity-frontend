import React from 'react';
import { IoSearch } from "react-icons/io5";
function SearchChat({onSearch}) {



    return (
        <div className='w-fullblack flex items-center border border-background rounded-full shadow-sm bg-foreground px-2 z-10'>

            <input type="text" className='focus:outline-none  w-full text-textcolor  rounded-full h-12 placeholder:font-thin text-xl bg-foreground px-5' onChange={(e)=>onSearch(e.target.value)} placeholder='Search by names...' />
            <button type='submit'><IoSearch className='text-2xl text-textcolor'/></button>
        </div>
    );
}

export default SearchChat;