// src/HeroSection.js
import React from 'react';
import { Link } from 'react-router-dom';
import { SlideBar } from './SlideBar';
import { Home } from './Home';
import { SideBar } from './SideBar';
const Hero= () => {
  return (
    <div className="flex h-[90vh]">
      <SlideBar/>
      <Home/>
      <SideBar/>
    </div>
  );
}

export default Hero;
