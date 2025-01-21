// RatingCharts.jsx
import React, { useState } from 'react';
import { ContestRatingChart } from './ContestRatingChart';
import { SiCodechef, SiCodeforces } from 'react-icons/si';
import { FaCode } from 'react-icons/fa';

const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
      ${active 
        ? 'bg-indigo-600 text-white shadow-lg' 
        : 'bg-white text-gray-600 hover:bg-gray-50'}
    `}
  >
    <Icon className="text-xl" />
    <span>{label}</span>
    {count > 0 && (
      <span className={`text-xs px-2 py-1 rounded-full ${
        active ? 'bg-white text-indigo-600' : 'bg-gray-100'
      }`}>
        {count}
      </span>
    )}
  </button>
);

const codeforcesDataFormatter = (data) => {
  // Get unique contests and calculate ratings based on problems solved
  const contests = {};
  data.result.forEach(submission => {
    if (submission.verdict === "OK") {
      const contestId = submission.contestId;
      const date = new Date(submission.creationTimeSeconds * 1000);
      if (!contests[contestId]) {
        contests[contestId] = {
          contestId,
          date,
          rating: 0,
          problemsSolved: 0
        };
      }
      contests[contestId].rating += submission.problem.rating || 0;
      contests[contestId].problemsSolved++;
    }
  });

  return Object.values(contests)
    .sort((a, b) => a.date - b.date)
    .map(contest => ({
      getyear: contest.date.getFullYear(),
      getmonth: contest.date.getMonth() + 1,
      getday: contest.date.getDate(),
      rating: contest.rating,
      name: `Contest ${contest.contestId}`,
      code: contest.contestId.toString()
    }));
};

const RatingCharts = ({ codechefData, codeforcesData, gfgData }) => {
  const [activeTab, setActiveTab] = useState('codechef');
  
  const formattedCodeforcesData = codeforcesData ? codeforcesDataFormatter(codeforcesData) : [];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      {/* Tab Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <TabButton
          active={activeTab === 'codechef'}
          onClick={() => setActiveTab('codechef')}
          icon={SiCodechef}
          label="CodeChef"
          count={codechefData?.length || 0}
        />
        <TabButton
          active={activeTab === 'codeforces'}
          onClick={() => setActiveTab('codeforces')}
          icon={SiCodeforces}
          label="CodeForces"
          count={formattedCodeforcesData?.length || 0}
        />
        <TabButton
          active={activeTab === 'gfg'}
          onClick={() => setActiveTab('gfg')}
          icon={FaCode}
          label="GeeksforGeeks"
          count={gfgData?.length || 0}
        />
      </div>

      {/* Charts */}
      <div className="transition-all duration-300">
        {activeTab === 'codechef' && (
          <ContestRatingChart 
            data={codechefData || []} 
            platform="CodeChef"
            color="#5B4638"
          />
        )}
        {activeTab === 'codeforces' && (
          <ContestRatingChart 
            data={formattedCodeforcesData || []} 
            platform="CodeForces"
            color="#1F8ACB"
          />
        )}
        {activeTab === 'gfg' && (
          <ContestRatingChart 
            data={gfgData || []} 
            platform="GeeksforGeeks"
            color="#2F8D46"
          />
        )}
      </div>
    </div>
  );
};

export default RatingCharts;