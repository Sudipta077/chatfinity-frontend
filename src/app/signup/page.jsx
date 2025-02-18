'use client'
import React from 'react';
import Image from 'next/image';
import login from '../../../public/Login.png'
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { TbLockPassword } from "react-icons/tb";
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
function page(props) {

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().required("Password is required"),
        retype: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Confirm Password is required"),
    });


    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            retype: ''
        },
        validationSchema,
        onSubmit: async(values) => {
            console.log(values);

            const result = await axios.post('http://localhost:8080/user/signup',values);
            console.log("Result----->",result);
        

        },
    });

    return (
        <div className='min-h-screen sm:grid sm:place-content-center'>
            <div className='bg-foreground border border-gray-300 shadow-sm rounded  min-h-screen sm:min-h-[520px] py-10  px-0 sm:px-16'>
                <h1 className='mb-5 text-5xl font-semibold text-center sm:text-left'>Sign-up</h1>

                <div className='flex flex-col-reverse sm:flex-row gap-5 md:gap-20 items-center'>

                    <form action="" className='w-72' onSubmit={formik.handleSubmit}>
                        <div className='flex border-b-[1px] border-gray-700 gap-2 items-center mt-10'>
                            <FaUser className='text-gray-700 text-md text-myblack' />
                            <input className='placeholder:font-thin placeholder:text-gray-400 focus:outline-none bg-foreground text-lg' placeholder='Your name here'
                                id="name"
                                name="name"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.name}
                            />
                        </div>
                        <div className=' flex border-b-[1px] border-gray-700 gap-2 items-center mt-10'>
                            <MdEmail className='text-gray-700 text-md text-myblack' />
                            <input className='placeholder:font-thin placeholder:text-gray-400 focus:outline-none bg-foreground text-lg' placeholder='Your email here'
                                id="email"
                                name="email"
                                type="email"
                                onChange={formik.handleChange}
                                value={formik.values.email}
                            />
                        </div>
                        {formik.touched.email && formik.errors.retype && (
                            <p className="text-red-500 text-sm">{formik.errors.email}</p>
                        )}

                        <div className='flex border-b-[1px] border-gray-700 gap-2 items-center mt-10'>
                            <RiLockPasswordFill className='text-gray-700 text-md text-myblack' />
                            <input className='placeholder:font-thin placeholder:text-gray-400 focus:outline-none bg-foreground text-lg' placeholder='Your password here' 
                                id="password"
                                name="password"
                                type="password"
                                onChange={formik.handleChange}
                                value={formik.values.password}
                            />
                        </div>

                        <div className='flex border-b-[1px] border-gray-700 gap-2 items-center mt-10'>
                            <TbLockPassword className='text-gray-700 text-md text-myblack' />
                            <input  className='placeholder:font-thin placeholder:text-gray-400 focus:outline-none bg-foreground text-lg' placeholder='Retype your password' 
                                 id="retype"
                                 name="retype"
                                 type="text"
                                 onChange={formik.handleChange}
                                 value={formik.values.retype}
                            />
                        </div>
                        {formik.touched.retype && formik.errors.retype && (
                            <p className="text-red-500 text-sm">{formik.errors.retype}</p>
                        )}

                        <button type='submit' className='active:bg-blue-600 shadow-md px-5 py-2 bg-myblue mt-16 rounded-lg text-foreground'>Register</button>


                    </form>

                    <div className='flex-col justify-center'>
                        <Image src={login} width={400} alt='' className='w-72 h-72'></Image>
                        <Link href="/login">
                            <p className='text-center mt-10 underline hover:cursor-pointer' >Already a member ?</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default page;