'use client'
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import empty from '../../../public/searchResult.png';
import { HiMiniChatBubbleLeftRight } from "react-icons/hi2";
import SearchChat from './SearchChat';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import ListItems from './ListItems';
import Image from 'next/image';
import { Divider } from '@mui/material';
import ListLoader from './ListLoader';

function SideDrawer() {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const [searchUser, setSearchUser] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [loading,setLoading] = useState(false);
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const onSearch = async (name) => {
        setIsEmpty(false);
        setLoading(true);
        setSearchUser([]);
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_URL}/user/alluser`, {
                headers: {
                    Authorization: `Bearer ${session.user.token}`
                },
                params: { search: name }
            });

            if (data.length > 0) {
                setTimeout(() => {
                    setSearchUser(data);
                    setIsEmpty(false);
                    setLoading(false);                    
                }, 1000);
            } else {
                setTimeout(() => {
                    setLoading(false);                    
                    setIsEmpty(true);
                }, 1000);
            }
        } catch (err) {
            toast.error("Error occurred!");
            console.error(err);
        }
    };

    const DrawerList = (
        <Box
            sx={{ width: 450, height: '100vh' }}
            className="p-5 bg-background overflow-y-auto"
        >
            <SearchChat onSearch={onSearch} />

            {loading && <ListLoader/>}

            {isEmpty ? (
                <>
                    <Image src={empty} alt="empty" height={400} width={400} />
                    <p className="text-center text-xl text-textcolor">User not found!</p>
                </>
            ) : (
                <List>
                    {searchUser && searchUser.map((item, index) => (
                        <div key={index}>
                            <ListItems item={item} token={session.user.token} />
                            <Divider />
                        </div>
                    ))}

                </List>

            )}
        </Box>
    );

    return (
        <div>
            <Button onClick={toggleDrawer(true)} className="bg-myyellow text-textcolor w-fit p-1">
                <HiMiniChatBubbleLeftRight className="text-xl text-gray-800" />
            </Button>
            <Drawer
                open={open}
                onClose={toggleDrawer(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        backgroundColor: 'rgb(20, 20, 20)', // Ensures consistent background
                    }
                }}
            >
                {DrawerList}
            </Drawer>
        </div>
    );
}

export default SideDrawer;
