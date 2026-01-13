
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Feather, PenTool, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const EditorialDashboard = () => {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // This is to simulate dark mode state. In a real app, this would come from a context or prop.
    if (typeof window !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  }, []);

  const pieces = [
    { id: 1, title: "The Death of Nuance in Public Discourse", type: "Opinion", status: "Draft", words: 850, date: "Edited 2h ago" },
    { id: 2, title: "Economic Forecast: Why 2025 Will Be Different", type: "Analysis", status: "Review", words: 1200, date: "Submitted yesterday" },
    { id: 3, title: "Letter from Kyoto: Silence as a Commodity", type: "Voice", status: "Published", words: 980, date: "Published Oct 10" },
  ];

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className={`min-h-screen pt-32 pb-20 px-6 md:px-12 ${isDark ? 'bg-[#121212]' : 'bg-[#FDFBF7]'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
           <div>
             <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`font-serif text-4xl mb-2 flex items-center ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
               <Feather className="mr-4 text-indigo-500" size={36} /> Opinion Desk
             </motion.h1>
             <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{delay: 0.1}}
                className={`text-sm ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Manage perspectives, analysis, and guest contributions.</motion.p>
           </div>
           <motion.div initial={{ opacity: 0, y:10 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.2}}>
            <button 
                onClick={() => handleNavigation('/dashboard/editorial/new')}
                className="mt-4 md:mt-0 px-6 py-2.5 rounded-full text-sm font-bold tracking-wide uppercase text-white shadow-lg bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
                <PenTool size={16} /> <span>New Piece</span>
            </button>
           </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
           {/* Sidebar Filters */}
           <div className="md:col-span-1 space-y-2">
             {['All Pieces', 'Drafts', 'Needs Review', 'Scheduled', 'Published'].map((filter, i) => (
               <button key={i} className={`w-full text-left px-4 py-2 rounded text-sm font-medium transition-colors flex justify-between items-center
                 ${i === 0 
                   ? (isDark ? 'bg-stone-800 text-stone-100' : 'bg-stone-200 text-stone-900')
                   : (isDark ? 'text-stone-500 hover:text-stone-300' : 'text-stone-500 hover:text-stone-700')}`}>
                 <span>{filter}</span>
                 {i === 1 && <span className={`text-[10px] px-1.5 rounded ${isDark ? 'bg-stone-700 text-stone-300' : 'bg-stone-300 text-stone-600'}`}>1</span>}
               </button>
             ))}
           </div>

           {/* Content Grid */}
           <div className="md:col-span-3 grid grid-cols-1 gap-4">
             {pieces.map((piece, i) => (
                <motion.div 
                    key={piece.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    onClick={() => handleNavigation('/dashboard/editorial/new')} 
                    className={`group p-6 rounded-xl border cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center transition-all ${isDark ? 'bg-stone-900 border-stone-800 hover:border-indigo-900' : 'bg-white border-stone-200 hover:border-indigo-200'}`}>
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${isDark ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>{piece.type}</span>
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>{piece.status}</span>
                        </div>
                        <h3 className={`font-serif text-2xl ${isDark ? 'text-stone-200 group-hover:text-indigo-300' : 'text-stone-800 group-hover:text-indigo-700'} transition-colors`}>{piece.title}</h3>
                    </div>
                    <div className="mt-4 md:mt-0 md:text-right md:pl-8 flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-1">
                        <div className={`text-xs font-mono ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>{piece.words} words</div>
                        <div className={`text-xs ${isDark ? 'text-stone-600' : 'text-stone-500'}`}>{piece.date}</div>
                    </div>
                </motion.div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default EditorialDashboard;
