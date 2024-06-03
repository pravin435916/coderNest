import React, { useContext, useState } from 'react'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { LuSend } from "react-icons/lu";
import { Banner } from './Banner';
import { FaVideo } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import { UserContext } from '../context/UserProvider';
import { Posts } from './Posts';
export const Home = () => {   
    const user = useContext(UserContext);
    const [inputText,setInputText] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await axios.post('http://localhost:5000/api/post/create', {
            content:inputText,
            createdAt:Date.now().toString(),
            createdBy:user._id
          });
          console.log(res.data);
          toast.success('published successfully');
          setInputText('');
        } catch (error) {
          toast.error(error.response?.data?.message || 'An error occurred');
          console.error(error.response?.data?.message || 'An error occurred');
        }
      };
    return (
        <div className="w-full sm:w-[50%] flex flex-col  p-4 sm:flex-1 overflow-y-auto">
           <Banner/>
           {
            user &&
            <div className='w-full flex flex-col bg-gray-100 py-2 px-6 my-4 rounded-3xl'>
                <span className='font-bold'>Create Post</span>
                    <textarea value={inputText} onChange={(e)=> setInputText(e.target.value)} className='w-full p-2 rounded-2xl h-20 outline-none border-none' placeholder='whats new ?'/>
                <div className='flex items-center p-2 mt-2'>
                    <div className='flex gap-4'>
                        <div className='flex gap-1 items-center'>
                            <span><CiImageOn /></span>
                            <span>image</span>
                        </div>
                        <div className='flex gap-1 items-center'>
                            <span><FaVideo /></span>
                            <span>video</span>
                        </div>
                    </div>
                    <button onClick={handleSubmit}  className='px-4 py-1 bg-[#FF204E] flex gap-1 items-center rounded-full'> 
                        <span className='text-white'>Publish</span>
                        <span className='text-white'><LuSend /></span>
                    </button>
                </div>
            </div>
            }
            <Posts/>
           
        </div>
    )
}
