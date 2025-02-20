'use client'
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react'
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import LoadingModal from "./Loading";
export default function LoginForm() {

    const [loading,setLoading] = useState(false);

    const router = useRouter();

    const validationSchema = Yup.object({

        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().required("Password is required"),

    });


    const formik = useFormik({
        initialValues: {

            email: '',
            password: '',

        },
        validationSchema,
        onSubmit: async (values) => {
            console.log(values);
            setLoading(true);

            try {
                const result = await signIn('credentials', {
                    redirect: false,
                    email: values.email,
                    password: values.password
                });

                if (result.error) {
                    throw new Error(result.error);
                }
                console.log(result);
                setLoading(false);
                toast.success("Login successful!");
                router.push('/');
            }
            catch (err) {
                console.error(err);
                toast.error(err.message || "Login failed");
            }


        },
    });

    const googleLogin = async () => {
        try {
            setLoading(true);
            const result = signIn('google');

            
            if (result.error) {
                throw new Error(result.error);
            }
            if (result.ok) {
                console.log(result)
                setLoading(false);
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
            {loading &&  <LoadingModal/>}
            <form action="" className='w-72' onSubmit={formik.handleSubmit}>

                <div className=' flex border-b-[1px] border-gray-700 gap-2 items-center mt-10'>
                    <MdEmail className='text-gray-700 text-md text-myblack' />
                    <input className='placeholder:font-thin placeholder:text-gray-400 focus:outline-none bg-foreground text-lg' placeholder='Your name here'
                        id="email"
                        name="email"
                        type="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                    />
                </div>

                {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm">{formik.errors.email}</p>
                )}


                <div className='flex border-b-[1px] border-gray-700 gap-2 items-center mt-10'>
                    <RiLockPasswordFill className='text-gray-700 text-md text-myblack' />
                    <input className='placeholder:font-thin placeholder:text-gray-400 focus:outline-none bg-foreground text-lg' placeholder='Your password here'
                        id="password"
                        name="password"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                    />
                </div>

                {formik.touched.password && formik.errors.password && (
                    <p className="text-red-500 text-sm">{formik.errors.password}</p>
                )}

                <div className="flex-col space-y-5">
                    <button type='submit' className='w-full active:bg-blue-600 shadow-md px-5 py-2 bg-myblue mt-16 rounded-lg text-foreground'>Let's go</button>

                    <hr className="border-[.5px] border-gray-300" />

                    <button className='w-full border px-5 py-2 justify-center border-yellow-800 rounded-lg flex items-center' onClick={googleLogin} ><FcGoogle className="text-4xl mr-5" /> Signin with google</button>
                </div>

            </form>


        </>
    );
}