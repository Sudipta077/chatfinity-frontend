'use client'
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import Header from "./components/Header";
export default function Home() {

  const {data:session} = useSession();
  console.log(session);

  return (
    <>
      <Header/>
       
    </>
  );
}
