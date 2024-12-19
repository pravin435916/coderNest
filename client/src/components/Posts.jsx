import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { CiHeart } from 'react-icons/ci';
import { FaFire, FaRegCommentDots, FaHeart, FaTrash, FaEdit } from 'react-icons/fa';
import { UserContext } from '../context/UserProvider';
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
  const {user,fetchUserInfo} = useUserStore()
  const {posts,fetchPosts,deletePost,likePost,loading} = usePostStore()
  const [followedUsers, setFollowedUsers] = useState([]); // Track followed users

  
  useEffect(() => {
    fetchPosts();
    fetchUserInfo();
  }, []);
  // const [filteredPosts,setFilteredPosts] = useState(posts)

  const checkIsLiked = (postLikes) => {
    return postLikes.some(item => item._id === user?._id);
  };

  const handleLike = async (postId) => {
    try {
      const post = posts.find((post) => post._id === postId);
      const isLiked = checkIsLiked(post.likes);
  
      // Call the store's likePost method
      await likePost(postId, user?._id, !isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      toast.success("Deleted Successfully!");
      posts.filter(post => post._id !== postId);
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
      getAllPosts();
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

  // Fetch and set the followed users
  // useEffect(() => {
  //   const getFollowedUsers = async () => {
  //     try {
  //       const response = await axios.get(`${backendApi}/api/users/followed-users/${user?._id}`);
  //       setFollowedUsers(response.data); // Set the followed users list
  //     } catch (error) {
  //       console.error('Error fetching followed users:', error);
  //     }
  //   };
    
  //   if (user?._id) {
  //     getFollowedUsers();
  //   }
  // }, [user?._id]);

  // Handle the follow action
  const handleFollow = async (targetUserId) => {
    try {
      await axios.put(`${backendApi}/api/users/follow/${targetUserId}`, {
        userId: user?._id,
      });
      setFollowedUsers(prevState => [...prevState, targetUserId]); // Add to followed list
      toast.success('Followed successfully!');
    } catch (error) {
      console.error('Error following user:', error);
      toast.success(error.message);
    }
  };

  // Handle the unfollow action
  const handleUnfollow = async (targetUserId) => {
    try {
      await axios.put(`${backendApi}/api/users/unfollow/${targetUserId}`, {
        userId: user?._id,
      });
      setFollowedUsers(prevState => prevState.filter(userId => userId !== targetUserId)); // Remove from followed list
      toast.success('Unfollowed successfully!');
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };
  useEffect(() => {
    const fetchFollowedUsers = async () => {
      try {
        const response = await axios.get(`${backendApi}/api/users/followed`);
        setFollowedUsers(response.data.followedUsers.map(user => user._id));
      } catch (error) {
        console.error('Error fetching followed users:', error);
      }
    };
  
    fetchFollowedUsers();
  }, []);  // Empty dependency array ensures it runs once when the component mounts
  
  // const [followedUsers.setFollowedUsers]
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
              <img className="w-8 h-8 rounded-full"
                src={`https://api.dicebear.com/9.x/micah/svg?seed=${post?.createdBy?.name}`} alt="" />
              <h3 className="font-bold">@{post?.createdBy?.name}</h3>
              <span className="text-xs">{moment(Number(post?.createdAt)).format('DD MMM | hh:mm A')}</span>
              <button
                onClick={() => {
                  if (followedUsers.includes(post?.createdBy?._id)) {
                    handleUnfollow(post?.createdBy?._id);
                  } else {
                    handleFollow(post?.createdBy?._id);
                  }
                }}
                className={`px-4 py-2 rounded ${followedUsers.includes(post?.createdBy?._id) ? 'bg-red-500' : 'bg-blue-500'} text-white`}
              >
                {followedUsers.includes(post?.createdBy?._id) ? 'Unfollow' : 'Follow'}
              </button>
            </div>
            {user && editingPostId === post?._id ? (
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
                <PostContent content={post?.content} />
                {post?.imageUrl && <img className="w-full sm:w-[80%] object-cover sm:px-20 mt-4 rounded-sm" src={post?.imageUrl} alt="" />}
                <div className="flex justify-between sm:justify-start gap-4 mt-4">
                  <div className="flex gap-1 items-center cursor-pointer" onClick={() => handleLike(post?._id)}>
                    <span>{post?.likes?.length}</span>
                    <span>{!checkIsLiked(post?.likes) ? <CiHeart /> : <FaHeart className='text-red-600' />}</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span>21</span>
                    <span><FaRegCommentDots className="text-xl" /></span>
                  </div>
                  {user && post?.createdBy?._id === user?._id && (
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
