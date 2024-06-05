// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import 'tailwindcss/tailwind.css';

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', formData);
      console.log(res.data);
      toast.success('Login successfully');
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500">
      <motion.form
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={handleChange}
          className="mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:border-green-500 w-full"
          whileFocus={{ scale: 1.05 }}
        />
        <motion.input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange}
          className="mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:border-green-500 w-full"
          whileFocus={{ scale: 1.05 }}
        />
        <motion.button 
          type="submit"
          className="w-52 py-3 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Login
        </motion.button>
        <span>if you haven't login plz  <Link to='/signup'>signup here</Link></span>
      </motion.form>
    </div>
  );
};

export default Signin;
