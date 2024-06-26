// src/pages/DashboardPage.js
import React from 'react';
import NavigationBar from '../components/NavigationBar'; 
import SideMenu from '../components/SideMenu'; 
import DashboardContainer from '../components/DashboardContainer'; // Adjust the path as necessary

const DashboardPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <NavigationBar />
      <div style={{ display: 'flex', flex: 1 }}>
        <SideMenu />
        <div style={{ flex: 1 }}>
          <DashboardContainer />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;



