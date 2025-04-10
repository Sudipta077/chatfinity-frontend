'use client'
import { useSession } from "next-auth/react";
import Header from "./components/Header";
import ChatList from "./components/ChatList";
import ChatPage from "./components/ChatPage";
export default function Home() {

	const { data: session } = useSession();
	// console.log(session);

	return (
		<div className="bg-background flex-1">
			<Header />
			<div className="bg-foreground flex overflow-hidden p-2 gap-2 h-screen rounded">
				<ChatList />
				<ChatPage />
			</div>


		</div>
	);
}
