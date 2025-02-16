'use client'
import Message from "./components/Message";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("sudipta");
  return (
    <div className="bg-slate-100 min-h-screen p-5">
      <h1 className="text-6xl text-center">Message</h1>
      <div className="border border-black mt-5 min-h-[450px] w-[60%] m-auto  relative rounded p-5">

        <div className="min-h-[]">
          <Message text={message} />
        </div>

        <form action="" className="absolute bottom-5 w-[95%]">
          <div className="flex gap-2 w-full">


            <input type="text" className="focus:outline-none border border-black w-full" />
            <button className="border bg-slate-300 px-5 py-2 rounded" type="submit">SEND</button>
          </div>
        </form>

      </div>

    </div>
  );
}
