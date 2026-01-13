
'use client';

import { motion } from 'framer-motion';
import { FileText, Radio, EyeOff, Feather, ArrowRight, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SelectionCard = ({ 
  title, subtitle, icon: Icon, type, onViewChange 
}) => {
  const isClickable = type === 'news';

  return (
    <motion.div 
      onClick={() => isClickable && onViewChange('/dashboard/new-story')}
      className={`relative group overflow-hidden rounded-xl border flex flex-col justify-between p-8 min-h-[320px] transition-all duration-500
        ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'}
        bg-card border-border hover:border-primary/50 hover:shadow-lg`}
      whileHover={{ y: isClickable ? -5 : 0 }}
    >
      <div className={`absolute -right-12 -bottom-12 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform group-hover:scale-110 text-foreground`}><Icon size={200} strokeWidth={0.5} /></div>
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 
          ${type === 'live' ? 'bg-red-500/10 text-red-500' : 
            type === 'off-record' ? 'bg-purple-500/10 text-purple-500' : 
            'bg-secondary text-secondary-foreground'}`}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <h3 className={`font-serif text-3xl mb-2 transition-colors duration-300 group-hover:translate-x-1 text-card-foreground`}>{title}</h3>
        <p className={`text-sm font-medium tracking-widest uppercase opacity-60 mb-6 text-muted-foreground`}>{subtitle}</p>
      </div>
      <div className="relative z-10 mt-auto">
        <div className={`h-[1px] w-full mb-4 origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 bg-border`}></div>
        <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
           <span className={`text-xs font-mono text-muted-foreground`}>
            {type === 'live' ? 'COMING SOON' : type === 'off-record' ? 'COMING SOON' : type === 'opinion' ? 'COMING SOON' : 'OPEN EDITOR'}
            </span>
           <ArrowRight size={16} className={'text-foreground'} />
        </div>
      </div>
      {type === 'live' && (
        <div className="absolute top-8 right-8 flex items-center space-x-2">
            <span className="block w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-widest text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                ON AIR
            </span>
        </div>
      )}
    </motion.div>
  );
};


export default function PostSelectionPage() {
  const router = useRouter();

  const handleViewChange = (path: string) => {
    router.push(path);
  };
  
  return (
    <div className={`min-h-screen pt-32 pb-20 px-6 md:px-12 transition-colors duration-700 bg-background`}>
      <div className={`max-w-5xl mx-auto mb-16 transition-opacity duration-500`}>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className={`font-serif text-4xl md:text-6xl mb-4 text-foreground`}>Editor's Desk</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className={`text-lg font-light max-w-xl text-muted-foreground`}>Select the format that best fits the story you need to tell today.</motion.p>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectionCard type="news" title="Standard Report" subtitle="Factual • Verified • Record" icon={FileText} onViewChange={handleViewChange} />
        <SelectionCard type="live" title="Live Coverage" subtitle="Breaking • Real-time • Wire" icon={Radio} onViewChange={handleViewChange} />
        <SelectionCard type="off-record" title="Off the Record" subtitle="Anonymous • Encrypted • Leak" icon={EyeOff} onViewChange={handleViewChange} />
        <SelectionCard type="opinion" title="Editorial" subtitle="Opinion • Analysis • Voice" icon={Feather} onViewChange={handleViewChange} />
      </div>
      <div className={`text-center mt-20 transition-all duration-500 opacity-40`}><p className={`text-xs uppercase tracking-widest text-muted-foreground`}><ShieldAlert size={12} className="inline mr-2 mb-0.5" />All drafts are auto-saved to your local secure storage</p></div>
    </div>
  );
}
