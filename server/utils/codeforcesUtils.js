import axios from 'axios';

const CODEFORCES_API_URL = 'https://codeforces.com/api';

export const fetchCodeforcesStats = async (username) => {
  try {
    if (!username) return null;
    
    const response = await axios.get(`${CODEFORCES_API_URL}/user.info?handles=${username}`);
    const statss = response.data.result;
    // console.log(response)
    console.log(statss[0])
    const stats = statss[0];
    // console.log(stats.result)
    
    return {
      username,
      rating: stats.rating, // Basic scoring system: 10 points per problem
      maxRating: stats.maxRating, // Basic scoring system: 10 points per problem
      rank: stats.rank, // Basic scoring system: 10 points per problem
    //   totalSolved: stats.totalSolved,
    //   easySolved: stats.easySolved,
    //   mediumSolved: stats.mediumSolved,
    //   hardSolved: stats.hardSolved,
    //   lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Error fetching codeforces stats:', error);
    return null;
  }
};