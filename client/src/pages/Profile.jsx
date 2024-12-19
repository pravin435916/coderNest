// Profile.jsx
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import useUserStore from '../store/user.store';
import toast from 'react-hot-toast';
import {
  FaLaptopCode,
  FaPencilAlt,
  FaChartLine,
  FaCode,
  FaTrophy,
  FaUserAstronaut,
  FaRegCalendarAlt,
  FaSync
} from 'react-icons/fa';
import {
  SiLeetcode,
  SiCodechef,
  SiGeeksforgeeks,
  SiHackerrank
} from 'react-icons/si';
import ProfileCard from './ProfileCard';
import EditProfileModal from './EditProfileModal';
import { StatsCard, ContestRatingChart, PlatformStats } from './DashboardComponents';
import axios from 'axios';

const Profile = () => {
  const { user, posts, fetchUserInfo, fetchUserPosts, updateProfile, loading } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initial state for edit form
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    bio: '',
    codingProfiles: {
      leetcode: { username: '', score: 0, totalSolved: 0 },
      codechef: {
        username: '',
        currentRating: 0,
        highestRating: 0,
        stars: ''
      },
      gfg: { username: '', score: 0 },
      hackerrank: { username: '', score: 0 }
    }
  });

  const [contestRatings, setContestRatings] = useState([]);
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);

  const fetchCodechefRatings = async (username) => {
    try {
      setIsLoadingRatings(true);
      const response = await axios.get(`https://codechef-api.vercel.app/handle/${username}`);
      if (response.data) {
        setContestRatings(response.data.ratingData);
      }
    } catch (error) {
      console.error('Error fetching CodeChef ratings:', error);
    } finally {
      setIsLoadingRatings(false);
    }
  };
  console.log(contestRatings)

  // Add this to your useEffect where you fetch user data
  useEffect(() => {
    if (user?.codingProfiles?.codechef?.username) {
      fetchCodechefRatings(user.codingProfiles.codechef.username);
    }
  }, [user?.codingProfiles?.codechef?.username]);

  // Calculate total statistics
  const calculateTotalStats = () => {
    const leetcodeScore = user?.codingProfiles?.leetcode?.score || 0;
    const codechefRating = user?.codingProfiles?.codechef?.currentRating || 0;
    const gfgScore = user?.codingProfiles?.gfg?.score || 0;
    const hackerrankScore = user?.codingProfiles?.hackerrank?.score || 0;

    return {
      totalScore: leetcodeScore + codechefRating + gfgScore + hackerrankScore,
      totalSolved: user?.codingProfiles?.leetcode?.totalSolved || 0,
      contestsParticipated: user?.codingProfiles?.codechef?.contestsParticipated || 0,
      contributions: posts?.length || 0
    };
  };

  // Handle form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('codingProfiles.')) {
      const [_, platform, field] = name.split('.');
      setEditData(prev => ({
        ...prev,
        codingProfiles: {
          ...prev.codingProfiles,
          [platform]: {
            ...prev.codingProfiles[platform],
            [field]: value
          }
        }
      }));
    } else {
      setEditData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle profile update
  const handleSave = async () => {
    try {
      await updateProfile(editData);
      await fetchUserInfo();
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile!');
      console.error(error);
    }
  };

  // Refresh stats
  const handleRefreshStats = async () => {
    try {
      setIsRefreshing(true);
      await fetchUserInfo();
      toast.success('Stats refreshed successfully!');
    } catch (error) {
      toast.error('Failed to refresh stats!');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initialize data
  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        codingProfiles: {
          leetcode: {
            username: user.codingProfiles?.leetcode?.username || '',
            score: user.codingProfiles?.leetcode?.score || 0,
            totalSolved: user.codingProfiles?.leetcode?.totalSolved || 0,
          },
          codechef: {
            username: user.codingProfiles?.codechef?.username || '',
            currentRating: user.codingProfiles?.codechef?.currentRating || 0,
            highestRating: user.codingProfiles?.codechef?.highestRating || 0,
            stars: user.codingProfiles?.codechef?.stars || ''
          },
          gfg: {
            username: user.codingProfiles?.gfg?.username || '',
            score: user.codingProfiles?.gfg?.score || 0
          },
          hackerrank: {
            username: user.codingProfiles?.hackerrank?.username || '',
            score: user.codingProfiles?.hackerrank?.score || 0
          }
        }
      });
    }
  }, [user]);

  // Fetch initial data
  useEffect(() => {
    fetchUserInfo();
    fetchUserPosts();
  }, []);

  const totalStats = calculateTotalStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="relative">
              <img
                className="w-24 h-24 rounded-full border-4 border-indigo-50"
                src={`https://github.com/shadcn.png`}
                alt="Profile"
              />
              <button
                onClick={() => setIsEditing(true)}
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
              >
                <FaPencilAlt className="text-gray-600" />
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-gray-500 mt-1">{user?.bio}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <FaRegCalendarAlt />
                  Joined {moment(user?.createdAt).format('MMMM YYYY')}
                </span>
                <span className="flex items-center gap-1">
                  <FaCode />
                  {posts?.length} Projects
                </span>
                <button
                  onClick={handleRefreshStats}
                  className={`flex items-center gap-1 text-indigo-600 hover:text-indigo-700 ${isRefreshing ? 'animate-spin' : ''}`}
                  disabled={isRefreshing}
                >
                  <FaSync />
                  Refresh Stats
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowCard(true)}
              className="mr-4 px-6 py-3 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
            >
              <FaLaptopCode className="text-xl" />
              Generate Card
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard
            title="Total Score"
            value={totalStats.totalScore}
            icon={FaTrophy}
            color="#4F46E5"
          />
          <StatsCard
            title="Problems Solved"
            value={totalStats.totalSolved}
            icon={FaCode}
            color="#059669"
          />
          <StatsCard
            title="Contests"
            value={contestRatings.length}
            icon={FaChartLine}
            color="#DC2626"
          />
          <StatsCard
            title="Contributions"
            value={totalStats.contributions}
            icon={FaUserAstronaut}
            color="#9333EA"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Platform Stats */}
          <div className="lg:col-span-1 space-y-6">
            <PlatformStats
              platform="LeetCode"
              stats={{
                Score: user?.codingProfiles?.leetcode?.score || 0,
                'Problems Solved': user?.codingProfiles?.leetcode?.totalSolved || 0,
              }}
              icon={SiLeetcode}
              color="#FFA116"
            />
            <PlatformStats
              platform="CodeChef"
              stats={{
                Rating: user?.codingProfiles?.codechef?.currentRating || 0,
                'Highest Rating': user?.codingProfiles?.codechef?.highestRating || 0,
                Stars: user?.codingProfiles?.codechef?.stars || '0'
              }}
              icon={SiCodechef}
              color="#5B4638"
            />
            <PlatformStats
              platform="GeeksforGeeks"
              stats={{
                Score: user?.codingProfiles?.gfg?.score || 0
              }}
              icon={SiGeeksforgeeks}
              color="#2F8D46"
            />
            <PlatformStats
              platform="HackerRank"
              stats={{
                Score: user?.codingProfiles?.hackerrank?.score || 0
              }}
              icon={SiHackerrank}
              color="#00EA64"
            />
          </div>

          {/* Contest Ratings and Posts */}
          <div className="lg:col-span-2 space-y-6">
            {contestRatings.length > 0 ? (
              <ContestRatingChart data={contestRatings} />
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-4">Contest Ratings</h3>
                <p className="text-gray-500">
                  {isLoadingRatings ? 'Loading ratings...' : 'No contest ratings available'}
                </p>
              </div>
            )}
            
            {/* Posts Grid */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {posts?.slice(0, 4).map((post) => (
                  <div
                    key={post._id}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <img
                      className="w-full h-44 object-cover rounded-lg mb-3"
                      src={post?.imageUrl}
                      alt="Post"
                    />
                    <p className="text-sm font-medium text-gray-800 mb-2">{post.content}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{moment(post.createdAt).fromNow()}</span>
                      <span>{post.likes.length} Likes</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isEditing && (
        <EditProfileModal
          editData={editData}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
          loading={loading}
          onChange={handleEditChange}
        />
      )}
      {showCard && <ProfileCard user={user} onClose={() => setShowCard(false)} />}
    </div>
  );
};

export default Profile;