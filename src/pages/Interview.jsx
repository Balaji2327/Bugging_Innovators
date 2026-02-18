import React from 'react';
import { 
  PlayCircleIcon, 
  ChartBarIcon, 
  ClockIcon, 
  CalendarDaysIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

const Interview = () => {
  // Mock data for the last interview
  const lastInterview = {
    title: 'Frontend System Design',
    date: 'Feb 18, 2026',
    score: 85,
    feedback: 'Great explanation of component hierarchy. Work on API error handling.',
    duration: '45 mins'
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Interview Prep</h1>
        <p className="text-gray-400">Master your technical interviews with AI-driven mock sessions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Action: Start Mock Interview */}
        <div className="lg:col-span-2">
           <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-2xl border border-[#222] p-8 relative overflow-hidden group hover:border-orange-500/30 transition-all">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                   <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-500">
                      <PlayCircleIcon className="w-12 h-12" />
                   </div>
                   <div>
                      <h2 className="text-2xl font-bold text-white">Start Mock Interview</h2>
                      <p className="text-gray-400 mt-1">Simulate real interview scenarios with our AI interviewer.</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                   <div className="bg-[#161616] p-4 rounded-xl border border-[#333]">
                      <h3 className="text-white font-medium mb-1">Behavioral</h3>
                      <p className="text-xs text-gray-500">Soft skills & cultural fit</p>
                   </div>
                   <div className="bg-[#161616] p-4 rounded-xl border border-[#333]">
                      <h3 className="text-white font-medium mb-1">Technical</h3>
                      <p className="text-xs text-gray-500">DSA & System Design</p>
                   </div>
                </div>

                <button className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2">
                   <span>Begin Session</span>
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                   </svg>
                </button>
              </div>
           </div>
        </div>

        {/* Side Panel: Last Interview Score */}
        <div className="lg:col-span-1 space-y-6">
           {/* Score Card */}
           <div className="bg-[#111] rounded-2xl border border-[#222] p-6 relative overflow-hidden">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                 <ChartBarIcon className="w-5 h-5 text-green-500" />
                 Last Interview Score
              </h3>

              <div className="flex flex-col items-center justify-center py-6">
                 <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Circle Background */}
                    <svg className="w-full h-full transform -rotate-90">
                       <circle cx="64" cy="64" r="56" stroke="#222" strokeWidth="12" fill="none" />
                       <circle 
                         cx="64" cy="64" r="56" 
                         stroke={lastInterview.score >= 80 ? "#22c55e" : lastInterview.score >= 60 ? "#eab308" : "#ef4444"} 
                         strokeWidth="12" 
                         fill="none" 
                         strokeDasharray="351.86" 
                         strokeDashoffset={351.86 - (351.86 * lastInterview.score) / 100} 
                         className="transition-all duration-1000 ease-out"
                       />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                       <span className="text-3xl font-bold text-white">{lastInterview.score}%</span>
                       <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Overall</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-4 mt-2">
                 <div className="flex justify-between items-center border-b border-[#222] pb-3">
                    <span className="text-gray-400 text-sm">Topic</span>
                    <span className="text-white font-medium text-sm text-right">{lastInterview.title}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-[#222] pb-3">
                    <span className="text-gray-400 text-sm">Date</span>
                    <span className="text-gray-300 text-sm flex items-center gap-1">
                       <CalendarDaysIcon className="w-4 h-4" /> {lastInterview.date}
                    </span>
                 </div>
                  <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#333]">
                     <p className="text-xs text-gray-400 italic">"{lastInterview.feedback}"</p>
                  </div>
              </div>
           </div>

           {/* Quick Stats */}
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#111] p-4 rounded-xl border border-[#222] flex flex-col items-center justify-center text-center hover:border-gray-700 transition-colors">
                 <CheckBadgeIcon className="w-8 h-8 text-blue-500 mb-2" />
                 <span className="text-2xl font-bold text-white">12</span>
                 <span className="text-xs text-gray-500">Completed</span>
              </div>
              <div className="bg-[#111] p-4 rounded-xl border border-[#222] flex flex-col items-center justify-center text-center hover:border-gray-700 transition-colors">
                 <ClockIcon className="w-8 h-8 text-purple-500 mb-2" />
                 <span className="text-2xl font-bold text-white">8h</span>
                 <span className="text-xs text-gray-500">Practice Time</span>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default Interview;
