import React from 'react'
import { Link } from 'react-router-dom'

export const Home = () => {
    return (
        <div className="w-[50%] flex  items-center flex-col bg-gray-100 p-4 flex-1 overflow-y-auto">
            <div className='w-[90%] bg-blue-300 rounded-3xl shadow-xl h-52 p-4 flex gap-8'>
                <img className='w-36 h-36 bg-cover' src="/assets/elephant.png" alt="ele" />
                <div className='flex flex-col gap-4 items-start'>
                    <span className='font-bold text-3xl'>Welcome to SocialNest</span>
                    <span>Join Community,create and share your thoughts</span>
                    <Link to={'/login'}><span className='primary-btn'>Get Started</span></Link>
                </div>
            </div>
            <h1 className="text-3xl font-bold mb-6">Posts</h1>
            {/* Example Posts */}
            <div className="bg-white p-4 shadow mb-4">
                <h2 className="text-2xl font-semibold mb-2">Post Title 1</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
            <div className="bg-white p-4 shadow mb-4">
                <h2 className="text-2xl font-semibold mb-2">Post Title 1</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
            <div className="bg-white p-4 shadow mb-4">
                <h2 className="text-2xl font-semibold mb-2">Post Title 1</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
            <div className="bg-white p-4 shadow mb-4">
                <h2 className="text-2xl font-semibold mb-2">Post Title 1</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
            <div className="bg-white p-4 shadow mb-4">
                <h2 className="text-2xl font-semibold mb-2">Post Title 2</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
            <div className="bg-white p-4 shadow mb-4">
                <h2 className="text-2xl font-semibold mb-2">Post Title 3</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
        </div>
    )
}
