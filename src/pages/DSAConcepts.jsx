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
    <div className="min-h-screen bg-black text-white p-8 font-sans space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">DSA Concepts</h1>
          <p className="text-gray-400 mt-1">Master fundamental data structures and algorithms.</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {concepts.map((concept, idx) => (
          <div 
            key={idx} 
            className="group bg-[#111] p-6 rounded-2xl border border-[#222] hover:border-orange-500/50 hover:bg-[#161616] transition-all cursor-pointer relative overflow-hidden"
          >
            {/* Hover Glow Effect */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full -mr-10 -mt-10 transition-opacity opacity-0 group-hover:opacity-100"></div>

            <div className="flex items-start justify-between mb-4">
               <div className={`p-3 rounded-xl ${concept.bg} transition-transform group-hover:scale-110`}>
                 <concept.icon className={`w-8 h-8 ${concept.color}`} />
               </div>
               <span className="text-xs font-semibold text-gray-500 bg-[#1a1a1a] px-2 py-1 rounded border border-[#333] group-hover:border-gray-500 transition-colors">
                 Module {idx + 1}
               </span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-500 transition-colors">
              {concept.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {concept.description}
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm font-medium text-gray-500 group-hover:text-white transition-colors">
              <span>Start Learning</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DSAConcepts;
