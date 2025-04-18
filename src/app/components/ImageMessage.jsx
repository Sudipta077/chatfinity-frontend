import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
const ImageMessage = ({ item, token }) => {
    const [url, setUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    // console.log("Item from imagheega--.",item);
    // console.log("token--.",token);

    useEffect(() => {
        async function fetchImageUrl() {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/message/getFile`, {
                    params: { key: item.content },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-type': 'application/json',
                    },
                });

                setUrl(res.data.url);
            } catch (err) {
                console.log("Failed to get image", err);
            } finally {
                setLoading(false);
            }
        }
        fetchImageUrl();
    }, [item.content, token]);

    return (
        <div>
            {loading ? (
                <div className="w-40 h-40 bg-gray-200 animate-pulse rounded shadow-md" />
            ) : (
                <img
                    src={url}
                    alt="uploaded"
                    // style={{ width: "60px", borderRadius: "10px" }}
                    className='w-40 h-fit'
                />

            )}
        </div>
    );
}
export default ImageMessage;
