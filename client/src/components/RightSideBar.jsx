import React from 'react';
import { SiNestjs } from 'react-icons/si';
import { 
  FaFire, 
  FaHashtag, 
  FaNewspaper, 
  FaRegBookmark,
  FaChevronRight
} from 'react-icons/fa';

const TrendingTopic = ({ hashtag, posts, category }) => (
  <div className="flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors rounded-lg cursor-pointer group">
    <FaHashtag className="text-gray-400 mt-1" />
    <div className="flex-1">
      <h4 className="font-medium text-gray-800 group-hover:text-[#FF204E] transition-colors">
        {hashtag}
      </h4>
      <p className="text-sm text-gray-500">{category}</p>
      <p className="text-xs text-gray-400">{posts} posts</p>
    </div>
    <FaChevronRight className="text-gray-300 group-hover:text-[#FF204E] transition-colors" />
  </div>
);

const RightSideBar = () => {
  // Sample trending topics data
  const trendingTopics = [
    { hashtag: 'CodechefStarters127', posts: '2.5K', category: 'Coding Contest' },
    { hashtag: 'WebDevelopment', posts: '1.8K', category: 'Technology' },
    { hashtag: 'DSAinJavaScript', posts: '1.2K', category: 'Programming' },
    { hashtag: 'TechInterviews', posts: '956', category: 'Career' },
  ];

  return (
    <div className="sm:w-[28%] h-screen sticky top-0 py-6 px-4">
      {/* Brand Section */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-3xl text-[#FF204E]">
            <SiNestjs className="transform hover:rotate-12 transition-transform duration-300" />
          </span>
          <h1 className="font-bold text-3xl text-[#FF204E]">CoderNest</h1>
        </div>
        <p className="text-sm text-gray-600 italic">
          "Express Your Thoughts: Share, Comment, Connect"
        </p>
      </div>

      {/* Trending Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-800">
            <FaFire className="text-[#FF204E]" />
            <h2 className="font-semibold">Trending Topics</h2>
          </div>
        </div>
        <div className="p-2">
          {trendingTopics.map((topic, index) => (
            <TrendingTopic key={index} {...topic} />
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-800">
            <FaNewspaper className="text-[#FF204E]" />
            <h2 className="font-semibold">Latest Updates</h2>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {/* Recent post items */}
            <div className="flex items-center gap-3">
              <img 
                src="/assets/phone.png" 
                alt="" 
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h4 className="text-sm font-medium text-gray-800">
                  New Contest Announcement
                </h4>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            {/* Add more recent posts as needed */}
          </div>
        </div>
      </div>

      {/* Popular Hashtags */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-800">
            <FaRegBookmark className="text-[#FF204E]" />
            <h2 className="font-semibold">Popular Tags</h2>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm hover:bg-[#FF204E] hover:text-white transition-colors cursor-pointer">
              #programming
            </span>
            <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm hover:bg-[#FF204E] hover:text-white transition-colors cursor-pointer">
              #javascript
            </span>
            <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm hover:bg-[#FF204E] hover:text-white transition-colors cursor-pointer">
              #reactjs
            </span>
            <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm hover:bg-[#FF204E] hover:text-white transition-colors cursor-pointer">
              #webdev
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;