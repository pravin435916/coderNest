import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom'; // Import useParams for route parameters

const UserProfile = () => {
  const { userId } = useParams(); // Extract userId from route parameter
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null); // Track potential errors

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/userpro/${userId}`);
        setUser(response.data.user);
      } catch (error) {
        setError(error);
        console.error('Error fetching user info:', error.message); // Log for debugging
      }
    };

    getUserInfo();
  }, [userId]); // Dependency array ensures effect runs when userId changes

  if (error) {
    return <div>Error fetching user profile: {error.message}</div>; // Handle errors gracefully
  }

  if (!user) {
    return <div>Loading...</div>; // Render loading indicator while fetching data
  }

  return (
    <div>
      <h2>User Info</h2>
      <div>
        <h3>Name: {user.name}</h3>
        <img src={user.image || 'https://github.com/shadcn.png'} alt={user.name} />
        {/* Display other user information as needed */}
      </div>
    </div>
  );
};

export default UserProfile;
