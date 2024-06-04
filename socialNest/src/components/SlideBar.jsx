import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineHome } from "react-icons/md";
import { BsRocketTakeoff } from "react-icons/bs";
import { PiCodesandboxLogo } from "react-icons/pi";
import { IoExit, IoSettingsOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import { UserContext } from '../context/UserProvider';
import toast from 'react-hot-toast';
import { IoMenu, IoClose } from "react-icons/io5"; // Added menu and close icons

export const SlideBar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/')
        }
    }, [token])
    const user = useContext(UserContext);
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success('Logout successful');
        navigate('/');
    };

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="w-96 sm:w-[22%] flex flex-col justify-between sm:my-10 items-center p-4">
            <button onClick={toggleNavbar} className="sm:hidden text-4xl z-10 absolute left-0 top-20 ">
                {isOpen ? <IoClose /> : <IoMenu />}
            </button>
            <div className={`flex-col items-start gap-8 absolute p-4 ${isOpen ? 'flex' : 'hidden '} sm:flex sm:bg-transparent bg-black `}>
                <Link to='/'>
                    <div className='flex items-center gap-2 font-semibold text-xl'>
                        <span><MdOutlineHome className='text-2xl' /></span>
                        <span>Home</span>
                    </div>
                </Link>
                <Link to='/community'>
                    <div className='flex items-center gap-2 font-semibold text-xl'>
                        <span><BsRocketTakeoff className='text-2xl' /></span>
                        <span>Community</span>
                    </div>
                </Link>
                <Link to='/tools'>
                    <div className='flex items-center gap-2 font-semibold text-xl'>
                        <span><PiCodesandboxLogo className='text-2xl' /></span>
                        <span>Tools</span>
                    </div>
                </Link>
                <Link to='/settings'>
                    <div className='flex items-center gap-2 font-semibold text-xl'>
                        <span><IoSettingsOutline className='text-2xl' /></span>
                        <span>Settings</span>
                    </div>
                </Link>
                <Link to='/profile'>
                    <div className='flex items-center gap-2 font-semibold text-xl'>
                        <span><FaRegUser className='text-2xl' /></span>
                        <span>User</span>
                    </div>
                </Link>
                {user && (
                    <div onClick={handleLogout} className='flex cursor-pointer items-center mt-20 gap-2 font-semibold text-xl'>
                        <span><IoExit className='text-2xl' /></span>
                        <span>Logout</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SlideBar;
