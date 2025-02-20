import React from 'react';
import Image from 'next/image';
import login from '../../../public/Login.png'
import Link from 'next/link';
import LoginForm from '../components/LoginForm';
import { cookies } from 'next/headers';


async function page(props) {


    return (
        <div className='min-h-screen block sm:grid sm:place-content-center'>
            <div className='bg-foreground border border-gray-300 shadow-sm rounded  min-h-screen sm:min-h-[520px] py-10  px-0 sm:px-16'>
                <h1 className='mb-5 text-5xl font-semibold text-center sm:text-left'>Log in</h1>

                <div className='flex flex-col-reverse sm:flex-row gap-5 md:gap-20 items-center'>

                    <LoginForm/>

                    <div className='flex-col justify-center'>
                        <Image src={login} width={400} alt='' className='w-72 h-72'></Image>
                        <Link href="/signup">
                            <p className='text-center mt-10 underline hover:cursor-pointer' >Not a member ?</p>
                        </Link>

                       

                    </div>
                </div>
            </div>
        </div>
    );
}

export default page;