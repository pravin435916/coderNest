import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { backendApi } from '../Url';

const Signup = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendApi}/api/users/signup`, {
        name,
        email,
        password
      });
      console.log(res.data);
      localStorage.setItem('token', res.data.token);
      toast.success('Signup successfully');
      window.location.reload();
      navigate('/')
    } catch (error) {
      console.error(error.response?.data?.message || 'An error occurred');
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="h-[90vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-96 space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign up</h2>
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-8'>
          <input type="text" value={name} placeholder="Name" onChange={handleNameChange} className=" w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          <input type="email" value={email} placeholder="Email" onChange={handleEmailChange} className=" w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          <input type="password" value={password} placeholder="Password" onChange={handlePasswordChange} className=" w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          <button type="submit" className=" w-full px-4 py-2 border border-lg bg-red-400 font-bold text-white">Sign up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
