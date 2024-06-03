import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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
      const res = await axios.post('http://localhost:5000/api/users/signup', {
        name,
        email,
        password
      });
      console.log(res.data);
      localStorage.setItem('token', res.data.token);
      toast.success('Signup successfully');
      navigate('/')
    } catch (error) {
      console.error(error.response?.data?.message || 'An error occurred');
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
      <input type="text" value={name} placeholder="Name" onChange={handleNameChange} />
      <input type="email" value={email} placeholder="Email" onChange={handleEmailChange} />
      <input type="password" value={password} placeholder="Password" onChange={handlePasswordChange} />
      <button type="submit">Signup</button>
    </form>
  );
};

export default Signup;
