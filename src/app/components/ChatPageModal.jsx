import React, { useState } from 'react';
import ProfileModal from './ProfileModal';


function ChatPageModal({user}) {
   
    const[show,setShow] = useState(false);
    return (
        <div className="absolute top-[50px] right-6 flex transition z-50">
            <div className="bg-background text-textcolor h-fit w-32 p-2 rounded-lg shadow-lg">
                
                <p className='border-b hover:cursor-pointer py-1 mt-2' onClick={()=>setShow(!show)}>Profile</p>
                {/* <p className='border-b hover:cursor-pointer py-1 mt-2'>Delete Chat</p>  */}
                <p className='hover:cursor-pointer py-1 text-red-500' >
                    Delete chat
                </p>
            </div>

        {show && <ProfileModal profile={user} toggleShow={()=>setShow(!show)}/>}

        </div>
    );
}

export default ChatPageModal;