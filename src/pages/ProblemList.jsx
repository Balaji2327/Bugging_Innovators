import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircleIcon,
    ChevronRightIcon,
    ClockIcon,
    DocumentTextIcon,
    HashtagIcon,
    BookOpenIcon,
    VideoCameraIcon
} from '@heroicons/react/24/outline';

export default function ProblemList() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/problems')
            .then(res => res.json())
            .then(data => {
                setProblems(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load problems:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="p-8 bg-black min-h-screen text-white flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-4 w-32 bg-gray-800 rounded mb-4"></div>
                <div className="text-gray-500">Loading Sheet...</div>
            </div>
        </div>
    );

    return (
        <div className="p-8 bg-black min-h-screen text-white animate-fade-in">
            <header className="mb-8 border-b border-[#222] pb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                    SDE Sheet
                </h1>
                <p className="text-gray-400 mt-2">Master DSA with AI-powered feedback & reports.</p>
            </header>

            {/* List Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                <div className="col-span-5">Problem</div>
                <div className="col-span-2">Topic</div>
                <div className="col-span-2">Difficulty</div>
                <div className="col-span-1 text-center">Resources</div>
                <div className="col-span-1 text-center">Report</div>
                <div className="col-span-1 text-right">Action</div>
            </div>

            <div className="space-y-2">
                {problems.map(problem => (
                    <div
                        key={problem.id}
                        onClick={() => navigate(`/dashboard/workspace/${problem.slug}`)}
                        className="group relative grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#111] hover:bg-[#161616] p-4 rounded-xl border border-[#222] hover:border-orange-500/30 transition-all cursor-pointer"
                    >
                        {/* Title & Mobile View Info */}
                        <div className="col-span-12 md:col-span-5">
                            <h3 className="text-lg font-medium text-white group-hover:text-orange-500 transition-colors mb-1">
                                {problem.title}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                    <ClockIcon className="w-3 h-3" />
                                    {problem.complexity.split(',')[0]}
                                </span>
                                <span className="hidden sm:flex items-center gap-1">
                                    <HashtagIcon className="w-3 h-3" />
                                    {problem.pattern}
                                </span>
                            </div>
                        </div>

                        {/* Topic */}
                        <div className="col-span-12 md:col-span-2 flex items-center">
                            <span className="text-sm text-gray-400 bg-[#222] px-2 py-1 rounded">
                                {problem.topic}
                            </span>
                        </div>

                        {/* Difficulty */}
                        <div className="col-span-6 md:col-span-2 flex items-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}>
                                {problem.difficulty}
                            </span>
                        </div>

                        {/* Resources - New Column */}
                        <div className="col-span-6 md:col-span-1 flex items-center justify-center gap-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); window.open(`https://www.youtube.com/results?search_query=${problem.title} striver`, '_blank') }}
                                title="Watch Video"
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                            >
                                <VideoCameraIcon className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Report - Updated Column Span */}
                        <div className="col-span-6 md:col-span-1 flex items-center justify-center">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // navigate to report or show modal
                                }}
                                className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg border border-transparent hover:border-gray-700"
                                title="View Report"
                            >
                                <DocumentTextIcon className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Action Arrow */}
                        <div className="col-span-6 md:col-span-1 flex items-center justify-end">
                            <button className="flex items-center gap-2 text-sm font-medium text-gray-500 group-hover:text-white transition-colors">
                                <span className="hidden md:inline">Solve</span>
                                <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
