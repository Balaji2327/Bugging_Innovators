import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-[#111] shadow-sm z-10 border-b border-gray-800 lg:hidden">
            {/* Mobile header content if needed, for now just placeholder or hidden on desktop */}
            <div className="px-4 py-4">
                 <span className="text-xl font-bold text-white">CognitiveDSA Menu</span>
            </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
