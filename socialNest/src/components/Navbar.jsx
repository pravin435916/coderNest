import React from 'react'
import { Link } from 'react-router-dom'

export const Navbar = () => {
  return (
    <div className='w-full flex justify-between items-center p-4'>
        <span className='font-cursive font-bold text-3xl'>SocialNest</span>
        <Link to={'/login'}> <span className='primary-btn'>Get Started</span></Link>
    </div>
  )
}
