import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useUIStore } from '@/store';

const AppShell: React.FC = () => {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-[#07110B]">
      <Sidebar />
      <div
        className="transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? 64 : 240 }}
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
