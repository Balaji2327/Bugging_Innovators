import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  BookOpenIcon,
  CodeBracketIcon,
  AcademicCapIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  BoltIcon,
  CpuChipIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Sheet', href: '/dashboard/problems', icon: CodeBracketIcon },
  { name: 'AI Tutor', href: '/dashboard/ai-tutor', icon: CpuChipIcon },
  { name: 'DSA', href: '/dashboard/dsa', icon: AcademicCapIcon },
  { name: 'Interview', href: '/dashboard/interview', icon: VideoCameraIcon },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col w-[72px] bg-[#121212] border-r border-[#1f1f1f] min-h-screen items-center py-3">
      {/* Logo Section */}
      <div className="flex items-center justify-center mb-3">
        <Link to="/dashboard" className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-red-500 text-white shadow-lg shadow-orange-500/20">
          {/* Stylized Logo Icon */}
          <span className="font-bold text-base italic tracking-tighter">CD</span>
        </Link>
      </div>

      {/* Decorative Divider */}
      <div className="w-6 h-[2px] bg-[#1f1f1f] rounded-full mb-3"></div>

      {/* Navigation Links */}
      <div className="flex-1 flex flex-col w-full px-2 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.name}
              to={item.href}
              className="group flex flex-col items-center w-full focus:outline-none"
            >
              <div
                className={clsx(
                  "relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ease-out",
                  isActive
                    ? "bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] shadow-[0_0_12px_rgba(249,115,22,0.15)] border border-[#333]"
                    : "text-gray-500 hover:text-gray-300 hover:bg-[#1a1a1a]"
                )}
              >
                {/* Glowing border effect for active state */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl border border-orange-500/30 blur-[1px]"></div>
                )}

                <item.icon
                  className={clsx(
                    "w-5 h-5 transition-colors duration-300",
                    isActive ? "text-orange-500" : "text-gray-500 group-hover:text-gray-200"
                  )}
                  strokeWidth={1.8}
                />
              </div>

              <span className={clsx(
                "mt-0.5 text-[9px] font-medium tracking-wide transition-colors duration-300",
                isActive ? "text-orange-500" : "text-gray-500 group-hover:text-gray-300"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Bottom Profile Section */}
      <div className="flex flex-col items-center space-y-6 w-full px-2">
        <Link
          to="/dashboard/profile"
          className="group flex flex-col items-center w-full focus:outline-none"
        >
          <div
            className={clsx(
              "flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-300",
              location.pathname === '/dashboard/profile'
                ? "border-orange-500 text-orange-500 bg-[#1a1a1a]"
                : "border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300"
            )}
          >
            <UserCircleIcon className="w-5 h-5" strokeWidth={1.5} />
          </div>
        </Link>
        <Link
          to="/"
          className="text-gray-600 hover:text-red-400 transition-colors duration-300 pb-1"
          title="Sign Out"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
