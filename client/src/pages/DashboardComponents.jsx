// DashboardComponents.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const StatsCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-1" style={{ color }}>{value}</h3>
      </div>
      <Icon className="text-2xl" style={{ color }} />
    </div>
  </div>
);

export const ContestRatingChart = ({ data }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h3 className="text-lg font-semibold mb-4">Contest Ratings</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="rating" 
          stroke="#8884d8" 
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export const PlatformStats = ({ platform, stats, icon: Icon, color }) => (
  <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center gap-3 mb-3">
      <Icon className="text-2xl" style={{ color }} />
      <h3 className="font-semibold text-gray-800">{platform}</h3>
    </div>
    <div className="space-y-2">
      {Object.entries(stats).map(([key, value]) => (
        <div key={key} className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{key}</span>
          <span className="font-medium" style={{ color }}>{value}</span>
        </div>
      ))}
    </div>
  </div>
);