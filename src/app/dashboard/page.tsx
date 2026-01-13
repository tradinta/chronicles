
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Radio, EyeOff, Feather, ShieldAlert, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SelectionCard = ({ 
  title, subtitle, icon: Icon, type, onViewChange, onHoverStart, onHoverEnd
}) => {
  const isDark = false; // Simplified for component
  const isClickable = type === 'news' || type === 'live' || type === 'off-record' || type === 'opinion';
  
  let path = '';
  if (type === 'news') path = '/dashboard/new-story';
  if (type === 'opinion') path = '/dashboard/editorial';
  // TODO: Add paths for other dashboards
  // if (type === 'live') path = '/dashboard/live'; 
  // if (type === 'off-record') path = '/dashboard/off-record';


  return (
    <motion.div 
      onClick={() => isClickable && path && onViewChange(path)}
      className={`relative group overflow-hidden rounded-xl border flex flex-col justify-between p-8 min-h-[320px] transition-all duration-500
        ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'}
        ${isDark 
          ? 'bg-stone-900 border-stone-800 hover:border-stone-600' 
          : 'bg-card border-border hover:border-primary/50 hover:shadow-lg'}`}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      whileHover={{ y: isClickable ? -5 : 0 }}
    >
      <div className={`absolute -right-12 -bottom-12 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform group-hover:scale-110 ${isDark ? 'text-white' : 'text-foreground'}`}>
        <Icon size={200} strokeWidth={0.5} />
      </div>
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 
          ${type === 'live' ? 'bg-red-500/10 text-red-500' : 
            type === 'off-record' ? 'bg-purple-500/10 text-purple-500' : 
            type === 'opinion' ? 'bg-indigo-500/10 text-indigo-500' :
            isDark ? 'bg-stone-800 text-stone-300' : 'bg-secondary text-secondary-foreground'}`}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <h3 className={`font-serif text-3xl mb-2 transition-colors duration-300 group-hover:translate-x-1 ${isDark ? 'text-card-foreground' : 'text-card-foreground'}`}>{title}</h3>
        <p className={`text-sm font-medium tracking-widest uppercase opacity-60 mb-6 ${isDark ? 'text-stone-400' : 'text-muted-foreground'}`}>{subtitle}</p>
      </div>
      <div className="relative z-10 mt-auto">
        <div className={`h-[1px] w-full mb-4 origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ${isDark ? 'bg-stone-700' : 'bg-border'}`}></div>
        <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
           <span className={`text-xs font-mono ${isDark ? 'text-stone-500' : 'text-muted-foreground'}`}>
            {
              type === 'news' ? 'OPEN EDITOR' :
              type === 'live' ? 'INITIATING STREAM...' : 
              type === 'off-record' ? 'ENCRYPTING CHANNEL...' : 
              type === 'opinion' ? 'LOADING DESK...' : 
              'COMING SOON'
            }
           </span>
           <ArrowRight size={16} className={isDark ? 'text-stone-300' : 'text-foreground'} />
        </div>
      </div>
       {type === 'live' && <div className="absolute top-8 right-8 flex items-center space-x-2"><span className="block w-2 h-2 rounded-full bg-red-500 animate-pulse"></span><span className="text-[10px] font-bold tracking-widest text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">ON AIR</span></div>}
      {type === 'off-record' && <div className="absolute top-8 right-8 flex items-center space-x-2"><span className="block w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span><span className="text-[10px] font-bold tracking-widest text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">ENCRYPTED</span></div>}
    </motion.div>
  );
};


export default function PostSelectionPage() {
  const router = useRouter();
  const [hoveredType, setHoveredType] = useState(null);
  const isOffRecordHovered = hoveredType === 'off-record';
  const isDark = false; // Simplified from design

  const handleViewChange = (path: string) => {
    router.push(path);
  };
  
  return (
    <div className={`min-h-screen pt-32 pb-20 px-6 md:px-12 transition-colors duration-700 ${isOffRecordHovered ? 'bg-[#050505]' : (isDark ? 'bg-[#121212]' : 'bg-background')}`}>
      <div className={`max-w-5xl mx-auto mb-16 transition-opacity duration-500 ${isOffRecordHovered ? 'opacity-20 blur-sm' : 'opacity-100'}`}>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className={`font-serif text-4xl md:text-6xl mb-4 ${isDark ? 'text-stone-100' : 'text-foreground'}`}>Editor's Desk</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className={`text-lg font-light max-w-xl ${isDark ? 'text-stone-400' : 'text-muted-foreground'}`}>Select the format that best fits the story you need to tell today.</motion.p>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectionCard type="news" title="Standard Report" subtitle="Factual • Verified • Record" icon={FileText} onViewChange={handleViewChange} onHoverStart={() => setHoveredType('news')} onHoverEnd={() => setHoveredType(null)} />
        <SelectionCard type="live" title="Live Coverage" subtitle="Breaking • Real-time • Wire" icon={Radio} onViewChange={handleViewChange} onHoverStart={() => setHoveredType('live')} onHoverEnd={() => setHoveredType(null)} />
        <SelectionCard type="off-record" title="Off the Record" subtitle="Anonymous • Encrypted • Leak" icon={EyeOff} onViewChange={handleViewChange} onHoverStart={() => setHoveredType('off-record')} onHoverEnd={() => setHoveredType(null)} />
        <SelectionCard type="opinion" title="Editorial" subtitle="Opinion • Analysis • Voice" icon={Feather} onViewChange={handleViewChange} onHoverStart={() => setHoveredType('opinion')} onHoverEnd={() => setHoveredType(null)} />
      </div>
      <div className={`text-center mt-20 transition-all duration-500 ${isOffRecordHovered ? 'opacity-0' : 'opacity-40'}`}><p className={`text-xs uppercase tracking-widest ${isDark ? 'text-stone-500' : 'text-muted-foreground'}`}><ShieldAlert size={12} className="inline mr-2 mb-0.5" />All drafts are auto-saved to your local secure storage</p></div>
    </div>
  );
}
