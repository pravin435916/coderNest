import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { CiHeart } from 'react-icons/ci';
import { FaFire, FaRegCommentDots, FaHeart, FaTrash, FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';
import SkeletonComp from './Loader/SkeletonComp';
import { backendApi } from '../Url';
import { PostContent } from './PostContent';
import usePostStore from '../store/post.store';
import useUserStore from '../store/user.store';

export const Posts = () => {
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState(null);
  const { user, fetchUserInfo } = useUserStore();
  const { posts, fetchPosts, deletePost, likePost, loading } = usePostStore();
  const [followedUsers, setFollowedUsers] = useState([]);

  useEffect(() => {
    fetchPosts();
    fetchUserInfo();
    fetchFollowedUsers();
  }, []);

  // Fetch followed users on component mount
  const fetchFollowedUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendApi}/api/users/following`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Extract user IDs from the following array
      const followingIds = response.data.following.map(user => user._id);
      setFollowedUsers(followingIds);
    } catch (error) {
      console.error('Error fetching followed users:', error);
    }
  };

  const handleFollow = async (targetUserId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${backendApi}/api/users/follow/${targetUserId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFollowedUsers(prev => [...prev, targetUserId]);
      toast.success('Followed successfully!');
      // Refresh user info to get updated following count
      fetchUserInfo();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error following user');
    }
  };

  const handleUnfollow = async (targetUserId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${backendApi}/api/users/unfollow/${targetUserId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFollowedUsers(prev => prev.filter(id => id !== targetUserId));
      toast.success('Unfollowed successfully!');
      // Refresh user info to get updated following count
      fetchUserInfo();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error unfollowing user');
    }
  };

  const checkIsLiked = (postLikes) => {
    return postLikes.some(item => item._id === user?._id);
  };

  const handleLike = async (postId) => {
    try {
      const post = posts.find((post) => post._id === postId);
      const isLiked = checkIsLiked(post.likes);
      await likePost(postId, user?._id, !isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      toast.success("Deleted Successfully!");
    } catch (error) {
      toast.error("Error deleting post");
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

      const token = localStorage.getItem('token');
      const res = await axios.put(
        `${backendApi}/api/post/edit/${editingPostId}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          },
        }
      );

      toast.success('Post edited successfully');
      fetchPosts(); // Refresh posts after edit
      setEditingPostId(null);
      setEditContent('');
      setEditImage(null);
    } catch (error) {
      toast.error('Error editing post');
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
        posts?.map(post => (
          <div className="w-full flex flex-col bg-gray-100 rounded-md mb-4 p-4 abel-regular" key={post._id}>
            <div className="flex items-center gap-2">
              <img 
                className="w-8 h-8 rounded-full"
                src={`https://api.dicebear.com/9.x/micah/svg?seed=${post?.createdBy?.name}`} 
                alt="" 
              />
              <h3 className="font-bold">@{post?.createdBy?.name}</h3>
              <span className="text-xs">
                {moment(Number(post?.createdAt)).format('DD MMM | hh:mm A')}
              </span>
              {user && user._id !== post?.createdBy?._id && (
                <button
                  onClick={() => {
                    followedUsers.includes(post?.createdBy?._id)
                      ? handleUnfollow(post?.createdBy?._id)
                      : handleFollow(post?.createdBy?._id);
                  }}
                  className={`px-4 py-1 rounded text-sm ${
                    followedUsers.includes(post?.createdBy?._id)
                      ? 'bg-gray-500'
                      : 'bg-blue-500'
                  } text-white hover:opacity-90 transition-opacity`}
                >
                  {followedUsers.includes(post?.createdBy?._id) ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
            {user && editingPostId === post?._id ? (
              <form onSubmit={handleEditSubmit} className="mt-2">
                <textarea
                  className="w-full p-2 border rounded"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <input 
                  type="file" 
                  onChange={handleEditImageChange} 
                  className="mt-2" 
                />
                <div className="flex gap-2 mt-2">
                  <button 
                    type="submit" 
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setEditingPostId(null)} 
                    className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <PostContent content={post?.content} code={post?.code} />
                {post?.imageUrl && (
                  <img 
                    className="w-full sm:w-[80%] object-cover sm:px-20 mt-4 rounded-sm" 
                    src={post?.imageUrl} 
                    alt="" 
                  />
                )}
                <div className="flex justify-between sm:justify-start gap-4 mt-4">
                  <div 
                    className="flex gap-1 items-center cursor-pointer" 
                    onClick={() => handleLike(post?._id)}
                  >
                    <span>{post?.likes?.length}</span>
                    <span>
                      {!checkIsLiked(post?.likes) 
                        ? <CiHeart /> 
                        : <FaHeart className='text-red-600' />
                      }
                    </span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span>21</span>
                    <span><FaRegCommentDots className="text-xl" /></span>
                  </div>
                  {user && post?.createdBy?._id === user?._id && (
                    <div className="flex gap-2 items-center">
                      <FaEdit 
                        className="text-blue-600 cursor-pointer" 
                        onClick={() => handleEdit(post)}
                      />
                      <FaTrash 
                        className="text-red-600 cursor-pointer" 
                        onClick={() => handleDelete(post._id)}
                      />
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