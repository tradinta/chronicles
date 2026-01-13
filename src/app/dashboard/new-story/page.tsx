
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useInView } from 'framer-motion';
import { 
  Search, Sun, Moon, ArrowRight, Bookmark, Share2, X, ChevronRight, 
  Clock, TrendingUp, ArrowUpRight, Type, 
  ArrowLeft, Highlighter, Volume2, Minimize2, PenTool, 
  Radio, FileText, Lock, Feather, EyeOff, Mic, ShieldAlert,
  Save, Calendar, Send, Image as ImageIcon, MoreVertical, Plus,
  Hash, Layout, Globe, AlertCircle, CheckCircle2, ChevronDown, AlignLeft,
  PlayCircle, PauseCircle, StopCircle, Zap, Users2, BarChart3, History,
  Edit3, Trash2, Pin, AlertOctagon, RefreshCw,
  Eye, Flame, MessageCircle, FileWarning, Fingerprint, Shield, Skull,
  Quote, BookOpen, User, AlignJustify, MapPin, AlertTriangle, Twitter,
  BarChart, LayoutTemplate, UserPlus, GripVertical, Terminal, LockKeyhole,
  Bot, Sparkles, Wand2, Bold, Italic, Link as LinkIcon, List, Heading1, Heading2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const EditorFloatingToolbar = ({ isDark, isVisible }) => {
  if (!isVisible) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`absolute -top-12 left-0 flex items-center space-x-1 p-1 rounded-lg shadow-xl border z-20 ${isDark ? 'bg-stone-800 border-stone-700 text-stone-300' : 'bg-white border-stone-200 text-stone-600'}`}
    >
      <button className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded"><Bold size={14} /></button>
      <button className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded"><Italic size={14} /></button>
      <button className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded"><LinkIcon size={14} /></button>
      <div className="w-px h-4 bg-stone-300 dark:bg-stone-600 mx-1"></div>
      <button className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded"><Heading1 size={14} /></button>
      <button className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded"><Heading2 size={14} /></button>
    </motion.div>
  );
};

const EditorBlock = ({ type, content, isDark, placeholder }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div 
      className="relative group mb-6"
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
    >
      {/* Block Controls - Hover Appear */}
      <div className="absolute -left-12 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
        <div className="cursor-grab text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"><GripVertical size={16} /></div>
      </div>

      <div className="relative">
        {/* Floating Toolbar (Simulated appearance on focus) */}
        <EditorFloatingToolbar isDark={isDark} isVisible={isFocused && type === 'paragraph'} />

        {/* Content Based on Type */}
        {type === 'h2' && (
          <div 
            contentEditable suppressContentEditableWarning
            className={`editor-placeholder text-3xl font-serif font-bold tracking-tight mb-4 outline-none ${isDark ? 'text-stone-100' : 'text-stone-900'}`}
            placeholder={placeholder || "Heading"}
          >{content}</div>
        )}

        {type === 'paragraph' && (
          <div 
            contentEditable suppressContentEditableWarning
            className={`editor-placeholder text-xl font-serif leading-[1.8] outline-none ${isDark ? 'text-stone-300' : 'text-stone-800'}`}
            placeholder={placeholder || "Start typing..."}
          >{content}</div>
        )}

        {type === 'quote' && (
          <div className={`my-8 pl-8 border-l-4 ${isDark ? 'border-orange-500' : 'border-orange-600'}`}>
             <div contentEditable suppressContentEditableWarning className={`text-2xl font-serif italic outline-none mb-3 ${isDark ? 'text-stone-200' : 'text-stone-900'}`} placeholder="Quote text...">{content}</div>
             <div className="flex items-center space-x-2">
                <div className="h-px w-8 bg-stone-400"></div>
                <div contentEditable suppressContentEditableWarning className="text-xs font-bold uppercase tracking-widest opacity-70 outline-none" placeholder="Source Name"></div>
             </div>
          </div>
        )}

        {type === 'image' && (
          <div className={`my-8 relative group rounded-lg overflow-hidden border transition-all ${isDark ? 'border-stone-800 bg-stone-900/50' : 'border-stone-200 bg-stone-50'}`}>
             <div className={`aspect-[21/9] flex flex-col items-center justify-center transition-colors ${isDark ? 'bg-stone-800/50' : 'bg-stone-100'}`}>
                 <ImageIcon size={32} className={`mb-3 ${isDark ? 'text-stone-600' : 'text-stone-400'}`} />
                 <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>Drag Media Here</span>
             </div>
             <div className={`p-3 text-xs flex justify-between border-t ${isDark ? 'border-stone-800 bg-stone-900' : 'border-stone-200 bg-white'}`}>
                <span className="opacity-50">Empty container</span>
                <span className="font-mono opacity-50">JPG, PNG</span>
             </div>
          </div>
        )}

        {type === 'infobox' && (
          <div className={`my-8 p-6 rounded-lg border ${isDark ? 'bg-indigo-900/10 border-indigo-500/30' : 'bg-indigo-50 border-indigo-100'}`}>
             <div className="flex items-center space-x-2 mb-4">
                <Sparkles size={16} className="text-indigo-500" />
                <div contentEditable suppressContentEditableWarning className={`text-xs font-bold uppercase tracking-widest outline-none text-indigo-500`} placeholder="FACT BOX TITLE">Key Takeaways</div>
             </div>
             <div contentEditable suppressContentEditableWarning className={`text-base leading-relaxed outline-none ${isDark ? 'text-stone-300' : 'text-stone-700'}`} placeholder="Add context or data points here..."></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function NewsEditorPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState('checklist'); // checklist, ai, assets
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [blocks, setBlocks] = useState([
    { id: 1, type: 'paragraph', content: "The global summit concluded today with a historic agreement..." },
    { id: 2, type: 'quote', content: "This is a turning point for international diplomacy.", source: "Ambassador J. Smith" },
    { id: 3, type: 'paragraph', content: "Delegates from over 40 nations were present to witness the signing, marking the end of months of tense negotiations." },
  ]);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const addBlock = (type) => {
    setBlocks([...blocks, { id: Date.now(), type, content: '' }]);
  };

  // Entry Modal
  const EntryModal = () => (
    <AnimatePresence>
      {showEntryModal && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
            className={`w-full max-w-lg p-8 rounded-xl shadow-2xl relative border overflow-hidden ${isDark ? 'bg-[#181818] border-stone-800' : 'bg-white border-stone-200'}`}
          >
             {/* Decorative top bar */}
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500"></div>

             <div className="mb-8">
               <h2 className={`text-3xl font-serif mb-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>New Assignment</h2>
               <p className={`text-sm ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Configure the parameters for your new piece.</p>
             </div>
             
             <div className="space-y-6">
                <div>
                   <label className={`block text-[10px] font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>Format</label>
                   <div className="grid grid-cols-2 gap-3">
                      {['Standard Report', 'Breaking Wire', 'Longform', 'Investigation'].map((type, i) => (
                        <button key={i} className={`text-left p-3 rounded border text-sm transition-all hover:border-orange-500 group ${isDark ? 'border-stone-700 bg-stone-800/50 text-stone-300' : 'border-stone-200 bg-stone-50 text-stone-700'}`}>
                           <span className="block font-medium group-hover:text-orange-500 transition-colors">{type}</span>
                        </button>
                      ))}
                   </div>
                </div>
                <div>
                   <label className={`block text-[10px] font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>Primary Section</label>
                   <div className="flex flex-wrap gap-2">
                      {['Politics', 'Business', 'Technology', 'Science', 'Culture'].map((cat, i) => (
                        <button key={i} className={`px-4 py-2 rounded-full border text-xs font-medium transition-colors ${isDark ? 'border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-200' : 'border-stone-300 text-stone-600 hover:border-stone-400 hover:text-stone-900'}`}>
                           {cat}
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             <div className="mt-10 flex justify-end">
                <button 
                  onClick={() => setShowEntryModal(false)}
                  className={`px-8 py-3 rounded-full bg-stone-900 text-white dark:bg-white dark:text-stone-900 text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-lg`}
                >
                  Create Draft
                </button>
             </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={`min-h-screen pt-16 relative flex transition-colors duration-500 ${isDark ? 'bg-[#121212]' : 'bg-[#FDFBF7]'}`}>
      <EntryModal />
      
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-500 ease-in-out ${isSidebarOpen && !isFocusMode ? 'md:pr-[360px]' : 'pr-0'}`}>
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
          
          {/* Header Metadata */}
          <motion.div 
            animate={{ opacity: isFocusMode ? 0.3 : 1, y: isFocusMode ? -20 : 0 }}
            className={`mb-12 border-b pb-8 transition-colors ${isDark ? 'border-stone-800' : 'border-stone-200'}`}
          >
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                   <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>Politics / Election 2024</span>
                </div>
                <div className="flex items-center space-x-4">
                   <button 
                      onClick={() => setIsFocusMode(!isFocusMode)}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border ${isFocusMode ? 'bg-orange-500 text-white border-orange-500' : (isDark ? 'border-stone-700 text-stone-400' : 'border-stone-300 text-stone-500')}`}
                   >
                      <Minimize2 size={12} />
                      <span>{isFocusMode ? 'Exit Zen' : 'Zen Mode'}</span>
                   </button>
                   <div 
                      onClick={() => setIsBreaking(!isBreaking)}
                      className={`cursor-pointer transition-colors ${isBreaking ? 'text-red-500 animate-pulse' : (isDark ? 'text-stone-700' : 'text-stone-300')}`}
                      title="Toggle Breaking Status"
                   >
                      <Zap size={18} fill={isBreaking ? "currentColor" : "none"} />
                   </div>
                </div>
             </div>

             <input 
               type="text" 
               placeholder="Headline" 
               autoFocus
               className={`w-full bg-transparent outline-none font-serif text-5xl md:text-6xl font-bold leading-[1.1] mb-6 placeholder-opacity-30 ${isDark ? 'text-stone-100 placeholder-stone-700' : 'text-stone-900 placeholder-stone-300'}`}
             />
             <input 
               type="text" 
               placeholder="Subheading or summary (optional)" 
               className={`w-full bg-transparent outline-none text-xl font-light mb-8 placeholder-opacity-50 ${isDark ? 'text-stone-400 placeholder-stone-700' : 'text-stone-600 placeholder-stone-300'}`}
             />

             <div className={`flex items-center space-x-6 text-xs font-mono uppercase tracking-wide opacity-60 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                <span>Sarah Jenkins</span>
                <span>•</span>
                <span>Oct 14, 2024</span>
                <span>•</span>
                <span>Drafting</span>
             </div>
          </motion.div>

          {/* Modular Editor Area */}
          <div className="min-h-[500px] pb-32 relative">
             {blocks.map((block) => (
                <EditorBlock key={block.id} type={block.type} content={block.content} isDark={isDark} placeholder="Type something..." />
             ))}

             {/* Add Block Trigger - Elegant Plus */}
             <div className="my-12 flex justify-center group relative">
                <div className={`absolute top-1/2 left-0 right-0 h-px transition-colors ${isDark ? 'bg-stone-800 group-hover:bg-stone-700' : 'bg-stone-200 group-hover:bg-stone-300'}`}></div>
                <div className={`relative z-10 px-4 py-2 rounded-full border flex space-x-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 ${isDark ? 'bg-stone-900 border-stone-700 shadow-xl' : 'bg-white border-stone-200 shadow-lg'}`}>
                   {[
                      { icon: Type, type: 'paragraph', tooltip: 'Text' },
                      { icon: Quote, type: 'quote', tooltip: 'Quote' },
                      { icon: Heading2, type: 'h2', tooltip: 'Heading' },
                      { icon: ImageIcon, type: 'image', tooltip: 'Image' },
                      { icon: Sparkles, type: 'infobox', tooltip: 'AI Box' },
                   ].map((tool) => (
                      <button 
                        key={tool.type} 
                        onClick={() => addBlock(tool.type)}
                        className={`p-1.5 rounded hover:scale-110 transition-transform ${isDark ? 'text-stone-400 hover:text-white' : 'text-stone-500 hover:text-black'}`}
                        title={tool.tooltip}
                      >
                         <tool.icon size={18} />
                      </button>
                   ))}
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* Right Sidebar - Contextual Tools */}
      <div 
        className={`fixed right-0 top-16 bottom-0 w-full md:w-[360px] border-l transform transition-all duration-500 z-30 
        ${isSidebarOpen && !isFocusMode ? 'translate-x-0' : 'translate-x-full'} 
        ${isDark ? 'bg-[#181818] border-stone-800' : 'bg-white border-stone-200'}`}
      >
        {/* Toggle Sidebar Button (Visible when closed) */}
        {!isSidebarOpen && !isFocusMode && (
           <button onClick={() => setIsSidebarOpen(true)} className={`absolute -left-10 top-6 p-2 rounded-l-md border-y border-l shadow-sm hidden md:block ${isDark ? 'bg-[#181818] border-stone-800 text-stone-400' : 'bg-white border-stone-200 text-stone-500'}`}>
              <AlignLeft size={16} />
           </button>
        )}

        {/* Sidebar Header / Tabs */}
        <div className={`h-14 border-b flex items-center px-2 ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
           {[
              { id: 'checklist', icon: CheckCircle2, label: 'Tasks' },
              { id: 'ai', icon: Bot, label: 'Co-Pilot' },
              { id: 'assets', icon: Layout, label: 'Assets' }
           ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveSidebarTab(tab.id)}
                className={`flex-1 h-full flex items-center justify-center text-xs font-bold uppercase tracking-wider border-b-2 transition-colors
                  ${activeSidebarTab === tab.id 
                     ? (isDark ? 'border-orange-500 text-orange-500' : 'border-orange-600 text-orange-600') 
                     : 'border-transparent text-stone-500 hover:text-stone-400'}`}
              >
                 <tab.icon size={14} className="mr-2" /> {tab.label}
              </button>
           ))}
           <button onClick={() => setIsSidebarOpen(false)} className={`ml-2 p-2 rounded hover:bg-stone-100 dark:hover:bg-stone-800 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
              <ChevronRight size={14} />
           </button>
        </div>
        
        <div className="p-6 overflow-y-auto h-[calc(100%-7rem)]">
           
           {/* TAB: CHECKLIST */}
           {activeSidebarTab === 'checklist' && (
             <div className="space-y-8 animate-in slide-in-from-right duration-300">
               <div>
                  <div className="flex justify-between items-end mb-4">
                     <h4 className={`text-xs font-bold tracking-widest uppercase ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Readability</h4>
                     <span className="text-xs font-mono text-green-500">Grade 8</span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                     <div className="w-[70%] h-full bg-green-500 rounded-full"></div>
                  </div>
               </div>

               <div>
                <h4 className={`text-xs font-bold tracking-widest uppercase mb-4 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Pre-Flight</h4>
                <div className="space-y-3">
                  {[{ label: "Headline optimized", done: true }, { label: "Lead image added", done: false }, { label: "Tags selected", done: true }, { label: "Facts Checked", done: false }].map((item, i) => (
                    <div key={i} className="flex items-center space-x-3 text-sm group cursor-pointer">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${item.done ? (isDark ? 'bg-green-900/20 border-green-800 text-green-600' : 'bg-green-100 border-green-300 text-green-600') : (isDark ? 'border-stone-700 group-hover:border-stone-500' : 'border-stone-300 group-hover:border-stone-400')}`}>{item.done && <CheckCircle2 size={10} />}</div>
                      <span className={`${item.done ? 'opacity-50 line-through' : ''} ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>{item.label}</span>
                    </div>
                  ))}
                </div>
               </div>

               <div>
                <h4 className={`text-xs font-bold tracking-widest uppercase mb-4 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>SEO Preview</h4>
                <div className={`p-4 rounded text-sm border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
                   <div className="text-blue-500 text-base font-medium truncate mb-1">Headline Preview | The Chronicle</div>
                   <div className="text-green-600 text-xs mb-2">www.chronicle.com/news/story-slug</div>
                   <div className={`text-xs leading-snug opacity-80 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>This is how your story will appear in search results. Make sure to include relevant keywords.</div>
                </div>
               </div>
             </div>
           )}

           {/* TAB: AI CO-PILOT */}
           {activeSidebarTab === 'ai' && (
              <div className="space-y-6 animate-in slide-in-from-right duration-300">
                 <div className={`p-4 rounded-lg border flex flex-col items-center text-center space-y-3 ${isDark ? 'bg-indigo-900/10 border-indigo-500/30' : 'bg-indigo-50 border-indigo-100'}`}>
                    <Wand2 size={24} className="text-indigo-500" />
                    <div>
                       <h4 className={`text-sm font-bold ${isDark ? 'text-indigo-200' : 'text-indigo-900'}`}>Headline Assistant</h4>
                       <p className={`text-xs mt-1 ${isDark ? 'text-indigo-300/70' : 'text-indigo-700/70'}`}>Generate 3 variations based on content.</p>
                    </div>
                    <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase rounded shadow-lg transition-colors">Generate</button>
                 </div>

                 <div>
                    <h4 className={`text-xs font-bold tracking-widest uppercase mb-4 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Tone Analysis</h4>
                    <div className="grid grid-cols-2 gap-2">
                       {['Objective', 'Urgent', 'Analytical', 'Critical'].map(tone => (
                          <div key={tone} className={`p-2 rounded text-xs text-center border ${isDark ? 'bg-stone-800 border-stone-700 text-stone-400' : 'bg-white border-stone-200 text-stone-600'}`}>
                             {tone}
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className={`p-4 rounded text-xs leading-relaxed border ${isDark ? 'bg-stone-800 border-stone-700 text-stone-400' : 'bg-white border-stone-200 text-stone-600'}`}>
                    <span className="font-bold block mb-1">Bias Check:</span>
                    Language appears neutral, though the second paragraph leans slightly towards a Western-centric perspective. Consider broadening the context.
                 </div>
              </div>
           )}

           {/* TAB: ASSETS */}
           {activeSidebarTab === 'assets' && (
              <div className="space-y-6 animate-in slide-in-from-right duration-300">
                 <div className={`p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${isDark ? 'border-stone-700 hover:border-stone-500 hover:bg-stone-800' : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'}`}>
                    <ImageIcon size={24} className="mb-2 opacity-50" />
                    <span className="text-xs font-bold uppercase opacity-50">Upload Media</span>
                 </div>
                 
                 <div>
                    <h4 className={`text-xs font-bold tracking-widest uppercase mb-4 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Library</h4>
                    <div className="grid grid-cols-2 gap-2">
                       {[1,2,3,4].map(i => (
                          <div key={i} className="aspect-square bg-stone-200 dark:bg-stone-800 rounded overflow-hidden relative group cursor-pointer">
                             <img src={`https://picsum.photos/200?random=${i}`} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Plus className="text-white" size={20} />
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           )}

        </div>

         {/* Footer Actions */}
        <motion.div 
          animate={{ y: isFocusMode ? 100 : 0 }}
          className={`absolute bottom-0 left-0 right-0 h-16 border-t px-6 flex items-center justify-between z-10 transition-transform duration-500 ${isDark ? 'bg-[#181818] border-stone-800' : 'bg-white border-stone-200'}`}
        >
           <div className="flex items-center space-x-6">
              <button onClick={() => router.push('/news')} className={`flex items-center space-x-2 text-xs font-medium cursor-pointer hover:underline ${isDark ? 'text-stone-500' : 'text-stone-400'}`}><Layout size={14} /><span>Preview</span></button>
           </div>
           <div className="flex items-center space-x-4">
              <button className={`px-4 py-2 rounded text-sm font-medium transition-colors ${isDark ? 'text-stone-400 hover:bg-stone-700' : 'text-stone-600 hover:bg-stone-100'}`}>Save</button>
              <button className={`px-6 py-2 rounded-full text-sm font-bold tracking-wide uppercase text-white shadow-lg bg-orange-600 hover:bg-orange-700 transition-colors flex items-center space-x-2`}>
                 <span>Publish</span>
                 <Send size={14} />
              </button>
           </div>
        </motion.div>
      </div>
    </div>
  );
};
