// Logout.js
import {useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/');
  }, []);
  return null
};

export default Logout;
