import React from 'react';
import Image from 'next/image';
import {messages} from '../data/users.js'
function ChatPage(props) {
    return (
        <div className={`w-3/4 max-h-screen border border-black relative`}> 
                <div className='h-16 bg-myyellow w-full px-5 flex gap-2 items-center'>
                    <Image src={`https://lh3.googleusercontent.com/a/ACg8ocLutywCmxKKMISSqf6W6_MJ7ldKF3DKdp2AWItaeIvzii837r2_kA=s96-c`} width={40} height={70} alt='' className='rounded-full'></Image>
                    <h2 className='text-myblack text-3xl'>Sudipta</h2>
                </div>
                <div>
                    {
                        messages && messages.map((item,key)=>(
                            <>
                                <li className='text-textcolor'>
                                    {item.content}
                                </li>
                            </>
                        ))
                    }
                </div>

                <div className='absolute bottom-0 w-full'>
                    <input type="text" className='w-full h-12 px-3 text-md focus:outline-none border border-background' placeholder='Type messageshere...'/>
                </div>
        </div>
    );
}

export default ChatPage;