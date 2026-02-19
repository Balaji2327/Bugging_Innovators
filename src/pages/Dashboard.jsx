import React from 'react';
import {
  BookOpenIcon,
  CodeBracketIcon,
  AcademicCapIcon,
  ClockIcon,
  FireIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  BoltIcon,
  MapIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12 font-sans">
      {/* Welcome Header with Glassmorphism */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1a1a1a] via-[#111] to-black border border-[#222] p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Hunter</span>
            </h1>
            <p className="text-gray-400 text-base max-w-xl leading-relaxed">
              You're on a <span className="text-white font-semibold">12-day streak</span>. The "Graph Theory" module is waiting for you.
            </p>
          </div>
          <button className="group relative px-6 py-3 bg-white text-black font-bold text-base rounded-2xl hover:bg-gray-100 transition-all shadow-xl shadow-white/5 active:scale-95">
            <span className="flex items-center gap-2">
              Resume Learning
              <ArrowTrendingUpIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1: Main Stats - Large */}
        <div className="md:col-span-2 bg-[#0a0a0a] rounded-3xl p-6 border border-[#1f1f1f] hover:border-[#333] transition-colors relative overflow-hidden group">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BoltIcon className="w-5 h-5 text-yellow-400" />
              Weekly Performance
            </h3>
            <select className="bg-[#1a1a1a] border border-[#333] text-xs text-gray-400 rounded-lg px-3 py-1 outline-none">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="flex items-end gap-2 h-32 md:h-40 w-full px-2">
            {[40, 65, 30, 85, 50, 95, 60].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end gap-2 group/bar">
                <div
                  style={{ height: `${h}%` }}
                  className={clsx(
                    "w-full rounded-t-lg transition-all duration-500",
                    i === 5 ? "bg-gradient-to-t from-orange-600 to-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)]" : "bg-[#1f1f1f] group-hover/bar:bg-[#2a2a2a]"
                  )}
                ></div>
                <span className="text-[10px] text-center text-gray-600 font-mono hidden md:block">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
            <span>Total XP: <span className="text-white font-bold font-mono">1,240</span></span>
            <span>Problems: <span className="text-white font-bold font-mono">14</span></span>
          </div>
        </div>

        {/* Card 2: Streak - Vertical */}
        <div className="bg-gradient-to-b from-orange-900/10 to-[#0a0a0a] rounded-3xl p-6 border border-orange-500/20 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <FireIcon className="w-32 h-32 text-orange-500 transform rotate-12" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-orange-400 mb-2">
              <FireIcon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Streak</span>
            </div>
            <h2 className="text-5xl font-black text-white tracking-tighter">12</h2>
            <p className="text-orange-200/60 text-xs mt-1">Days on fire!</p>
          </div>
          <div className="mt-6">
            <div className="flex gap-1 mb-2">
              {[1, 1, 1, 1, 0, 0, 0].map((active, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${active ? 'bg-orange-500' : 'bg-[#333]'}`}></div>
              ))}
            </div>
            <p className="text-xs text-gray-500 text-center">Practice tomorrow to reach 13 days</p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Learning Path */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-purple-400" />
            Learning Path
          </h2>

          {/* Path Item - Active */}
          <div className="group bg-[#0a0a0a] rounded-2xl p-0 border border-[#1f1f1f] hover:border-orange-500/30 transition-all overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
            <div className="p-5 flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 border border-orange-500/20">
                <CodeBracketIcon className="w-7 h-7 text-orange-500" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">Arrays & Hashing</h3>
                  <span className="bg-orange-950/30 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-500/20">In Progress</span>
                </div>
                <p className="text-gray-400 text-xs mb-3">Master sliding windows and two-pointer techniques.</p>
                <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full w-[65%] shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                </div>
              </div>
              <div>
                <button className="w-full md:w-auto px-5 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                  Continue
                </button>
              </div>
            </div>
          </div>

          {/* Path Item - Locked/Next */}
          <div className="bg-[#0a0a0a] rounded-2xl p-5 border border-[#1f1f1f] flex items-center gap-6 opacity-60 hover:opacity-100 transition-opacity">
            <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 border border-[#2a2a2a]">
              <TrophyIcon className="w-6 h-6 text-gray-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-gray-300">Dynamic Programming</h3>
              <p className="text-gray-500 text-xs">Unlock by completing Arrays module.</p>
            </div>
            <div className="text-gray-600">
              <span className="font-mono text-[10px] border border-[#333] px-2 py-1 rounded">LOCKED</span>
            </div>
          </div>
        </div>

        {/* Right Column: Daily Challenge & Stats */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#111] to-black rounded-3xl p-5 border border-[#222] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-[40px] pointer-events-none"></div>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-base font-bold text-white">Daily Logic</h3>
              <span className="text-[10px] bg-red-500/20 text-red-500 border border-red-500/20 px-2 py-0.5 rounded uppercase tracking-wide">Hard</span>
            </div>

            <h4 className="text-lg font-bold text-white mb-2 leading-tight">Merge k Sorted Lists</h4>
            <div className="flex gap-2 mb-6">
              <span className="text-[10px] text-gray-500 bg-[#1a1a1a] px-2 py-1 rounded border border-[#2a2a2a]">Heap</span>
              <span className="text-[10px] text-gray-500 bg-[#1a1a1a] px-2 py-1 rounded border border-[#2a2a2a]">Linked List</span>
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-gray-700 border-2 border-black"></div>
                <div className="w-7 h-7 rounded-full bg-gray-600 border-2 border-black"></div>
                <div className="w-7 h-7 rounded-full bg-gray-500 border-2 border-black flex items-center justify-center text-[9px] text-white font-bold">+42</div>
              </div>
              <button className="text-xs font-semibold text-white hover:text-orange-500 transition-colors flex items-center gap-1">
                Solve <ArrowTrendingUpIcon className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Global Rank Snippet */}
          <div className="bg-[#0a0a0a] rounded-2xl p-4 border border-[#1f1f1f] flex items-center justify-between group cursor-pointer hover:border-orange-500/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500/10 p-2.5 rounded-full text-yellow-500 border border-yellow-500/20 group-hover:scale-110 transition-transform">
                <TrophyIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Global Rank</p>
                <p className="text-white font-bold text-base">#4,291</p>
              </div>
            </div>
            <span className="text-green-500 text-[10px] font-mono font-bold bg-green-500/10 px-2 py-1 rounded border border-green-500/20">TOP 5%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
