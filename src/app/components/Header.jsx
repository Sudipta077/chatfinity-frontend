"use client";
import React, { useEffect, useState } from "react";
import logo from "../../../public/logoheader.png";
import Image from "next/image";
import headerimage from "../../../public/headerimg2.jpg";
import '../components/Hamburger.css';
import HamModal from "./HamModal";
import { useSession } from "next-auth/react";




function Header(props) {


	


	

	const { data: session } = useSession();
	const [showHam, setShowHam] = useState(false);

	const toggleHam = () => {
		setShowHam(!showHam);
	}



	return (
		<div className="relative w-full bg-myyellow h-fit flex py-0 px-2 sm:px-7 sm:py-0 items-center justify-between">
			<Image src={logo} className="sm:w-24 sm:h-24 w-12 h-12" alt="image" />

			

			<Image src={headerimage} className="h-12 sm:h-24 w-fit" alt="image" />

			<div className="flex gap-5 border-b-4 border-r-4 border-foreground px-3 py-2 bg-background items-center rounded-2xl border-b-gray-500 border-r-gray-500">


				<Image src={session?.user?.pic} width={50} height={50} alt="User image" className="rounded-full"></Image>


				<label className="burger mt-1" htmlFor="burger">
					<input type="checkbox" id="burger" onClick={toggleHam} />
					<span></span>
					<span></span>
					<span></span>
				</label>

				{showHam &&
					<HamModal user={session} />
				}


			</div>
		</div>
	);
}

export default Header;
