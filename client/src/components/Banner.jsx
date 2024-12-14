import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/UserProvider';

export const Banner = () => {
    const user = useContext(UserContext);
    return (
        <>
            {
                user ?
                   ( <div className='flex flex-col items-start gap-2 font-bold abel-regular'>
                        <span className='text-3xl text-[#FF204E] font-cursive'>Hello , {user.name}</span>
                        <span className='text-xs text-gray-500'>Whats new with you would you like to share something ?</span>
                    </div>) :
                   ( <div className='w-full items-center bg-[#ef5d5d] rounded-3xl shadow-xl h-52 p-4 flex gap-8 abel-regular'>
                        <img className='w-36 h-36 bg-cover' src="/assets/elephant.png" alt="ele" />
                        <div className='flex flex-col gap-2 items-start'>
                            {/* <span className='font-bold text-3xl'> {user ? <h1>Welcome, {user.name}</h1> : <p>Welcome user...</p>}</span> */}
                            <span className='text-white font-bold sm:text-3xl'>Welcome to SocialNest</span>
                            <span className='text-gray-100 text-xs'>Join Community,create and share your thoughts</span>
                            <Link to={'/signin'}><span className='sm:font-bold sec-btn'>Get Started</span></Link>
                        </div>
                    </div>)
            }
        </>
    )
}
