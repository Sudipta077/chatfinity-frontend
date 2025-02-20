import React from 'react';
import { FcGoogle } from "react-icons/fc";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation'
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { TbLockPassword } from "react-icons/tb";
import { signIn } from 'next-auth/react'

function SignupForm(props) {

    const router = useRouter();
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
        onSubmit: async (values) => {
            console.log(values);

            try {
                const result = await axios.post('http://localhost:8080/user/signup', values);
                toast.success(result.data.message);
                router.push('/login');
            }
            catch (err) {
                console.log(err.response.data);
                toast.error(err.response.data.message);
            }

        },
    });

    const googleLogin = async () => {
        try {
            const result = signIn('google');

            
            if (result.error) {
                throw new Error(result.error);
            }
            if (result.ok) {
                console.log(result)
                toast.success("Login successful!");
                router.push('/');
            }

        } catch (err) {
            console.error(err);
            toast.error(err.message || "Login failed");
        }
    }


    return (
        <>
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
                {formik.touched.name && formik.errors.name && (
                    <p className="text-red-500 text-sm">{formik.errors.name}</p>
                )}

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

                {formik.touched.password && formik.errors.password && (
                    <p className="text-red-500 text-sm">{formik.errors.password}</p>
                )}

                <div className='flex border-b-[1px] border-gray-700 gap-2 items-center mt-10'>
                    <TbLockPassword className='text-gray-700 text-md text-myblack' />
                    <input className='placeholder:font-thin placeholder:text-gray-400 focus:outline-none bg-foreground text-lg' placeholder='Retype your password'
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

                <div className="flex-col space-y-5">
                    <button type='submit' className='w-full active:bg-blue-600 shadow-md px-5 py-2 bg-myblue mt-16 rounded-lg text-foreground'>Signup</button>

                    <hr className="border-[.5px] border-gray-300" />

                    <button className='w-full border px-5 py-2 justify-center border-yellow-800 rounded-lg flex items-center' onClick={googleLogin}><FcGoogle className="text-4xl mr-5" /> Signup with google</button>
                </div>



            </form>

        </>
    );
}

export default SignupForm;