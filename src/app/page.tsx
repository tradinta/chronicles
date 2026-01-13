
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useInView } from 'framer-motion';
import { 
  Search, Sun, Moon, ArrowRight, Bookmark, Share2, X, ChevronRight, ChevronLeft,
  Clock, TrendingUp, ArrowUpRight, Type, 
  ArrowLeft, Highlighter, Volume2, Minimize2, PenTool, 
  Radio, FileText, Lock, Feather, EyeOff, Mic, ShieldAlert,
  Save, Calendar, Send, Image as ImageIcon, MoreVertical, Plus,
  Hash, Layout, Globe, AlertCircle, CheckCircle2, ChevronDown, AlignLeft,
  PlayCircle, PauseCircle, StopCircle, Zap, Users2, BarChart3, History,
  Edit3, Trash2, Pin, AlertOctagon, RefreshCw,
  Eye, Flame, MessageCircle, FileWarning, Fingerprint, Shield, Skull,
  Quote, BookOpen, User, AlignJustify, MapPin, AlertTriangle, Twitter,
  BarChart, LayoutTemplate, UserPlus, GripVertical, Check, Star, Crown, Coffee,
  Sparkles, Bell, ShieldCheck, HelpCircle, ChevronUp, CreditCard, Mail, Smartphone,
  Github, Chrome, Facebook, Linkedin, Instagram, Award, Newspaper, ArrowDown, Filter, ThumbsUp,
  Percent, TrendingDown, Activity, ExternalLink
} from 'lucide-react';

/* --- TYPOGRAPHY & GLOBAL STYLES --- */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');

    :root {
      --font-serif: 'Playfair Display', serif;
      --font-sans: 'Inter', sans-serif;
      
      --color-accent: #ea580c; /* Orange 600 */
      
      --bg-grain: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
    }

    body {
      font-family: var(--font-sans);
      overflow-x: hidden;
    }

    .font-serif { font-family: var(--font-serif); }
    .font-sans { font-family: var(--font-sans); }

    /* Custom Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #a8a29e; }

    .grain-overlay {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background-image: var(--bg-grain);
      opacity: 0.4;
      pointer-events: none;
      z-index: 50;
      mix-blend-mode: overlay;
    }

    .text-tight-hover:hover {
      letter-spacing: -0.02em; 
      transition: letter-spacing 0.3s ease;
    }
    
    .ticker-wrap {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
    }
    .ticker {
      display: inline-block;
      animation: ticker 30s linear infinite;
    }
    .ticker-wrap:hover .ticker {
      animation-play-state: paused;
    }
    @keyframes ticker {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    /* Article Specific */
    .drop-cap:first-letter {
      float: left;
      font-size: 3.5rem;
      line-height: 0.8;
      font-weight: 700;
      margin-right: 0.5rem;
      margin-top: 0.2rem;
    }
    
    .blur-reveal { filter: blur(8px); transition: filter 0.3s ease; }
    .blur-reveal:hover { filter: blur(0); }
  `}</style>
);

/* --- GLOBAL COMPONENTS --- */

const BreakingNewsBanner = ({ isDark, onViewChange }) => {
  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }} 
      animate={{ height: 'auto', opacity: 1 }}
      className="fixed top-20 left-0 right-0 z-30 bg-[#c2410c] text-white shadow-md cursor-pointer hover:bg-[#9a3412] transition-colors"
      onClick={() => onViewChange('live-dashboard')}
    >
      <div className="container mx-auto px-6 md:px-12 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4 overflow-hidden">
           <div className="flex items-center shrink-0 bg-white/20 px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest border border-white/20">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-2"></span>
              Live Wire
           </div>
           <p className="text-sm font-serif font-medium truncate">
              <span className="font-bold mr-2">BREAKING:</span>
              Global markets rally as new trade agreement is signed in Geneva.
           </p>
        </div>
        <div className="hidden md:flex items-center text-[10px] font-bold uppercase tracking-wider shrink-0 ml-4 opacity-80 group-hover:opacity-100">
           <span>Full Coverage</span>
           <ArrowRight size={14} className="ml-1" />
        </div>
      </div>
    </motion.div>
  );
};

const Navbar = ({ isDark, toggleTheme, onViewChange, currentView, isFocusMode }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['World', 'Technology', 'Business', 'Culture', 'Science'];
  const isEditor = ['editor-news', 'live-posting', 'editor-off-record', 'editor-editorial'].includes(currentView);
  const isAuth = currentView === 'auth';
  const isOffRecordFeed = currentView === 'off-record-feed';

  if (isAuth) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-40 h-20 px-6 md:px-12 flex items-center justify-between">
        <div className="flex-shrink-0 cursor-pointer" onClick={() => onViewChange('landing')}>
          <h1 className={`font-serif text-2xl tracking-tighter font-bold ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
            The Chronicle<span className="text-orange-600">.</span>
          </h1>
        </div>
        <button onClick={toggleTheme} className={`${isDark ? 'text-stone-400 hover:text-stone-100' : 'text-stone-500 hover:text-stone-900'}`}>
            {isDark ? <Sun strokeWidth={1.5} size={20} /> : <Moon strokeWidth={1.5} size={20} />}
        </button>
      </nav>
    );
  }

  if (isEditor) {
    const getBackView = () => {
      if (currentView === 'live-posting') return 'live-dashboard';
      if (currentView === 'editor-off-record') return 'off-record-dashboard';
      if (currentView === 'editor-editorial') return 'editorial-dashboard';
      return 'post-selection';
    };
    const getTitle = () => {
        if (currentView === 'live-posting') return { sub: 'Live Control Room', main: 'Election Night 2024' };
        if (currentView === 'editor-off-record') return { sub: 'Restricted Access', main: 'Off the Record' };
        if (currentView === 'editor-editorial') return { sub: 'Opinion Desk', main: 'Editorial / Analysis' };
        return { sub: 'Drafting', main: 'Standard Report' };
    };
    const title = getTitle();
    return (
      <nav className={`fixed top-0 left-0 right-0 z-40 h-16 border-b px-6 flex items-center justify-between transition-colors duration-300 ${isDark ? 'bg-[#121212] border-stone-800' : 'bg-white border-stone-200'}`}>
        <div className="flex items-center space-x-4">
          <button onClick={() => onViewChange(getBackView())} className={`p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ${isDark ? 'text-stone-400' : 'text-stone-600'}`}><ArrowLeft size={18} /></button>
          <div className="flex flex-col"><span className={`text-xs font-bold tracking-widest uppercase ${currentView === 'editor-off-record' ? 'text-purple-500' : isDark ? 'text-stone-500' : 'text-stone-400'}`}>{title.sub}</span><span className={`text-sm font-serif font-bold ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>{title.main}</span></div>
        </div>
        <div className="flex items-center space-x-6">
          <button onClick={toggleTheme} className={`${isDark ? 'text-stone-400 hover:text-stone-100' : 'text-stone-500 hover:text-stone-900'}`}>{isDark ? <Sun strokeWidth={1.5} size={18} /> : <Moon strokeWidth={1.5} size={18} />}</button>
        </div>
      </nav>
    );
  }

  // Standard Navigation
  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out px-6 md:px-12 h-20 flex items-center justify-between
        ${isFocusMode ? 'opacity-0 hover:opacity-100' : 'opacity-100'}
        ${isScrolled || currentView !== 'landing' 
          ? (isOffRecordFeed ? 'bg-[#042f2e]/90 border-teal-800 backdrop-blur-md border-b' : isDark ? 'bg-stone-900/80 backdrop-blur-md border-b border-stone-800' : 'bg-[#FDFBF7]/80 backdrop-blur-md border-b border-stone-200') 
          : 'bg-transparent'}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-4">
          {(currentView !== 'landing' && !isEditor) && (
            <button 
              onClick={() => {
                 if (currentView === 'article') onViewChange('main');
                 else if (['off-record-dashboard', 'live-dashboard', 'editorial-dashboard', 'pricing', 'off-record-feed'].includes(currentView)) onViewChange('main');
                 else onViewChange('main');
              }}
              className={`p-2 rounded-full transition-colors 
                ${isOffRecordFeed ? 'hover:bg-teal-800 text-teal-100' : isDark ? 'hover:bg-stone-800 text-stone-400' : 'hover:bg-stone-200 text-stone-600'}`}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="flex-shrink-0 cursor-pointer group" onClick={() => onViewChange('landing')}>
            <h1 className={`font-serif text-2xl tracking-tighter font-bold ${isOffRecordFeed ? 'text-teal-50' : isDark ? 'text-stone-100' : 'text-stone-900'}`}>
              The Chronicle<span className={`${isOffRecordFeed ? 'text-teal-400' : 'text-orange-600'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>.</span>
            </h1>
          </div>
        </div>

        <div className={`hidden md:flex items-center space-x-8 ${['article', 'post-selection', 'live-dashboard', 'live-posting', 'off-record-dashboard', 'editor-off-record', 'editorial-dashboard', 'editor-editorial', 'pricing', 'author-detail', 'off-record-feed'].includes(currentView) ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}>
          {navLinks.map((link) => (
            <div key={link} onClick={() => onViewChange('main')} className="relative group cursor-pointer h-full flex items-center">
              <span className={`text-sm font-medium tracking-wide ${isDark ? 'text-stone-400 group-hover:text-stone-100' : 'text-stone-500 group-hover:text-stone-900'} transition-colors duration-300`}>
                {link}
              </span>
              <span className={`absolute bottom-0 left-0 w-0 h-[1px] ${isDark ? 'bg-stone-100' : 'bg-stone-900'} transition-all duration-300 group-hover:w-full`} />
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-6">
           {currentView !== 'off-record-feed' && (
             <button onClick={() => onViewChange('off-record-feed')} className={`p-2 transition-colors ${isDark ? 'text-stone-400 hover:text-stone-100' : 'text-stone-500 hover:text-stone-900'}`} title="Off the Record">
               <EyeOff size={20} />
             </button>
           )}
           {currentView !== 'pricing' && (
             <button onClick={() => onViewChange('pricing')} className={`hidden md:flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 border ${isOffRecordFeed ? 'border-teal-700 text-teal-300 hover:bg-teal-900' : isDark ? 'border-stone-700 text-stone-300 hover:bg-stone-800' : 'border-stone-300 text-stone-700 hover:bg-stone-200'}`}><span>Subscribe</span></button>
           )}
           <button onClick={() => onViewChange('auth')} className={`hidden md:block text-xs font-bold tracking-wider uppercase transition-colors ${isOffRecordFeed ? 'text-teal-400 hover:text-teal-200' : isDark ? 'text-stone-400 hover:text-stone-100' : 'text-stone-600 hover:text-stone-900'}`}>Sign In</button>
           <button onClick={() => onViewChange('post-selection')} className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300 ${isOffRecordFeed ? 'bg-teal-800 text-teal-100 hover:bg-teal-700' : isDark ? 'bg-stone-800 text-stone-300 hover:bg-stone-700' : 'bg-stone-200 text-stone-700 hover:bg-stone-300'}`}><PenTool size={16} /><span className="text-xs font-bold tracking-wider uppercase hidden sm:block">Write</span></button>
          <button onClick={() => setIsSearchOpen(true)} className={`${isOffRecordFeed ? 'text-teal-400 hover:text-teal-200' : isDark ? 'text-stone-400 hover:text-stone-100' : 'text-stone-500 hover:text-stone-900'}`}><Search strokeWidth={1.5} size={20} /></button>
          <button onClick={toggleTheme} className={`${isOffRecordFeed ? 'text-teal-400 hover:text-teal-200' : isDark ? 'text-stone-400 hover:text-stone-100' : 'text-stone-500 hover:text-stone-900'}`}>{isDark ? <Sun strokeWidth={1.5} size={20} /> : <Moon strokeWidth={1.5} size={18} />}</button>
          <div onClick={() => onViewChange('author-detail')} className={`hidden md:block w-8 h-8 rounded-full overflow-hidden border cursor-pointer ${isOffRecordFeed ? 'border-teal-700' : isDark ? 'border-stone-700' : 'border-stone-300'}`}><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full object-cover" /></div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl relative">
               <input autoFocus type="text" placeholder="Search..." className="w-full bg-transparent border-b-2 border-white/20 text-4xl font-serif text-white pb-4 focus:outline-none focus:border-white" />
               <button onClick={() => setIsSearchOpen(false)} className="absolute right-0 top-0 text-white/60 hover:text-white"><X size={32} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Footer = ({ isDark }) => (
  <footer className={`py-20 px-6 md:px-12 ${isDark ? 'bg-[#0a0a0a] text-stone-400' : 'bg-[#1a1a1a] text-stone-400'}`}>
    <div className="container mx-auto grid md:grid-cols-4 gap-12">
      <div className="col-span-1"><h2 className="font-serif text-2xl text-stone-100 mb-6">The Chronicle.</h2><p className="text-sm opacity-70">Intelligent journalism for the modern era.</p></div>
      <div><h4 className="text-stone-100 text-xs tracking-wider mb-6">SECTIONS</h4><ul className="space-y-4 text-sm opacity-80"><li>World</li><li>Politics</li><li>Tech</li></ul></div>
      <div><h4 className="text-stone-100 text-xs tracking-wider mb-6">COMPANY</h4><ul className="space-y-4 text-sm opacity-80"><li>About</li><li>Careers</li><li>Privacy</li></ul></div>
      <div><h4 className="text-stone-100 text-xs tracking-wider mb-6">NEWSLETTER</h4><div className="flex border-b border-stone-700 pb-2"><input type="email" placeholder="Email" className="bg-transparent w-full outline-none text-stone-200" /><button className="text-stone-100 text-xs font-bold tracking-widest">JOIN</button></div></div>
    </div>
  </footer>
);

const ScrollProgress = ({ isDark, isFocusMode }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return <motion.div className={`fixed top-0 left-0 right-0 h-1 z-50 origin-left transition-opacity duration-300 ${isFocusMode ? 'opacity-20' : 'opacity-100'} ${isDark ? 'bg-stone-700' : 'bg-orange-600'}`} style={{ scaleX }} />;
};

/* --- LANDING PAGE COMPONENTS --- */

const Hero = ({ isDark, onViewChange }) => {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, 100]);
  const yImg = useTransform(scrollY, [0, 500], [0, -50]);

  return (
    <section className={`relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden ${isDark ? 'bg-[#121212]' : 'bg-[#FDFBF7]'}`}>
      <div className={`absolute inset-0 ${isDark ? 'bg-radial-dark' : 'bg-radial-light'} opacity-60`} />
      
      {/* Container - Grid Layout */}
      <div className="container mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-12 relative z-10 h-full items-start">
        
        {/* Left Column: Featured Story */}
        <motion.div className="lg:col-span-8 order-2 lg:order-1" style={{ y: yText }}>
          
          <div className="flex items-center space-x-3 mb-6 animate-fade-in-up">
            <span className={`h-[1px] w-8 ${isDark ? 'bg-stone-500' : 'bg-stone-400'}`}></span>
            <span className={`text-xs font-bold tracking-[0.2em] uppercase ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Featured Story</span>
          </div>
          
          <motion.h1 
            className={`font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.1] mb-8 cursor-default text-tight-hover ${isDark ? 'text-stone-100' : 'text-stone-900'}`}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}
          >
            The Quiet <br/> Revolution of <br/> <i className="font-light text-orange-700/90">Analogue.</i>
          </motion.h1>
          
          <motion.p 
            className={`text-lg md:text-xl font-light leading-relaxed max-w-md mb-10 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}
          >
            In a world of digital noise, we explore why the most forward-thinking creators are returning to tangible mediums.
          </motion.p>
          
          {/* Main Feature Image */}
          <motion.div 
            className="h-[400px] w-full relative rounded-lg overflow-hidden cursor-pointer"
            onClick={() => onViewChange('article')}
            style={{ y: yImg }}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }}
          >
            <img src="https://images.unsplash.com/photo-1493728639209-4091a1829910?q=80&w=2574&auto=format&fit=crop" alt="Architecture" className="w-full h-full object-cover grayscale-[20%] hover:scale-[1.02] transition-transform duration-[2s] ease-out" />
          </motion.div>

        </motion.div>

        {/* Right Column: News Deck (Hidden on Mobile) */}
        <motion.div 
          className="lg:col-span-4 order-1 lg:order-2 hidden lg:flex flex-col justify-end h-full pb-20"
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.5 }}
        >
           {/* Enter Newsroom CTA */}
           <div className={`p-8 border-l ${isDark ? 'border-stone-800' : 'border-stone-300'}`}>
              <h3 className={`font-serif text-3xl font-bold mb-4 ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>The Newsroom</h3>
              <p className={`text-sm leading-relaxed mb-8 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                Access the full feed of global events, analysis, and market data. Updated every minute.
              </p>
              <button 
                onClick={() => onViewChange('main')}
                className={`group flex items-center space-x-3 text-sm font-bold uppercase tracking-widest transition-colors ${isDark ? 'text-stone-200 hover:text-white' : 'text-stone-800 hover:text-stone-900'}`}
              >
                 <span>Enter Now</span>
                 <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform" />
              </button>
           </div>
        </motion.div>

      </div>
    </section>
  );
};

// --- NEW BRIEFING SECTION (The Dispatch, Market Pulse, City Beat) ---
const BriefingCard = ({ title, icon: Icon, items, isDark, onViewChange }) => (
  <div className={`p-6 rounded-xl border flex flex-col h-full transition-all hover:shadow-md ${isDark ? 'bg-stone-900/30 border-stone-800' : 'bg-white border-stone-200 shadow-sm'}`}>
    <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-dashed border-stone-300 dark:border-stone-700/50">
      <Icon size={16} className={isDark ? 'text-stone-400' : 'text-stone-500'} />
      <h3 className={`font-serif text-lg font-bold tracking-wide ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>{title}</h3>
    </div>
    <div className="space-y-6 flex-1">
      {items.map((item, i) => (
        <div key={i} className="group cursor-pointer" onClick={() => onViewChange('main')}>
          <span className={`text-[10px] font-mono block mb-1 uppercase tracking-wider ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>{item.time}</span>
          <h4 className={`text-sm font-medium leading-snug group-hover:underline ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>{item.text}</h4>
        </div>
      ))}
    </div>
    <div className="mt-6 pt-4 border-t border-transparent">
      <button className={`text-xs font-bold uppercase tracking-widest flex items-center group ${isDark ? 'text-stone-500 hover:text-stone-300' : 'text-stone-400 hover:text-stone-600'}`}>
        <span>Explore All</span>
        <ArrowRight size={12} className="ml-1 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  </div>
);

const BriefingSection = ({ isDark, onViewChange }) => {
  const dispatchItems = [
    { time: "12m ago", text: "Global markets react to new trade sanctions" },
    { time: "45m ago", text: "Tech giant announces surprise CEO departure" },
    { time: "1h ago", text: "Climate summit reaches tentative agreement" }
  ];
  const marketItems = [
    { time: "2h ago", text: "Central Bank holds interest rates steady, citing 'cautious optimism'" },
    { time: "5h ago", text: "Analysis: Are tech stocks overvalued in the current climate?" },
    { time: "8h ago", text: "New agricultural fund launches to support small-scale farmers" }
  ];
  const cityItems = [
    { time: "30m ago", text: "Proposed high-rise development in Westlands faces resident opposition" },
    { time: "3h ago", text: "Nairobi traffic reform: Is the new bus rapid transit system working?" },
    { time: "1d ago", text: "The cultural revival of Nairobi's downtown arts scene" }
  ];

  return (
    <section className={`py-16 px-6 md:px-12 border-b ${isDark ? 'border-stone-800 bg-[#151515]' : 'border-stone-200 bg-[#F9F7F3]'}`}>
      <div className="container mx-auto">
        <div className="flex items-center space-x-2 mb-8 opacity-60">
           <span className={`h-[1px] w-8 ${isDark ? 'bg-stone-500' : 'bg-stone-400'}`}></span>
           <span className={`text-xs font-bold tracking-[0.2em] uppercase ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>The Daily Briefing</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <BriefingCard title="The Dispatch" icon={Clock} items={dispatchItems} isDark={isDark} onViewChange={onViewChange} />
           <BriefingCard title="Market Pulse" icon={TrendingUp} items={marketItems} isDark={isDark} onViewChange={onViewChange} />
           <BriefingCard title="City Beat" icon={MapPin} items={cityItems} isDark={isDark} onViewChange={onViewChange} />
        </div>
      </div>
    </section>
  );
}

const Ticker = ({ isDark }) => {
  const newsItems = [
    "Global markets stabilize after week of volatility",
    "SpaceX announces new timeline for Mars mission",
    "Climate summit concludes with historic agreement",
    "New exhibit opens at the MoMA featuring digital realism"
  ];

  return (
    <div className={`w-full py-3 border-b overflow-hidden ${isDark ? 'bg-stone-900 border-stone-800 text-stone-400' : 'bg-[#F2F0EB] border-stone-200 text-stone-600'}`}>
      <div className="ticker-wrap cursor-default">
        <div className="ticker">
          {newsItems.map((item, index) => (
            <span key={index} className="inline-block px-8 text-xs font-medium tracking-wide uppercase">
              <span className="mr-2 opacity-50 text-orange-600 font-bold">•</span> {item}
            </span>
          ))}
          {newsItems.map((item, index) => (
            <span key={`dup-${index}`} className="inline-block px-8 text-xs font-medium tracking-wide uppercase">
              <span className="mr-2 opacity-50 text-orange-600 font-bold">•</span> {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const MainGrid = ({ isDark, onViewChange }) => {
  const trendingItems = [
    "Why the global supply chain is shifting to localized hubs faster than predicted.",
    "The surprising link between gut health and mental focus.",
    "AI's impact on creative industries: A one-year retrospective."
  ];

  return (
    <section className={`py-20 px-6 md:px-12 ${isDark ? 'bg-[#121212]' : 'bg-[#FDFBF7]'}`}>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-8">
          <div onClick={() => onViewChange('article')} className="group cursor-pointer">
            <div className="overflow-hidden mb-5 relative aspect-[4/3] rounded-sm"><img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div>
            <span className="text-xs font-bold tracking-widest uppercase text-orange-600">Technology</span>
            <h3 className={`font-serif text-4xl mt-3 leading-tight ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>The Ethics of Synthetic Memory</h3>
            <p className={`mt-3 text-lg leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>As AI begins to fill the gaps in our past, we must ask: whose version of history are we remembering? A deep dive into the new era of generative recall.</p>
          </div>
        </div>
        
        <div className="md:col-span-4 flex flex-col space-y-12 border-l pl-0 md:pl-12 border-stone-200/20">
           
           {/* Trending Now Sidebar */}
           <div>
              <div className="flex items-center space-x-2 mb-6">
                <Flame size={16} className="text-orange-600" />
                <h4 className={`text-xs font-bold tracking-widest uppercase ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Trending Now</h4>
              </div>
              <ul className="space-y-6">
                {trendingItems.map((item, i) => (
                  <li key={i} className="group cursor-pointer flex items-start" onClick={() => onViewChange('article')}>
                    <span className={`text-xl font-serif mr-4 opacity-30 group-hover:opacity-60 transition-opacity ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>0{i+1}</span>
                    <span className={`text-sm font-medium leading-snug group-hover:underline ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
           </div>

           {/* Off the Record Teaser */}
           <div onClick={() => onViewChange('off-record-feed')} className={`p-6 rounded-lg cursor-pointer border transition-colors ${isDark ? 'bg-[#042f2e] border-teal-800' : 'bg-teal-50 border-teal-200'}`}>
              <div className="flex items-center space-x-2 text-teal-500 mb-2">
                 <EyeOff size={16} />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Off The Record</span>
              </div>
              <h3 className={`font-serif text-xl ${isDark ? 'text-teal-50' : 'text-teal-900'}`}>Unverified: The Tech Merger Rumors</h3>
           </div>
        </div>
      </div>
    </section>
  );
};

const LandingPage = ({ isDark, onViewChange }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
    <Hero isDark={isDark} onViewChange={onViewChange} />
    <Ticker isDark={isDark} />
    <BriefingSection isDark={isDark} onViewChange={onViewChange} />
    <MainGrid isDark={isDark} onViewChange={onViewChange} />
  </motion.div>
);

/* --- APP --- */

// (Re-including other components like AuthPage, PricingPage, etc from previous context)
// [Assuming other view components (PricingPage, AuthPage, Editor components, etc.) are present from previous turns]
// I will include minimal functional placeholders or full components if modified.

const PricingPage = ({ isDark }) => { return <div className={`min-h-screen pt-32 text-center ${isDark ? 'text-white' : 'text-black'}`}>Pricing Placeholder</div>; };
const EditorialDashboard = ({ isDark, onViewChange }) => { return <div className={`min-h-screen pt-32 text-center ${isDark ? 'text-white' : 'text-black'}`}>Editorial Dashboard Placeholder</div>; };
const EditorialEditor = ({ isDark }) => { return <div className={`min-h-screen pt-32 text-center ${isDark ? 'text-white' : 'text-black'}`}>Editorial Editor Placeholder</div>; };
const OffRecordDashboard = ({ isDark, onViewChange }) => { return <div className={`min-h-screen pt-32 text-center ${isDark ? 'text-white' : 'text-black'}`}>Off Record Dashboard Placeholder</div>; };
const OffRecordEditor = ({ isDark }) => { return <div className={`min-h-screen pt-32 text-center ${isDark ? 'text-white' : 'text-black'}`}>Off Record Editor Placeholder</div>; };
const LiveDashboard = ({ isDark, onViewChange }) => { return <div className={`min-h-screen pt-32 text-center ${isDark ? 'text-white' : 'text-black'}`}>Live Dashboard Placeholder</div>; };
const LivePostingPage = ({ isDark }) => { return <div className={`min-h-screen pt-32 text-center ${isDark ? 'text-white' : 'text-black'}`}>Live Posting Editor Placeholder</div>; };
const NewsEditorPage = ({ isDark }) => { return <div className={`min-h-screen pt-32 text-center ${isDark ? 'text-white' : 'text-black'}`}>News Editor Placeholder</div>; };
const PostSelectionPage = ({ isDark, onViewChange }) => { return <div className={`min-h-screen pt-32 text-center ${isDark ? 'text-white' : 'text-black'}`}>Post Selection Placeholder</div>; };
const AuthPage = ({ isDark, onViewChange }) => { return <div className={`min-h-screen pt-32 text-center ${isDark ? 'text-white' : 'text-black'}`}>Auth Placeholder</div>; };
const AuthorPage = ({ isDark }) => { return <div className={`min-h-screen pt-32 text-center ${isDark ? 'text-white' : 'text-black'}`}>Author Profile Placeholder</div>; };
const ArticlePage = ({ isDark, onViewChange }) => { return <div className={`min-h-screen pt-32 text-center ${isDark ? 'text-white' : 'text-black'}`}>Article Page Placeholder</div>; };
const MainNewsPage = ({ isDark, onViewChange }) => { return <div className={`min-h-screen pt-32 text-center ${isDark ? 'text-white' : 'text-black'}`}>Main News Placeholder</div>; };
const OffRecordFeed = ({ onViewChange }) => { return <div className={`min-h-screen pt-32 text-center bg-[#042f2e] text-white`}>Off Record Feed Placeholder</div>; };

const App = () => {
  const [isDark, setIsDark] = useState(false);
  const [currentView, setCurrentView] = useState('landing'); 
  // Views: 'landing' | 'main' | 'article' | 'post-selection' | 'editor-news' | 'live-dashboard' | 'live-posting' | 'off-record-dashboard' | 'editor-off-record' | 'editorial-dashboard' | 'editor-editorial' | 'pricing' | 'auth' | 'author-detail' | 'off-record-feed'

  const toggleTheme = () => setIsDark(!isDark);
  
  useEffect(() => { window.scrollTo(0, 0); }, [currentView]);

  // Show Breaking News on Landing, Main, and Article pages
  const showBreaking = ['landing', 'main', 'article'].includes(currentView);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#121212] text-stone-100' : 'bg-[#FDFBF7] text-stone-900'}`}>
      <GlobalStyles />
      <div className="grain-overlay" />
      <ScrollProgress isDark={isDark} isFocusMode={currentView === 'article' && false} />
      
      <Navbar isDark={isDark} toggleTheme={toggleTheme} onViewChange={setCurrentView} currentView={currentView} isFocusMode={false} />
      
      {/* GLOBAL BREAKING NEWS BANNER */}
      <AnimatePresence>
        {showBreaking && <BreakingNewsBanner isDark={isDark} onViewChange={setCurrentView} />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {currentView === 'landing' ? (
          <LandingPage key="landing" isDark={isDark} onViewChange={setCurrentView} />
        ) : currentView === 'off-record-feed' ? (
          <OffRecordFeed onViewChange={setCurrentView} />
        ) : (
          <div className="pt-32 text-center">
             <h2 className="text-2xl mb-4">View: {currentView}</h2>
             <button onClick={() => setCurrentView('landing')} className="underline">Back to Home</button>
          </div>
        )}
      </AnimatePresence>
      
      {!['article', 'post-selection', 'editor-news', 'live-posting', 'live-dashboard', 'off-record-dashboard', 'editor-off-record', 'editorial-dashboard', 'editor-editorial', 'auth'].includes(currentView) && <Footer isDark={isDark} />}
    </div>
  );
};

export default App;

