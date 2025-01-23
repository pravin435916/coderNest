import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineHome } from "react-icons/md";
import { BsRocketTakeoff } from "react-icons/bs";
import { PiCodesandboxLogo } from "react-icons/pi";
import { IoExit, IoSettingsOutline, IoMenu, IoClose } from "react-icons/io5";
import { FaRegUser, FaBell } from 'react-icons/fa';
import { useNotifications } from '../context/NotificationProvider';
import useUserStore from '../store/user.store';

const NavItem = ({ to, icon: Icon, label, count, isActive }) => (
  <Link to={to} className="w-full">
    <div className={`
      flex items-center gap-2 font-semibold text-xl p-3 rounded-lg transition-all duration-200 w-full
      ${isActive 
        ? 'text-[#FF204E]' 
        : 'text-gray-700 hover:bg-gray-50 hover:text-[#FF204E]'
      }
    `}>
      <Icon className={`text-2xl ${isActive ? 'text-[#FF204E]' : 'text-gray-600'}`} />
      <span className="abel-regular">{label}</span>
      {count > 0 && (
        <span className="text-sm bg-[#FF204E] text-white px-2 py-0.5 rounded-full ml-2">
          {count}
        </span>
      )}
    </div>
  </Link>
);

export const LeftSideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const { user } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Menu Button - Fixed to top right corner */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="fixed sm:hidden left-2 top-5"
      >
        {isOpen ? <IoClose className="text-4xl" /> : <IoMenu className="text-4xl" />}
      </button>

      {/* Dark Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-[45] sm:hidden"
        />
      )}

      {/* Main Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full sm:relative 
        sm:h-screen sm:w-[22%] 
        flex flex-col
        bg-white
        transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'} 
        sm:translate-x-0
        z-50
        w-[75%]
        shadow-xl sm:shadow-none
      `}>
        {/* Scrollable Content Area */}
        <div className="flex flex-col h-full px-4 py-6">
          {/* Navigation Links */}
          <div className="flex-1 space-y-4">
            <NavItem 
              to="/" 
              icon={MdOutlineHome} 
              label="Home"
              isActive={location.pathname === '/'}
            />
            <NavItem 
              to="/leaderboard" 
              icon={MdOutlineHome} 
              label="LeaderBoard"
              isActive={location.pathname === '/leaderboard'}
            />
            <NavItem 
              to="/notify" 
              icon={FaBell} 
              label="Notification"
              count={unreadCount}
              isActive={location.pathname === '/notify'}
            />
            <NavItem 
              to="/community" 
              icon={BsRocketTakeoff} 
              label="Community"
              isActive={location.pathname === '/community'}
            />
            <NavItem 
              to="/tools" 
              icon={PiCodesandboxLogo} 
              label="Tools"
              isActive={location.pathname === '/tools'}
            />
            <NavItem 
              to="/settings" 
              icon={IoSettingsOutline} 
              label="Settings"
              isActive={location.pathname === '/settings'}
            />
            <NavItem 
              to="/profile" 
              icon={FaRegUser} 
              label="User"
              isActive={location.pathname === '/profile'}
            />
          </div>

          {/* User Profile Section - Fixed at Bottom */}
          {user && (
            <div className="pt-4 border-t border-gray-100 ">
              <div className="flex items-center gap-3 p-2">
                <img
                  src={user.image || 'https://github.com/shadcn.png'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800 truncate">{user.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/logout')}
                className="w-full flex items-center gap-3 p-3 mt-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <IoExit className="text-2xl" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LeftSideBar;