import React from 'react'
import { Link } from 'react-router-dom'
import { MdOutlineHome } from "react-icons/md";
import { BsRocketTakeoff } from "react-icons/bs";
import { PiCodesandboxLogo } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
export const SlideBar = () => {
    return (
        <div className="w-[22%] flex flex-col justify-between my-10 items-center p-4">
            <div className='flex flex-col items-start gap-8 p-4'>
                <Link to='/'>
                    <div className='flex items-center gap-2 font-semibold text-xl'>
                        <span><MdOutlineHome /></span>
                        <span>Home</span>
                    </div>
                </Link>
                <Link to='/'>
                    <div className='flex items-center gap-2 font-semibold text-xl'>
                        <span><BsRocketTakeoff /></span>
                        <span>Community</span>
                    </div>
                </Link>
                <Link to='/'>
                    <div className='flex items-center gap-2 font-semibold text-xl'>
                        <span><PiCodesandboxLogo /></span>
                        <span>Tools</span>
                    </div>
                </Link>
                <Link to='/'>
                    <div className='flex items-center gap-2 font-semibold text-xl'>
                        <span><IoSettingsOutline /></span>
                        <span>Settings</span>
                    </div>
                </Link>
                <Link to='/'>
                    <div className='flex items-center gap-2 font-semibold text-xl'>
                        <span><FaRegUser /></span>
                        <span>User</span>
                    </div>
                </Link>
            </div>
            <div className='flex justify-start items-start gap-2 font-semibold text-xl'>
                <span><FaRegUser /></span>
                <span>User</span>
            </div>
        </div>
    )
}
