import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { CiHeart } from "react-icons/ci";
import { FaRegCommentDots } from "react-icons/fa6";
export const Posts = () => {
    const [posts, setPosts] = useState([]);

    const getAllPosts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/post/get');
            setPosts(res.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        getAllPosts();
    }, [posts]);

    return (
        <div>
            <h2>Posts</h2>
            {posts.map(post => (
                <div className='w-full flex flex-col p-4 bg-gray-100 rounded-md m-1 gap-4' key={post._id}>
                    <div className='flex gap-2 items-center'>
                        <img className='w-8 rounded-full' src={post?.createdBy.image || `https://github.com/shadcn.png`} alt="" />
                        <h3 className='font-bold'>@{post?.createdBy.name}</h3>
                        .
                        <span className='text-xs'>{moment(Number(post?.createdAt)).format('DD MMM | hh:mm A')}</span>
                    </div>
                    <h3>{post.content}</h3>
                    <div className='flex gap-6 items-center'>
                        <div  className='flex gap-1 items-center'>
                            <span><CiHeart className='text-xl'/></span>
                            <span>22</span>
                            <span>Like</span>
                        </div>
                        <div className='flex gap-1 items-center'>
                            <span><FaRegCommentDots className='text-xl' /></span>
                            <span>21</span>
                            <span>Comment</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
