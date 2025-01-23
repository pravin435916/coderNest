import React, { useEffect, useState } from 'react';
import { SiNestjs } from 'react-icons/si';
import { FaFire, FaHashtag, FaNewspaper, FaRegBookmark, FaChevronRight } from 'react-icons/fa';
import _ from 'lodash';
import usePostStore from '../store/post.store';

const TrendingTopic = ({ hashtag, count, category }) => (
  <div className="flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors rounded-lg cursor-pointer group">
    <FaHashtag className="text-gray-400 mt-1" />
    <div className="flex-1">
      <h4 className="font-medium text-gray-800 group-hover:text-[#FF204E] transition-colors">
        {hashtag}
      </h4>
      <p className="text-sm text-gray-500">{category}</p>
      <p className="text-xs text-gray-400">{count} posts</p>
    </div>
    <FaChevronRight className="text-gray-300 group-hover:text-[#FF204E] transition-colors" />
  </div>
);

const RightSideBar = () => {
  const [trendingTags, setTrendingTags] = useState([]);
  const { posts, fetchPosts, loading, error } = usePostStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (!posts?.length) return;

    const allTags = posts.flatMap(post => 
      post.hashtags[0].split(',').map(tag => ({
        tag: tag.replace('#', ''),
        category: 'General',
        likes: post.likes.length
      }))
    );

    const tagCounts = _.chain(allTags)
      .groupBy('tag')
      .map((group, tag) => ({
        hashtag: tag,
        count: group.length,
        likes: _.sumBy(group, 'likes'),
        category: group[0].category
      }))
      .orderBy(['likes', 'count'], ['desc', 'desc'])
      .take(4)
      .value();

    setTrendingTags(tagCounts);
  }, [posts]);

  return (
    <div className="sm:w-[28%] h-screen sticky top-0 py-6 px-4">
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-800">
            <FaFire className="text-[#FF204E]" />
            <h2 className="font-semibold">Trending Topics</h2>
          </div>
        </div>
        <div className="p-2">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : (
            trendingTags.map((topic, index) => (
              <TrendingTopic 
                key={index} 
                hashtag={topic.hashtag} 
                count={topic.count}
                category={topic.category} 
              />
            ))
          )}
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
            {trendingTags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm hover:bg-[#FF204E] hover:text-white transition-colors cursor-pointer">
                #{tag.hashtag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;