// src/common/components/layouts/WebsiteLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../../components/shared/Navbar';
import Footer from '../../../components/shared/Footer';

const WebsiteLayout: React.FC = () => {
  return (
    <div className="website-layout">
      <Navbar />
      <main className="website-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default WebsiteLayout;