// src/HeroSection.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from './Home';
import RightSideBar from './RightSideBar';
import LeftSideBar from './LeftSideBar';
const Hero= () => {
  return (
    <div className="flex flex-col sm:flex-row sm:h-[90vh] overflow-hidden">
      <LeftSideBar/>
      <Home/>
      <RightSideBar/> 
    </div>
  );
}

export default Hero;
