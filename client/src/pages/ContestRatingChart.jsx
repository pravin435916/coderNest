// ContestRatingChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';

export const ContestRatingChart = ({ data }) => {
  // Format the data to show the most recent contests first (up to 10)
  const formattedData = data
    .slice(-10) // Take last 10 contests
    .map(contest => ({
      date: moment(`${contest.getyear}-${contest.getmonth}-${contest.getday}`).format('MMM D'),
      rating: parseInt(contest.rating),
      rank: parseInt(contest.rank),
      name: contest.name,
      contestCode: contest.code
    }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const contest = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-800 mb-1">{contest.name}</p>
          <div className="text-sm space-y-1">
            <p className="text-gray-600">Date: {label}</p>
            <p className="text-blue-600">Rating: {contest.rating}</p>
            <p className="text-gray-600">Rank: #{contest.rank.toLocaleString()}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const latestRating = formattedData[formattedData.length - 1]?.rating;
  const ratingChange = latestRating && formattedData.length > 1 
    ? latestRating - formattedData[formattedData.length - 2].rating 
    : 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Contest Ratings</h3>
        <div className="text-sm">
          <span className="text-gray-600">Latest Rating: </span>
          <span className="font-medium text-gray-800">{latestRating || 'N/A'}</span>
          {ratingChange !== 0 && (
            <span className={`ml-2 ${ratingChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
              ({ratingChange > 0 ? '+' : ''}{ratingChange})
            </span>
          )}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart 
          data={formattedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#E5E7EB' }}
            domain={['dataMin - 50', 'dataMax + 50']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="rating" 
            stroke="#4F46E5" 
            strokeWidth={2}
            dot={{ 
              r: 4, 
              fill: '#4F46E5',
              strokeWidth: 2,
              stroke: '#fff'
            }}
            activeDot={{ 
              r: 6,
              stroke: '#4F46E5',
              strokeWidth: 2,
              fill: '#fff'
            }}
            name="Contest Rating"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Optional: Add a summary below the chart */}
      <div className="mt-4 text-sm text-gray-600">
        Showing last {formattedData.length} contests
      </div>
    </div>
  );
};

export default ContestRatingChart;