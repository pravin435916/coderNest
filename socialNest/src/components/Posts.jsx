import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { CiHeart } from 'react-icons/ci';
import { FaFire, FaRegCommentDots, FaHeart, FaTrash, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserProvider';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import SkeletonComp from './Loader/SkeletonComp';
import { backendApi } from '../Url';

export const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState(null);
  const user = useContext(UserContext);

  const getAllPosts = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${backendApi}/api/post/get`);
      setPosts(res.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, [posts]);

  const checkIsLiked = (postLikes) => {
    return postLikes.some(item => item._id === user?._id);
  };

  const handleLike = async (postId) => {
    try {
      const postIndex = posts.findIndex(post => post._id === postId);
      const post = posts[postIndex];
      const isLiked = checkIsLiked(post.likes);

      const updatedLikes = isLiked 
        ? post.likes.filter(like => like._id !== user._id)
        : [...post.likes, { _id: user._id }];

      const updatedPosts = [...posts];
      updatedPosts[postIndex] = { ...post, likes: updatedLikes };

      setPosts(updatedPosts);

      const data = {
        userId: user._id,
        isLike: !isLiked
      };

      await axios.put(`${backendApi}/api/post/like/${postId}`, data);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`${backendApi}/api/post/delete/${postId}`);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setEditContent(post.content);
    setEditImage(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('content', editContent);
      if (editImage) {
        formData.append('imageUrl', editImage);
      }

      const res = await axios.put(`${backendApi}/api/post/edit/${editingPostId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedPosts = posts.map(post =>
        post._id === res.data._id ? { ...res.data, createdBy: user } : post
      );
      toast.success('Edited successfully');
      setPosts(updatedPosts);
      setEditingPostId(null);
      setEditContent('');
      setEditImage(null);
    } catch (error) {
      console.error('Error editing post:', error);
    }
  };

  const handleEditImageChange = (e) => {
    setEditImage(e.target.files[0]);
  };

  return (
    <div>
      <div className='flex gap-2 items-center my-2'>
        <span className='text-3xl text-orange-600'><FaFire /></span>
        <h2 className="text-2xl font-bold abel-regular">SocialNest Feed</h2>
      </div>
      {loading ? (
        Array(5).fill().map((_, index) => <SkeletonComp key={index} />)
      ) : (
        posts.map(post => (
          <div className="w-full flex flex-col bg-gray-100 rounded-md mb-4 p-4 abel-regular" key={post._id}>
            <div className="flex items-center gap-2">
              <img className="w-8 h-8 rounded-full" src={post?.createdBy.image || 'https://github.com/shadcn.png'} alt="" />
              <h3 className="font-bold">@{post?.createdBy.name}</h3>
              <span className="text-xs">{moment(Number(post?.createdAt)).format('DD MMM | hh:mm A')}</span>
            </div>
            {user && editingPostId === post._id ? (
              <form onSubmit={handleEditSubmit} className="mt-2">
                <textarea
                  className="w-full p-2 border rounded"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <input type="file" onChange={handleEditImageChange} className="mt-2" />
                <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded">Save</button>
                <button type="button" onClick={() => setEditingPostId(null)} className="mt-2 bg-red-500 text-white p-2 rounded ml-2">Cancel</button>
              </form>
            ) : (
              <>
                <p className="mt-2">{post.content}</p>
                {post.imageUrl && <img className="w-full sm:w-[80%] object-cover sm:px-20 mt-4 rounded-sm" src={post?.imageUrl} alt="" />}
                <div className="flex justify-between sm:justify-start gap-4 mt-4">
                  <div className="flex gap-1 items-center cursor-pointer" onClick={() => handleLike(post._id)}>
                    <span>{!checkIsLiked(post.likes) ? <CiHeart /> : <FaHeart className='text-red-600' />}</span>
                    <span>{post.likes.length}</span>
                    <span>Likes</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span><FaRegCommentDots className="text-xl" /></span>
                    <span>21</span>
                    <span>Comment</span>
                  </div>
                  {user && post.createdBy._id === user._id && (
                    <div className="flex gap-1 items-center">
                      <span className="cursor-pointer" onClick={() => handleEdit(post)}><FaEdit className="text-blue-600" /></span>
                      <span className="cursor-pointer" onClick={() => handleDelete(post._id)}><FaTrash className="text-red-600" /></span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};