// EditProfileModal.jsx
import React from 'react';
import { FaTimes, FaUser, FaEnvelope, FaInfoCircle, FaCode } from 'react-icons/fa';
import { SiLeetcode, SiCodechef,SiCodeforces, SiGeeksforgeeks, SiHackerrank } from 'react-icons/si';

const InputField = ({ icon: Icon, label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative rounded-lg shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="text-gray-400 text-lg" />
      </div>
      <input
        {...props}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out bg-gray-50 hover:bg-white focus:bg-white text-gray-700 placeholder-gray-400"
      />
    </div>
  </div>
);

const EditProfileModal = ({ editData, onClose, onSave,loading, onChange }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[32rem] relative flex flex-col max-h-[90vh]">
        {/* Header - Fixed */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <FaTimes className="text-gray-500 text-xl" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Basic Info Section */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <FaUser className="text-blue-500" />
              Basic Information
            </h3>
            
            <div className="space-y-4">
              <InputField
                icon={FaUser}
                label="Name"
                type="text"
                name="name"
                value={editData.name}
                onChange={onChange}
                placeholder="Enter your name"
              />
              
              <InputField
                icon={FaEnvelope}
                label="Email"
                type="email"
                name="email"
                value={editData.email}
                onChange={onChange}
                placeholder="Enter your email"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute top-3 left-3">
                    <FaInfoCircle className="text-gray-400 text-lg" />
                  </div>
                  <textarea
                    name="bio"
                    value={editData.bio}
                    onChange={onChange}
                    rows="3"
                    placeholder="Tell us about yourself"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out bg-gray-50 hover:bg-white focus:bg-white text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Coding Profiles Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <FaCode className="text-blue-500" />
              Coding Profiles
            </h3>
            
            <div className="space-y-4">
              <InputField
                icon={SiLeetcode}
                label="LeetCode Username"
                type="text"
                name="codingProfiles.leetcode.username"
                value={editData.codingProfiles.leetcode.username}
                onChange={onChange}
                placeholder="Enter LeetCode username"
              />

              <InputField
                icon={SiCodechef}
                label="CodeChef Username"
                type="text"
                name="codingProfiles.codechef.username"
                value={editData.codingProfiles.codechef.username}
                onChange={onChange}
                placeholder="Enter CodeChef username"
              />
              <InputField
                icon={SiCodeforces}
                label="Codeforces Username"
                type="text"
                name="codingProfiles.codeforces.username"
                value={editData.codingProfiles.codeforces.username}
                onChange={onChange}
                placeholder="Enter codeforces username"
              />

              <InputField
                icon={SiGeeksforgeeks}
                label="GeeksforGeeks Username"
                type="text"
                name="codingProfiles.gfg.username"
                value={editData.codingProfiles.gfg.username}
                onChange={onChange}
                placeholder="Enter GeeksforGeeks username"
              />

              <InputField
                icon={SiHackerrank}
                label="HackerRank Username"
                type="text"
                name="codingProfiles.hackerrank.username"
                value={editData.codingProfiles.hackerrank.username}
                onChange={onChange}
                placeholder="Enter HackerRank username"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons - Fixed */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/30"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;