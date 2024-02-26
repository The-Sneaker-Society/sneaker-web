import React, { useState } from 'react';
import { useMediaQuery } from '@mui/material';
import Header from './Header';
import HeroSection from './HeroSection';
import Footer from './Footer';
import NewSidebar from '../../dashboard/NewSideBar';

function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {(!isSmallScreen || !sidebarOpen) && <Header toggleSidebar={toggleSidebar} />}
      <NewSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <HeroSection />
      <Footer />
    </>
  );
}

export default HomePage;
