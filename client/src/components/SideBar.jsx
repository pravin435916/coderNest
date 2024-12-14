import React from 'react'
import { SiNestjs } from 'react-icons/si'

export const SideBar = () => {
  return (
    <>
      <div className="sm:w-[28%] relative flex justify-center items-center flex-col gap-6">
        <div className='absolute top-10 flex flex-col items-center'>
          <div className='flex gap-2 items-center ' >
            <span className='font-cursive font-bold text-3xl text-[#FF204E]'><SiNestjs /></span>
            <span className='font-cursive font-bold text-3xl text-[#FF204E]'>SocialNest</span>
          </div>
          <span className='text-sm'>"Express Your Thoughts: Share, Comment, Connect"</span>
        </div>
        <img className='w-full h-full object-contain bg-blend-screen' src="/assets/phone.png" alt="" />
      </div>
    </>
  )
}
