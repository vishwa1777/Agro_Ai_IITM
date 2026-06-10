import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07110B]">
      <Sidebar />
      <div
        className="transition-all duration-300"
        style={{ marginLeft: 240 }}
      >
        <Topbar />
        <main className="p-6 min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
