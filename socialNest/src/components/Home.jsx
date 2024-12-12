import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Prism from 'prismjs'; // Import Prism.js
import 'prismjs/themes/prism-tomorrow.css'; // Import Prism.js theme
import toast, { Toaster } from 'react-hot-toast';
import { LuSend } from "react-icons/lu";
import { Banner } from './Banner';
import { FaVideo } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import { UserContext } from '../context/UserProvider';
import { Posts } from './Posts';
import { backendApi } from '../Url';

export const Home = () => {
  const user = useContext(UserContext);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [posts, setPosts] = useState('');
  const [highlightedCode, setHighlightedCode] = useState('');

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
    console.log(imageFile);
  };

  const handleCodeInput = (e) => {
    const text = e.target.value;
    setInputText(text);

    // Dynamically highlight the input code
    const highlighted = Prism.highlight(text, Prism.languages.javascript, 'javascript');
    setHighlightedCode(highlighted);
  };

  const getAllPosts = async () => {
    try {
      setLoading(true);
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
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile && !inputText) {
      toast.error('Please add content or an image to publish');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('content', inputText);
    formData.append('imageUrl', imageFile);
    formData.append('createdAt', Date.now().toString());
    formData.append('createdBy', user._id);

    try {
      const res = await axios.post(`${backendApi}/api/post/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Published successfully');
      getAllPosts()
      setPosts((prevPosts) => [res.data.newPost, ...prevPosts]);
      setInputText('');
      setImageFile(null);
      setHighlightedCode('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
      console.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full sm:w-[50%] flex flex-col p-2 sm:p-4 sm:flex-1 sm:overflow-y-auto">
      <Banner />
      {user && (
        <div className="w-full flex flex-col bg-gray-100 py-2 px-6 my-4 rounded-3xl">
          <span className="font-bold">Create Post</span>
          <textarea
            value={inputText}
            onChange={handleCodeInput}
            className="w-full p-2 rounded-2xl h-20 outline-none border-none"
            placeholder="What's new or share code..."
          />
          {
            inputText.length > 0 &&
          <pre
            className="language-javascript p-4 bg-gray-900 text-white rounded-lg mt-2 overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
          }
          <div className="flex items-center sm:gap-4 gap-2 sm:p-2 mt-2">
            {imageFile ? (
              <span className="w-24 overflow-hidden text-xs">{imageFile.name}</span>
            ) : (
              <div className="flex gap-1 items-center cursor-pointer relative z-10">
                <span>
                  <CiImageOn />
                </span>
                <span className='cursor-pointer'>Image</span>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="file-input opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
              </div>
            )}
            <div className="flex gap-1 items-center cursor-pointer relative z-10">
              <span>
                <FaVideo />
              </span>
              <span>Video</span>
              <input
                  type="file"
                  onChange={handleImageChange}
                  accept="video/*"
                  className="file-input opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
            </div>
            <button
              onClick={handleSubmit}
              className={`px-4 py-1 flex gap-1 items-center rounded-full bg-[#FF204E]`}
              disabled={loading}
            >
              <span className="text-white">{loading ? 'Publishing...' : 'Publish'}</span>
              <span className="text-white">
                {loading ? <span className="loader"></span> : <LuSend />}
              </span>
            </button>
          </div>
        </div>
      )}
      <Posts />
    </div>
  );
};
