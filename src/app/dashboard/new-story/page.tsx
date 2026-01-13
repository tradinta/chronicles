
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Save,
  Send,
  Layout,
  ChevronDown,
  Hash,
  ChevronRight,
  AlignLeft,
  CheckCircle2,
  Globe,
  User,
  AlertTriangle,
  Type,
  Quote,
  Image as ImageIcon,
  MapPin,
  Calendar,
  UserPlus,
  GripVertical,
  FileText,
  BarChart,
  LayoutTemplate,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const EditorBlock = ({ type, content, isDark, placeholder }) => {
  return (
    <div className="relative group mb-4">
      {/* Block Controls - Hover Appear */}
      <div className="absolute -left-12 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
        <div className="cursor-grab text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"><GripVertical size={16} /></div>
      </div>

      {/* Content Based on Type */}
      {type === 'h2' && (
        <div 
          contentEditable suppressContentEditableWarning
          className={`editor-placeholder text-3xl font-serif font-medium mb-4 outline-none ${isDark ? 'text-stone-200' : 'text-stone-800'}`}
          placeholder={placeholder || "Heading"}
        >{content}</div>
      )}

      {type === 'paragraph' && (
        <div 
          contentEditable suppressContentEditableWarning
          className={`editor-placeholder text-lg font-sans leading-relaxed outline-none ${isDark ? 'text-stone-300' : 'text-stone-800'}`}
          placeholder={placeholder || "Start typing..."}
        >{content}</div>
      )}

      {type === 'quote' && (
        <div className={`my-6 border-l-4 pl-6 py-2 italic ${isDark ? 'border-stone-700 text-stone-400' : 'border-stone-300 text-stone-600'}`}>
           <div contentEditable suppressContentEditableWarning className="text-xl font-serif outline-none mb-2" placeholder="Quote text...">{content}</div>
           <div contentEditable suppressContentEditableWarning className="text-sm font-sans uppercase tracking-wider opacity-70 outline-none" placeholder="Source / Author"></div>
        </div>
      )}

      {type === 'pullquote' && (
        <div className={`my-12 py-8 border-y-2 text-center ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
           <div contentEditable suppressContentEditableWarning className={`text-3xl md:text-4xl font-serif font-bold italic outline-none ${isDark ? 'text-stone-100' : 'text-stone-900'}`} placeholder="Key statement...">{content}</div>
        </div>
      )}

      {type === 'image' && (
        <div className={`my-8 p-8 border border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${isDark ? 'border-stone-800 bg-stone-900/50' : 'border-stone-300 bg-stone-50'}`}>
           <div className={`mb-4 p-4 rounded-full ${isDark ? 'bg-stone-800' : 'bg-white shadow-sm'}`}><ImageIcon size={24} className={isDark ? 'text-stone-400' : 'text-stone-500'} /></div>
           <span className={`text-sm font-medium ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Drag and drop an image, or click to upload</span>
           <span className={`text-xs mt-2 ${isDark ? 'text-stone-600' : 'text-stone-400'}`}>High resolution recommended (1200px+)</span>
        </div>
      )}

      {type === 'infobox' && (
        <div className={`my-8 p-6 rounded border ${isDark ? 'bg-stone-800/30 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
           <div className="flex items-center space-x-2 mb-3">
              <BarChart size={16} className={isDark ? 'text-stone-400' : 'text-stone-600'} />
              <div contentEditable suppressContentEditableWarning className={`text-xs font-bold uppercase tracking-wider outline-none ${isDark ? 'text-stone-400' : 'text-stone-600'}`} placeholder="FACT BOX TITLE">KEY STATISTICS</div>
           </div>
           <div contentEditable suppressContentEditableWarning className={`text-sm leading-relaxed outline-none ${isDark ? 'text-stone-300' : 'text-stone-700'}`} placeholder="Add context or data points here..."></div>
        </div>
      )}

      {type === 'embed' && (
        <div className={`my-8 p-4 rounded border flex items-center space-x-4 ${isDark ? 'bg-stone-800/30 border-stone-700' : 'bg-white border-stone-200'}`}>
           <div className={`p-2 rounded ${isDark ? 'bg-stone-800 text-blue-400' : 'bg-blue-50 text-blue-500'}`}> <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current"><title>Twitter</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg></div>
           <div className="flex-1">
              <div className={`text-xs font-bold uppercase ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>Social Embed</div>
              <div contentEditable suppressContentEditableWarning className={`text-sm outline-none ${isDark ? 'text-stone-300' : 'text-stone-700'}`} placeholder="Paste tweet or post URL..."></div>
           </div>
        </div>
      )}
    </div>
  );
};


export default function NewsEditorPage() {
  const [isDark, setIsDark] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isBreaking, setIsBreaking] = useState(false);
  const [blocks, setBlocks] = useState([
    { id: 1, type: 'paragraph', content: "The global summit concluded today with a historic agreement..." },
    { id: 2, type: 'quote', content: "This is a turning point for international diplomacy.", source: "Ambassador J. Smith" },
    { id: 3, type: 'paragraph', content: "Delegates from over 40 nations were present..." },
  ]);

  const addBlock = (type) => {
    setBlocks([...blocks, { id: Date.now(), type, content: '' }]);
  };

  useEffect(() => {
    // This is to simulate dark mode state. In a real app, this would come from a context or prop.
    if (typeof window !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  }, []);

  const EntryModal = () => (
    <AnimatePresence>
      {showEntryModal && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
            className={`w-full max-w-lg p-8 rounded-xl shadow-2xl relative border ${isDark ? 'bg-[#181818] border-stone-800' : 'bg-white border-stone-200'}`}
          >
             <h2 className={`text-2xl font-serif mb-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>New Story</h2>
             <p className={`text-sm mb-8 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Select the format and primary category to structure your reporting.</p>
             
             <div className="space-y-6">
                <div>
                   <label className={`block text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>News Type</label>
                   <div className="grid grid-cols-2 gap-3">
                      {['Breaking News', 'Standard Report', 'Feature Story', 'Special Investigation'].map((type, i) => (
                        <button key={i} className={`text-left p-3 rounded border text-sm transition-all hover:border-stone-400 ${isDark ? 'border-stone-700 bg-stone-800/50 text-stone-300' : 'border-stone-200 bg-stone-50 text-stone-700'}`}>
                           {type}
                        </button>
                      ))}
                   </div>
                </div>
                <div>
                   <label className={`block text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>Category</label>
                   <div className="flex flex-wrap gap-2">
                      {['Politics', 'Business', 'Technology', 'Science', 'Culture', 'Global'].map((cat, i) => (
                        <button key={i} className={`px-4 py-2 rounded-full border text-xs font-medium transition-colors ${isDark ? 'border-stone-700 text-stone-400 hover:border-stone-500' : 'border-stone-300 text-stone-600 hover:border-stone-400'}`}>
                           {cat}
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setShowEntryModal(false)}
                  className={`px-6 py-2 rounded bg-stone-900 text-white dark:bg-white dark:text-stone-900 text-sm font-bold uppercase tracking-wide hover:opacity-90`}
                >
                  Start Writing
                </button>
             </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={`min-h-screen pt-20 relative flex transition-colors duration-500 ${isDark ? 'bg-[#121212]' : 'bg-[#FDFBF7]'}`}>
      <EntryModal />
      
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-30 h-16 border-b px-6 flex items-center justify-between transition-colors duration-300 ${isDark ? 'bg-[#121212] border-stone-800' : 'bg-white border-stone-200'}`}>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className={`p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
            <ArrowLeft size={18} />
          </Link>
          <div className="flex flex-col">
            <span className={`text-xs font-bold tracking-widest uppercase ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
              Drafting
            </span>
            <span className={`text-sm font-serif font-bold ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>
               Standard Report
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
            <div className={`flex items-center space-x-2 text-xs font-mono ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               <span>Saved moments ago</span>
            </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pr-0 md:pr-[340px]' : 'pr-0'}`}>
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
          
          {/* Header Metadata */}
          <div className="mb-12 border-b border-stone-200 dark:border-stone-800 pb-8">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                   <button className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border transition-colors ${isDark ? 'border-stone-700 text-stone-400' : 'border-stone-300 text-stone-500'}`}>Politics</button>
                   <span className={`text-[10px] ${isDark ? 'text-stone-600' : 'text-stone-400'}`}>/</span>
                   <button className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border transition-colors ${isDark ? 'border-stone-700 text-stone-400' : 'border-stone-300 text-stone-500'}`}>Elections</button>
                </div>
                <div 
                   onClick={() => setIsBreaking(!isBreaking)}
                   className={`flex items-center space-x-2 px-3 py-1 rounded-full cursor-pointer transition-colors ${isBreaking ? 'bg-red-500 text-white' : (isDark ? 'bg-stone-800 text-stone-500' : 'bg-stone-100 text-stone-400')}`}
                >
                   <AlertTriangle size={12} strokeWidth={isBreaking ? 2 : 1.5} />
                   <span className="text-[10px] font-bold uppercase tracking-wider">Breaking News</span>
                </div>
             </div>

             <input 
               type="text" 
               placeholder="Headline" 
               autoFocus
               className={`w-full bg-transparent outline-none font-serif text-5xl md:text-6xl font-bold leading-[1.1] mb-4 placeholder-opacity-30 ${isDark ? 'text-stone-100 placeholder-stone-700' : 'text-stone-900 placeholder-stone-300'}`}
             />
             <input 
               type="text" 
               placeholder="Subheading or summary (optional)" 
               className={`w-full bg-transparent outline-none text-xl font-light mb-6 placeholder-opacity-50 ${isDark ? 'text-stone-400 placeholder-stone-700' : 'text-stone-600 placeholder-stone-300'}`}
             />

             <div className="flex items-center space-x-6 text-xs">
                <div className={`flex items-center space-x-2 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                   <UserPlus size={14} />
                   <span className="font-medium">Sarah Jenkins</span>
                </div>
                <div className={`flex items-center space-x-2 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                   <MapPin size={14} />
                   <span className="font-medium">Washington, D.C.</span>
                </div>
                <div className={`flex items-center space-x-2 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                   <Calendar size={14} />
                   <span className="font-medium">Draft • Oct 14, 2024</span>
                </div>
             </div>
          </div>

          {/* Modular Editor Area */}
          <div className="min-h-[500px] pb-32 relative">
             {blocks.map((block) => (
                <EditorBlock key={block.id} type={block.type} content={block.content} isDark={isDark} />
             ))}

             {/* Add Block Bar */}
             <div className={`my-8 py-4 border-t border-b border-dashed flex justify-center space-x-4 opacity-50 hover:opacity-100 transition-opacity ${isDark ? 'border-stone-800' : 'border-stone-300'}`}>
                {[
                  { type: 'paragraph', icon: FileText, label: 'Text' },
                  { type: 'quote', icon: Quote, label: 'Quote' },
                  { type: 'image', icon: ImageIcon, label: 'Image' },
                  { type: 'infobox', icon: BarChart, label: 'Info' },
                  { type: 'embed', icon: LayoutTemplate, label: 'Embed' },
                ].map(tool => (
                   <button 
                     key={tool.type} 
                     onClick={() => addBlock(tool.type)}
                     className={`flex flex-col items-center space-y-1 group`}
                   >
                      <div className={`p-2 rounded-full transition-colors ${isDark ? 'bg-stone-800 group-hover:bg-stone-700 text-stone-400' : 'bg-stone-100 group-hover:bg-stone-200 text-stone-600'}`}>
                         <tool.icon size={16} />
                      </div>
                      <span className="text-[10px] uppercase font-bold text-stone-500">{tool.label}</span>
                   </button>
                ))}
             </div>
          </div>

        </div>
      </main>

      {/* Right Sidebar - Contextual Tools */}
      <aside className={`fixed right-0 top-16 bottom-16 w-[340px] border-l transform transition-transform duration-300 z-20 overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} ${isDark ? 'bg-[#181818] border-stone-800' : 'bg-white border-stone-200'}`}>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`absolute -left-8 top-6 p-1.5 rounded-l border-y border-l shadow-sm md:block hidden ${isDark ? 'bg-[#181818] border-stone-800 text-stone-400' : 'bg-white border-stone-200 text-stone-500'}`}>
          {isSidebarOpen ? <ChevronRight size={16} /> : <AlignLeft size={16} />}
        </button>
        
        <div className="p-6 space-y-8">
           
           {/* Section: Checklist */}
           <div>
            <h4 className={`text-xs font-bold tracking-widest uppercase mb-4 flex items-center ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
              <CheckCircle2 size={12} className="mr-2" /> Pre-Flight
            </h4>
            <div className="space-y-3">
              {[{ label: "Headline optimized", done: true }, { label: "Lead image added", done: false }, { label: "Tags selected", done: true }].map((item, i) => (
                <div key={i} className="flex items-center space-x-3 text-sm">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${item.done ? (isDark ? 'bg-green-900/20 border-green-800 text-green-600' : 'bg-green-100 border-green-300 text-green-600') : (isDark ? 'border-stone-700' : 'border-stone-300')}`}>{item.done && <CheckCircle2 size={10} />}</div>
                  <span className={`${item.done ? 'opacity-50 line-through' : ''} ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>{item.label}</span>
                </div>
              ))}
            </div>
           </div>

           {/* Section: SEO */}
           <div>
            <h4 className={`text-xs font-bold tracking-widest uppercase mb-4 flex items-center ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
              <Globe size={12} className="mr-2" /> SEO Preview
            </h4>
            <div className={`p-4 rounded text-sm ${isDark ? 'bg-stone-800/50' : 'bg-stone-50'}`}>
               <div className="text-blue-500 text-base font-medium truncate mb-1">Headline Preview | The Chronicle</div>
               <div className="text-green-600 text-xs mb-2">www.chronicle.com/news/story-slug</div>
               <div className={`text-xs leading-snug ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>This is how your story will appear in search results. Make sure to include relevant keywords.</div>
            </div>
           </div>

           {/* Section: Context */}
           <div>
             <h4 className={`text-xs font-bold tracking-widest uppercase mb-4 flex items-center ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                <MessageCircle size={12} className="mr-2" /> Linked Tips
             </h4>
             <div className={`p-3 rounded border text-xs cursor-pointer ${isDark ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
                <div className="flex justify-between opacity-50 mb-1"><span>#9218</span><span>Off Record</span></div>
                <p className={isDark ? 'text-stone-300' : 'text-stone-700'}>"Budget hearing scheduled for tomorrow..."</p>
             </div>
           </div>

        </div>
      </aside>

      {/* Footer Actions */}
      <footer className={`fixed bottom-0 left-0 right-0 h-16 border-t px-6 md:px-12 flex items-center justify-between z-30 ${isDark ? 'bg-[#121212] border-stone-800' : 'bg-white border-stone-200'}`}>
         <div className="flex items-center space-x-6">
            <div className={`flex items-center space-x-2 text-xs font-medium cursor-pointer hover:underline ${isDark ? 'text-stone-500' : 'text-stone-400'}`}><Layout size={14} /><span>Preview</span></div>
         </div>
         <div className="flex items-center space-x-4">
            <button className={`px-4 py-2 rounded text-sm font-medium transition-colors ${isDark ? 'text-stone-400 hover:bg-stone-800' : 'text-stone-600 hover:bg-stone-100'}`}>Save Draft</button>
            <button className={`px-4 py-2 rounded text-sm font-medium transition-colors ${isDark ? 'text-stone-400 hover:bg-stone-800' : 'text-stone-600 hover:bg-stone-100'}`}>Schedule</button>
            <button className={`px-6 py-2 rounded-full text-sm font-bold tracking-wide uppercase text-white shadow-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 transition-colors flex items-center space-x-2`}>
               <span>Publish</span>
               <Send size={14} />
            </button>
         </div>
      </footer>

    </div>
  );
};
```