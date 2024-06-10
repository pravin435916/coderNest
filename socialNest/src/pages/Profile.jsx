import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserProvider';
import moment from 'moment';

const Profile = () => {
    const user = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    
    useEffect(() => {
        const fetchUserPosts = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get('http://localhost:5000/api/users/user-posts', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setPosts(res.data.posts);
                } catch (error) {
                    console.error(error.response?.data?.message || 'An error occurred');
                }
            }
        };

        fetchUserPosts();
    }, []);
    const likesCount = () => {
        return posts.reduce((sum, post) => sum + post.likes.length, 0);
    };
    return (
        <div className=" p-8 bg-white rounded-lg shadow-md">
            <div className="flex flex-col items-center text-center">
                <img className='w-20 rounded-full' src={user?.image || `https://github.com/shadcn.png`} alt="" />
                <h1 className="text-3xl font-semibold text-gray-800">Welcome, {user?.name}</h1>
                <p className="mt-2 text-sm text-gray-600">{user?.email}</p>
                <p className="mt-2 text-sm text-gray-600">{moment(user?.createdAt).format("MMMM Do YYYY")}</p>
                <div className='flex gap-8 items-center'>
                <span>{posts.length} Posts</span>
                <span>{likesCount()} likes</span>
                </div>
            </div>
            <hr className="my-4 border-t border-gray-300" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Posts</h2>
            <div className='flex gap-2 flex-wrap justify-center items-center'>
            {posts.length > 0 ? (
                posts.map(post => (
                    <div key={post._id} className="w-80 flex flex-col flex-wrap gap-4 bg-gray-100 rounded-md p-4 mb-4">
                        <img className="w-full mb-2 rounded" src={post?.imageUrl} alt="Post" />
                        <div className="flex items-center">
                            <h3 className="text-lg font-semibold text-gray-800">{post.content}</h3>
                            <h3 className="text-lg font-semibold text-gray-800"> {post.likes.length}Likes</h3>
                        </div>
                        {/* Additional post details can be added here */}
                    </div>
                ))
            ) : (
                <p>No posts found.</p>
            )}
            </div>
        </div>
    );
};

export default Profile;
