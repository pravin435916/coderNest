import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[90vh] bg-gray-100">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">Oops!</h1>
      <p className="text-xl text-gray-600 mb-8">We couldn't find the page you're looking for.</p>
      <img src="/assets/phone.png" alt="404 Illustration" className="w-80 h-80 mb-8" />
      <Link to="/" className="text-blue-500 hover:underline">Go back to Home</Link>
    </div>
  );
};

export default NotFound;
