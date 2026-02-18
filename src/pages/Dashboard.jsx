import React from 'react';
import { 
  BookOpenIcon, 
  CodeBracketIcon, 
  AcademicCapIcon, 
  ClockIcon, 
  FireIcon, 
  TrophyIcon, 
  ArrowTrendingUpIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const Dashboard = () => {
  const dsaTopics = [
    { name: 'Arrays & Strings', progress: 80, color: 'bg-orange-500', icon: CodeBracketIcon, total: 50, completed: 40 },
    { name: 'Linked Lists', progress: 45, color: 'bg-green-500', icon: ArrowTrendingUpIcon, total: 30, completed: 13 },
    { name: 'Trees & Graphs', progress: 20, color: 'bg-purple-500', icon: TrophyIcon, total: 45, completed: 9 },
    { name: 'Dynamic Programming', progress: 10, color: 'bg-red-500', icon: FireIcon, total: 60, completed: 6 },
  ];

  const recentActivity = [
    { task: 'Solved "Two Sum"', time: '2 hours ago', type: 'Problem', score: '+15 XP' },
    { task: 'Reviewed "Hash Maps"', time: '5 hours ago', type: 'Concept', score: '+5 XP' },
    { task: 'Mock Interview: Google', time: '1 day ago', type: 'Interview', score: 'Pending' },
    { task: 'Completed Array Module', time: '2 days ago', type: 'Course', score: '+50 XP' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-gray-400 mt-1">Track your progress and achieve your goals.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#1a1a1a] px-4 py-2 rounded-lg border border-[#333] flex items-center gap-2">
            <FireIcon className="w-5 h-5 text-orange-500" />
            <span className="text-white font-medium">12 Day Streak</span>
          </div>
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-lg shadow-orange-500/20">
            Resume Learning
          </button>
        </div>
      </div>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Problems Solved', value: '142', sub: '+12 this week', icon: CodeBracketIcon, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Concepts Mastered', value: '28', sub: '4 modules left', icon: AcademicCapIcon, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Hours Practiced', value: '56h', sub: 'Top 5% of learners', icon: ClockIcon, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Current Streak', value: '12 Days', sub: 'Keep it up!', icon: FireIcon, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-[#111] p-5 rounded-2xl border border-[#222] hover:border-[#333] transition-all group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`${stat.bg} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <span className="text-gray-500 bg-[#1a1a1a] px-2 py-1 rounded-md border border-[#222]">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Detailed Progress Section */}
          <div className="bg-[#111] rounded-2xl border border-[#222] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpenIcon className="w-5 h-5 text-orange-500" />
                DSA Mastery
              </h2>
              <button className="text-sm text-gray-400 hover:text-white transition-colors">View All Analysis</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dsaTopics.map((topic) => (
                <div key={topic.name} className="bg-[#161616] p-4 rounded-xl border border-[#222] hover:border-orange-500/30 transition-colors group">
                   <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-[#222] group-hover:bg-opacity-80 transition-all`}>
                           <topic.icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                           <h4 className="text-white font-medium text-sm">{topic.name}</h4>
                           <p className="text-xs text-gray-500">{topic.completed}/{topic.total} Problems</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-white bg-[#222] px-2 py-1 rounded-md">{topic.progress}%</span>
                   </div>
                   <div className="w-full bg-[#333] rounded-full h-1.5 overflow-hidden">
                      <div className={`h-full rounded-full ${topic.color}`} style={{ width: `${topic.progress}%` }}></div>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
           <div className="bg-[#111] rounded-2xl border border-[#222] p-6">
              <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
              <div className="relative border-l border-[#222] ml-3 space-y-8">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="relative pl-8 group">
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-[#333] rounded-full border-2 border-[#111] group-hover:bg-orange-500 transition-colors"></div>
                    <div className="flex justify-between items-start bg-[#161616] p-4 rounded-xl border border-[#222] group-hover:border-[#333] transition-all">
                       <div>
                          <p className="text-white font-medium text-sm">{activity.task}</p>
                          <p className="text-gray-500 text-xs mt-1">{activity.type} • {activity.time}</p>
                       </div>
                       <span className={clsx(
                         "text-xs font-bold px-2 py-1 rounded-md",
                         activity.score === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'
                       )}>
                         {activity.score}
                       </span>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Interview Prep Card */}
           <div className="bg-gradient-to-b from-[#1a1a1a] to-[#111] rounded-2xl border border-[#222] p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
              
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                 <AcademicCapIcon className="w-5 h-5 text-orange-500" />
                 Interview Prep
              </h2>
              
              <div className="space-y-3">
                 {[
                   { title: 'Google Mock Interview', tag: 'High Priority', time: 'Tomorrow' },
                   { title: 'System Design: Netflix', tag: 'New', time: '15 mins' },
                 ].map((item, i) => (
                   <div key={i} className="bg-[#222]/50 p-3 rounded-lg border border-[#333] hover:bg-[#222] transition-colors cursor-pointer">
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-xs font-semibold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">{item.tag}</span>
                         <span className="text-xs text-gray-500">{item.time}</span>
                      </div>
                      <h4 className="text-white text-sm font-medium">{item.title}</h4>
                   </div>
                 ))}
              </div>
              
              <button className="w-full mt-5 bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">
                Start Mock Session
              </button>
           </div>

           {/* Daily Challenge */}
           <div className="bg-[#111] rounded-2xl border border-[#222] p-6">
              <div className="flex items-center justify-between mb-4">
                 <h2 className="text-lg font-bold text-white">Daily Challenge</h2>
                 <span className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-md border border-red-500/20">Hard</span>
              </div>
              
              <div className="mb-4">
                 <h3 className="text-white font-semibold mb-1">Merge k Sorted Lists</h3>
                 <p className="text-gray-500 text-xs">Linked Lists • Heap • Divide and Conquer</p>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-400 mb-5">
                 <span className="flex items-center gap-1"><CheckCircleIcon className="w-4 h-4" /> 12.5k Solved</span>
                 <span>+35 XP</span>
              </div>
              
              <button className="w-full bg-[#1a1a1a] text-white border border-[#333] py-2 rounded-lg text-sm font-medium hover:bg-[#222] hover:border-gray-600 transition-all">
                 Solve Problem
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
