'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

      {/* Main content */}
      <main className="flex-1 ml-0 bg-gray-50 min-h-screen md:ml-48">
        <Header onMenuClick={handleMenuClick} />
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout; 