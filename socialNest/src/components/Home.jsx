import React, { useContext, useState } from 'react'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { LuSend } from "react-icons/lu";
import { Banner } from './Banner';
import { FaVideo } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import { UserContext } from '../context/UserProvider';
import { Posts } from './Posts';
import { FaFire } from "react-icons/fa";
export const Home = () => {
  const user = useContext(UserContext);
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null);
  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
    console.log(imageFile)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!imageFile) {
    //   toast.error('Please select an image to upload');
    //   return;
    // }
    console.log(imageFile)
    setLoading(true)

    const formData = new FormData();
    formData.append('content', inputText);
    formData.append('imageUrl', imageFile);
    formData.append('createdAt', Date.now().toString());
    formData.append('createdBy', user._id);

    try {
      const res = await axios.post('http://localhost:5000/api/post/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type header
        },
      });
      toast.success('published successfully');
      setInputText('');
      setImageFile(null)
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
      console.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="w-full sm:w-[50%] flex flex-col  p-2 sm:p-4 sm:flex-1 sm:overflow-y-auto">
      <Banner />
      {
        user &&
        <div className='w-full flex flex-col bg-gray-100 py-2 px-6 my-4 rounded-3xl'>
          <span className='font-bold'>Create Post</span>
          <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} className='w-full p-2 rounded-2xl h-20 outline-none border-none' placeholder='whats new ?' />
          <div className='flex items-center sm:gap-4 gap-2 sm:p-2 mt-2'>
            {
              imageFile ?   <span className='w-24 overflow-hidden text-xs'>{imageFile.name}</span> :
            <div className='flex gap-1 items-center cursor-pointer relative'>
              <span><CiImageOn /></span>
              <span>image</span>
              <input
                type='file'
                onChange={handleImageChange}
                accept='image/*'
                className='file-input opacity-0 absolute inset-0 w-full h-full cursor-pointer'
                />
            </div>
              }
            <div className='flex gap-1 items-center'>
              <span><FaVideo /></span>
              <span>video</span>
            </div>
            <button
              onClick={handleSubmit}
              className={`px-4 py-1 flex gap-1 items-center rounded-full bg-[#FF204E]`}
              disabled={loading}
            >
              <span className='text-white'>{loading ? 'Publishing...' : 'Publish'}</span>
              <span className='text-white'>{loading ? <span className="loader"></span> : <LuSend />}</span>
            </button>

          </div>
        </div>
      }
      <Posts />

    </div>
  )
}
