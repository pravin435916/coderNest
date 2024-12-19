// utils/leetcodeUtils.js
import axios from 'axios';

const LEETCODE_API_URL = 'https://leetcode-stats-api.herokuapp.com';

export const fetchLeetCodeStats = async (username) => {
  try {
    if (!username) return null;
    
    const response = await axios.get(`${LEETCODE_API_URL}/${username}`);
    const stats = response.data;
    console.log(stats)
    
    return {
      username,
      score: stats.totalSolved * 10, // Basic scoring system: 10 points per problem
      totalSolved: stats.totalSolved, // Basic scoring system: 10 points per problem
    //   totalSolved: stats.totalSolved,
    //   easySolved: stats.easySolved,
    //   mediumSolved: stats.mediumSolved,
    //   hardSolved: stats.hardSolved,
    //   lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Error fetching LeetCode stats:', error);
    return null;
  }
};