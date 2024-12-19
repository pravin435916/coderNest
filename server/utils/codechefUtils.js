import axios from 'axios';

const CODECHEF_API_URL = 'https://codechef-api.vercel.app/handle';

export const fetchCodeChefStats = async (username) => {
  try {
    if (!username) return null;
    
    const response = await axios.get(`${CODECHEF_API_URL}/${username}`);
    const stats = response.data;
    console.log(response)
    console.log(stats)
    
    return {
      username,
      currentRating: stats.currentRating, // Basic scoring system: 10 points per problem
      highestRating: stats.highestRating, // Basic scoring system: 10 points per problem
      stars: stats.stars, // Basic scoring system: 10 points per problem
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