'use client'
import React,{useState} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { HiMiniChatBubbleLeftRight } from "react-icons/hi2";
import SearchChat from './SearchChat';


function SideDrawer(props) {

    const [open, setOpen] = useState(false);
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const onSearch = (name) => {
            if (name.trim() === "") {
                setUsers(messages); // Reset when search is empty
            } else {
                const filtered = messages.filter((item) =>
                    item.sender.name.toLowerCase().includes(name.toLowerCase()) // Case-insensitive search
                );
                setUsers(filtered);
            }
        };




    const DrawerList = (
        <Box sx={{ width: 450 }} role="presentation" className='p-5'>

            <SearchChat  onSearch={onSearch} />

            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <li key={index}>{text}</li>
                ))}
            </List>
            <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <li key={index}>{text}</li>
                ))}
            </List>
        </Box>
    );

    return (
        <div className=''>
            <Button onClick={toggleDrawer(true)} className="bg-myyellow text-textcolor w-fit p-1"><HiMiniChatBubbleLeftRight className='text-xl text-gray-800'/>
            </Button>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
}

export default SideDrawer;