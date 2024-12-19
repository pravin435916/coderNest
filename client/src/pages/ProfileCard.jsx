import React, { useEffect, useState } from 'react';
import { FaPencilAlt, FaDownload, FaGithub, FaCode, FaLaptopCode } from 'react-icons/fa';
import { SiLeetcode, SiCodechef, SiGeeksforgeeks, SiHackerrank } from 'react-icons/si';
import html2canvas from 'html2canvas';

const ProfileCard = ({ user, onClose }) => {
  const totalScore = 
    (user?.codingProfiles?.leetcode?.score || 0) +
    (user?.codingProfiles?.codechef?.currentRating || 0) +
    (user?.codingProfiles?.gfg?.score || 0) +
    (user?.codingProfiles?.hackerrank?.score || 0);

  const downloadCard = async () => {
    const card = document.getElementById('profile-card');
    try {
      const canvas = await html2canvas(card);
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${user.name}-profile-card.png`;
      link.href = url;
      link.click();
    } catch (error) {
      console.error('Error generating card:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative max-w-2xl w-full mx-4">
        <div id="profile-card" className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-xl">
          {/* Header Section */}
          <div className="flex items-center gap-6 mb-6">
            <img
              src={user?.image || 'https://github.com/shadcn.png'}
              alt={user?.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-gray-500 mt-1 text-sm">{user?.bio}</p>
            </div>
          </div>

          {/* Total Score Section */}
          <div className="bg-white p-4 rounded-xl shadow-md mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Total Coding Score</h3>
                <p className="text-3xl font-bold text-indigo-600">{totalScore}</p>
              </div>
              <FaCode className="text-4xl text-indigo-400" />
            </div>
          </div>

          {/* Coding Profiles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* LeetCode */}
            <div className="bg-white p-4 rounded-xl shadow-md">
              <div className="flex items-center gap-3">
                <SiLeetcode className="text-2xl text-[#FFA116]" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">LeetCode</h3>
                  <p className="text-sm text-gray-600">{user?.codingProfiles?.leetcode?.username || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#FFA116]">{user?.codingProfiles?.leetcode?.score || 0}</p>
                  <p className="text-xs text-gray-500">Problems: {user?.codingProfiles?.leetcode?.totalSolved || 0}</p>
                </div>
              </div>
            </div>

            {/* CodeChef */}
            <div className="bg-white p-4 rounded-xl shadow-md">
              <div className="flex items-center gap-3">
                <SiCodechef className="text-2xl text-[#5B4638]" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">CodeChef</h3>
                  <p className="text-sm text-gray-600">{user?.codingProfiles?.codechef?.username || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#5B4638]">{user?.codingProfiles?.codechef?.currentRating || 0}</p>
                  <p className="text-xs text-gray-500">★ {user?.codingProfiles?.codechef?.stars || '0'}</p>
                </div>
              </div>
            </div>

            {/* GeeksforGeeks */}
            <div className="bg-white p-4 rounded-xl shadow-md">
              <div className="flex items-center gap-3">
                <SiGeeksforgeeks className="text-2xl text-[#2F8D46]" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">GeeksforGeeks</h3>
                  <p className="text-sm text-gray-600">{user?.codingProfiles?.gfg?.username || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#2F8D46]">{user?.codingProfiles?.gfg?.score || 0}</p>
                </div>
              </div>
            </div>

            {/* HackerRank */}
            <div className="bg-white p-4 rounded-xl shadow-md">
              <div className="flex items-center gap-3">
                <SiHackerrank className="text-2xl text-[#00EA64]" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">HackerRank</h3>
                  <p className="text-sm text-gray-600">{user?.codingProfiles?.hackerrank?.username || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#00EA64]">{user?.codingProfiles?.hackerrank?.score || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Generated on {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={downloadCard}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
          >
            <FaDownload /> Download Card
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;