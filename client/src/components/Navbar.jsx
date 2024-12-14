import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { SiNestjs } from "react-icons/si";
import { UserContext } from '../context/UserProvider';
export const Navbar = () => {
  const user = useContext(UserContext);
  return (
    <div className='w-full flex justify-between items-center p-4 abel-regular'>
      <div className='flex gap-2 items-center'>
        <span className ='font-cursive font-bold text-3xl text-[#FF204E]'><SiNestjs /></span>
        <span className ='font-cursive font-bold text-3xl text-[#FF204E]'>SocialNest</span>
      </div>
      {
         user ? 
         <Link to={'/profile'}><img className='w-10 rounded-full' src={user?.image || `https://github.com/shadcn.png`} alt="" /></Link>
         :
         <Link to={'/signin'}> <span className='primary-btn'>Get Started</span></Link>
      }
    </div>
  )
}
