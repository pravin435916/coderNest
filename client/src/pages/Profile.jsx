import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserProvider';
import moment from 'moment';
import { backendApi } from '../Url';

const Profile = () => {
  const user = useContext(UserContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get(`${backendApi}/api/users/user-posts`, {
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
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchFollowersAndFollowing = async () => {
      try {
        const response = await axios.get(`${backendApi}/api/users/${user?._id}/followers-following`);
        console.log(response.data)
        setFollowers(response.data.followers);
        setFollowing(response.data.following);
      } catch (error) {
        console.error('Error fetching followers and following:', error);
      }
    };

    fetchFollowersAndFollowing();
  }, [user?._id]);

  const likesCount = () => {
    return posts.reduce((sum, post) => sum + post.likes.length, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
        <div className="flex flex-col items-center text-center mb-6">
          <img
            className="w-24 h-24 rounded-full border border-gray-300 mb-4"
            src={`https://github.com/shadcn.png`}
            alt="Profile"
          />
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>
          <p className="text-gray-600 mt-2">{user?.email}</p>
          <p className="text-gray-500 text-sm">
            Member since: {moment(user?.createdAt).format('MMMM Do YYYY')}
          </p>
          <div className="flex gap-4 mt-4 text-gray-700">
            <span className="text-sm font-semibold">{posts.length} Posts</span>
            <span className="text-sm font-semibold">{likesCount()} Likes</span>
          </div>
        </div>
        <hr className="border-t border-gray-300" />
        <div>
      <h2>Followers</h2>
      <ul>
        {followers.map((follower) => (
          <li key={follower._id}>{follower.name}</li>
        ))}
      </ul>

      <h2>Following</h2>
      <ul>
        {following.map((follow) => (
          <li key={follow._id}>{follow.name}</li>
        ))}
      </ul>
    </div>
    <hr className="border-t border-gray-300" />
        <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Your Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-gray-100 rounded-lg shadow-md overflow-hidden p-4 flex flex-col items-start"
              >
                <img
                  className="w-full h-40 object-cover rounded mb-4"
                  src={post?.imageUrl}
                  alt="Post"
                />
                <h3 className="text-md font-semibold text-gray-800 mb-2">
                  {post.content}
                </h3>
                <span className="text-sm text-gray-500">{post.likes.length} Likes</span>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center w-full">No posts found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
