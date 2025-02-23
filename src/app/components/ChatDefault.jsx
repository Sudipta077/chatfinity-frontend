import React from 'react';
import '../components/ChatDefault.css';
import Image from 'next/image';
import chat1 from '../../../public/chat1.png';
import chat2 from '../../../public/chat2.png';
import chat3 from '../../../public/chat3.png';

function ChatDefault() {
    return (
        <div className="grid bg-background w-3/4 place-content-center">
            <h1 className='text-center text-2xl text-textcolor font-bold'>Secured • Lightweight • Easy</h1>
            <div className="card">
                <div className="loader">
                    <div className="images-container">
                        <div className="image-slide"><Image src={chat1} alt="chat1" className="image" /></div>
                        <div className="image-slide"><Image src={chat2} alt="chat2" className="image" /></div>
                        <div className="image-slide"><Image src={chat3} alt="chat3" className="image" /></div>
                        {/* <div className="image-slide"><Image src={chat1} alt="chat1-duplicate" className="image" /></div>  */}
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatDefault;
