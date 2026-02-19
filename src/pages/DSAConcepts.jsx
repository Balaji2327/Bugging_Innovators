import React from 'react';
import {
  RectangleGroupIcon,
  HashtagIcon,
  QueueListIcon,
  ArrowsRightLeftIcon,
  CircleStackIcon,
  ShareIcon,
  CubeIcon,
  CpuChipIcon,
  MapIcon
} from '@heroicons/react/24/outline'; // Importing generic icons for concepts

const DSAConcepts = () => {
  const concepts = [
    {
      title: 'Arrays',
      description: 'Collection of items stored at contiguous memory locations.',
      icon: RectangleGroupIcon,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      title: 'Strings',
      description: 'Sequence of characters representing text.',
      icon: HashtagIcon,
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    {
      title: 'Linked Lists',
      description: 'Linear collection of data elements whose order is not given by their physical placement in memory.',
      icon: QueueListIcon,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    {
      title: 'Stacks & Queues',
      description: 'Abstract data types with specific order of operation (LIFO/FIFO).',
      icon: ArrowsRightLeftIcon,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10'
    },
    {
      title: 'Hash Tables',
      description: 'Implements an associative array abstract data type, a structure that can map keys to values.',
      icon: CircleStackIcon,
      color: 'text-pink-500',
      bg: 'bg-pink-500/10'
    },
    {
      title: 'Trees',
      description: 'Hierarchical tree structure with a root value and subtrees of children with a parent node.',
      icon: ShareIcon,
      color: 'text-teal-500',
      bg: 'bg-teal-500/10'
    },
    {
      title: 'Heaps',
      description: 'Specialized tree-based data structure which is essentially an almost complete tree.',
      icon: CubeIcon,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10'
    },
    {
      title: 'Graphs',
      description: 'Structure amounting to a set of objects in which some pairs of the objects are in some sense "related".',
      icon: MapIcon,
      color: 'text-red-500',
      bg: 'bg-red-500/10'
    },
    {
      title: 'Dynamic Programming',
      description: 'Method for solving complex problems by breaking them down into simpler subproblems.',
      icon: CpuChipIcon,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12 font-sans">
      {/* Header with Glassmorphism */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1a1a1a] via-[#111] to-black border border-[#222] p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
            DSA <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-500">Concepts</span>
          </h1>
          <p className="text-gray-400 text-base max-w-xl leading-relaxed">
            Master fundamental data structures and algorithms with our comprehensive modules.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {concepts.map((concept, idx) => (
          <div
            key={idx}
            className="group bg-[#0a0a0a] p-6 rounded-3xl border border-[#1f1f1f] hover:border-[#333] transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${concept.bg} transition-transform group-hover:scale-110`}>
                  <concept.icon className={`w-6 h-6 ${concept.color}`} />
                </div>
                <span className="text-[10px] font-bold text-gray-500 bg-[#1a1a1a] px-2 py-1 rounded border border-[#2a2a2a] uppercase tracking-wide">
                  Module {idx + 1}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {concept.title}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">
                {concept.description}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-[#1f1f1f] pt-4 mt-auto">
              <span className="text-[10px] text-gray-500 font-mono">0% Completed</span>
              <button className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1">
                Start <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 group-hover:translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DSAConcepts;
