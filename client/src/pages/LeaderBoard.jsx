import React, { useEffect } from 'react';
import { Medal, Star, Zap, Trophy, Award } from 'lucide-react';
import useUserStore from '../store/user.store';
import _ from 'lodash';

const LeaderBoard = () => {
  const { users, fetchAllUsers } = useUserStore();

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const sortedUsers = _.orderBy(
    users?.map(user => ({
      ...user,
      totalScore: (
        (user.codingProfiles.leetcode.score || 0) +
        (user.codingProfiles.codechef.currentRating || 0) +
        (user.codingProfiles.codeforces.rating || 0)
      )
    })),
    ['totalScore'],
    ['desc']
  );

  const getRankStyle = (index) => {
    switch(index) {
      case 0: return 'bg-green-100';
      case 1: return 'bg-blue-100';
      case 2: return 'bg-yellow-100';
      default: return index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
    }
  };

const getRankIcon = (index) => {
    switch(index) {
        case 0: return <Medal className="w-6 h-6 text-green-400" />;
        case 1: return <Medal className="w-6 h-6 text-blue-400" />;
        case 2: return <Medal className="w-6 h-6 text-amber-500" />;
        default: return <span className="text-gray-700 font-semibold">{index + 1}</span>;
    }
};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">CoderNest Leaderboard</h1>
              <p className="text-gray-600 mt-2">Global rankings across multiple coding platforms</p>
            </div>
            <Award className="w-12 h-12 text-[#FF204E]" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">User</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4 text-orange-500" />
                      LeetCode
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      <Trophy className="w-4 h-4 text-red-500" />
                      CodeChef
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      <Star className="w-4 h-4 text-blue-500" />
                      CodeForces
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      <Star className="w-4 h-4 text-blue-500" />
                      GeeksForGeeks
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Total Score</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers?.map((user, index) => (
                  <tr key={user._id} className={getRankStyle(index)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(index)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-800">{user.name}</div>
                        <div className="text-sm text-gray-500">
                          {user.codingProfiles.leetcode.username}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-800">
                          {user.codingProfiles.leetcode.score || '-'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Solved: {user.codingProfiles.leetcode.totalSolved || 0}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-800">
                          {user.codingProfiles.codechef.currentRating || '-'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.codingProfiles.codechef.stars || 'Not Rated'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-800">
                          {user.codingProfiles.codeforces.rating || '-'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.codingProfiles.codeforces.rank || 'Not Rated'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-800">
                          {user.codingProfiles.gfg.rating || '-'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.codingProfiles.gfg.rank || 'Not Rated'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-center font-bold text-lg text-[#FF204E]">
                        {user.totalScore}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Scoring System</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-orange-50">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-orange-500" />
                <span className="font-medium text-orange-700">LeetCode</span>
              </div>
              <p className="text-sm text-orange-600">Score based on problems solved and contest rating</p>
            </div>
            <div className="p-4 rounded-lg bg-red-50">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-red-500" />
                <span className="font-medium text-red-700">CodeChef</span>
              </div>
              <p className="text-sm text-red-600">Current rating with star classification</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-blue-700">CodeForces</span>
              </div>
              <p className="text-sm text-blue-600">Contest rating and competitive rank</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;