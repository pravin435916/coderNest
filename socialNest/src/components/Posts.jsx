import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { CiHeart } from 'react-icons/ci';
import { FaRegCommentDots } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

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
      <h2 className="text-2xl font-bold mb-4">SocialNest Feed</h2>
      {posts.map(post => (
        <div className="w-full flex flex-col bg-gray-100 rounded-md mb-4 p-4" key={post._id}>
          <Link to={`/user/${post?.createdBy._id}`} className="flex items-center gap-2">
            <img className="w-8 h-8 rounded-full" src={post?.createdBy.image || 'https://github.com/shadcn.png'} alt="" />
            <h3 className="font-bold">@{post?.createdBy.name}</h3>
            <span className="text-xs">{moment(Number(post?.createdAt)).format('DD MMM | hh:mm A')}</span>
          </Link>
          <p className="mt-2">{post.content}</p>
          {post.imageUrl && <img className="w-full sm:w-[80%]  object-cover sm:px-20 mt-4 rounded-sm" src={post?.imageUrl} alt="" />}
          <div className="flex justify-between sm:justify-start gap-4 mt-4">
            <div className="flex gap-2 items-center">
              <span><CiHeart className="text-xl" /></span>
              <span>22</span>
              <span>Like</span>
            </div>
            <div className="flex gap-2 items-center">
              <span><FaRegCommentDots className="text-xl" /></span>
              <span>21</span>
              <span>Comment</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
