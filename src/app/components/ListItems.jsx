import Image from 'next/image';
import React from 'react';
import { useAppDispatch } from '../../lib/hooks/hook.js'
import { setUser } from '../../lib/features/users/userSlice.js'
function ListItems({ item }) {
    const dispatch = useAppDispatch()


    const handleChat = (user) => {
        dispatch(setUser({
            name: item.name,
            email: item.email,
            picture: item.picture,
            id: item._id
        }))
    }


    return (
        <div className="border-b border-b-background text-center h-16 flex items-center px-2 hover:cursor-pointer" onClick={()=>handleChat(item)}>
            <div className='rounded-full' width={50} height={50}>
                <Image src={item.picture} alt="User Avatar" width={50} height={50} className="rounded-full" />
            </div>

            <div className='w-[60%] text-left m-auto'>
                <p className='text-textcolor'>{item.name}</p>
                {item?.sender?.content && <p className='text-textcolor overflow-hidden text-md h-6'>{item.content}...</p>}
            </div>
            <div className='h-7 w-7 grid place-content-center bg-myyellow rounded-full p-1 text-xs text-foreground'>
                12
            </div>
        </div>
    );
}

export default ListItems;