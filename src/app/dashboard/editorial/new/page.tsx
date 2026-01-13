
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Quote, 
  BookOpen, 
  User, 
  AlignJustify,
  Layout,
  Send,
  AlignLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const EditorBlock = ({ isDark, placeholder, content, type = 'paragraph' }) => {
  return (
    <div className="relative group mb-4">
      <div 
        contentEditable
        suppressContentEditableWarning
        className={`editor-placeholder outline-none leading-relaxed transition-colors
          ${type === 'h2' ? 'text-3xl font-serif font-medium mb-4' : 
            type === 'quote' ? 'text-2xl font-serif italic border-l-4 pl-6 py-2 my-6 opacity-80' : 
            'text-lg font-sans'}
          ${isDark ? 'text-stone-200 border-stone-700' : 'text-stone-800 border-stone-200'}
        `}
        placeholder={placeholder}
      >
        {content}
      </div>
    </div>
  );
};


const EditorialEditor = () => {
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [storyType, setStoryType] = useState('Opinion');
  const [dropCap, setDropCap] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  }, []);

  return (
    <div className={`min-h-screen pt-24 pb-24 relative flex transition-colors duration-500 ${isDark ? 'bg-[#121212]' : 'bg-[#FDFBF7]'}`}>
      
      {/* Main Editor */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pr-0 md:pr-[320px]' : 'pr-0'}`}>
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          
          {/* Metadata */}
          <div className="mb-12 space-y-6 text-center">
             <div className="inline-flex items-center justify-center space-x-4 mb-4">
                {['Opinion', 'Analysis', 'Voice'].map(type => (
                   <button 
                     key={type} 
                     onClick={() => setStoryType(type)}
                     className={`text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 border-b-2 transition-colors
                       ${storyType === type 
                         ? (isDark ? 'text-indigo-400 border-indigo-500' : 'text-indigo-800 border-indigo-600') 
                         : 'border-transparent text-stone-500 hover:text-stone-400'}`}
                   >
                     {type}
                   </button>
                ))}
             </div>

             <input 
               type="text" 
               placeholder="The Headline" 
               autoFocus
               className={`w-full bg-transparent outline-none font-serif text-5xl md:text-7xl font-bold leading-[1.1] text-center placeholder-opacity-20
                 ${isDark ? 'text-stone-100 placeholder-stone-700' : 'text-stone-900 placeholder-stone-300'}`}
             />
             
             <input 
               type="text" 
               placeholder="A brief, engaging subtitle to set the tone..." 
               className={`w-full bg-transparent outline-none font-serif italic text-xl md:text-2xl text-center placeholder-opacity-40
                 ${isDark ? 'text-stone-400 placeholder-stone-700' : 'text-stone-600 placeholder-stone-300'}`}
             />
          </div>

          <div className="w-12 h-[1px] bg-stone-500/30 mx-auto mb-12"></div>

          {/* Editor Body */}
          <div className="min-h-[500px]">
             <div className="relative group mb-6">
                <div 
                  contentEditable
                  suppressContentEditableWarning
                  className={`editor-placeholder outline-none text-lg md:text-xl leading-[1.8] font-serif transition-colors
                    ${dropCap ? 'drop-cap' : ''}
                    ${isDark ? 'text-stone-200' : 'text-stone-800'}
                  `}
                  placeholder="Begin your piece..."
                >
                  It is often said that history repeats itself, but in the digital age, it stutters. The rhythm of progress has been replaced by a chaotic noise that we mistake for momentum.
                </div>
             </div>

             <EditorBlock isDark={isDark} content="We find ourselves at a crossroads not of technology, but of philosophy." />
             
             <div className={`my-12 py-8 border-y-2 text-center ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
                <Quote size={24} className={`mx-auto mb-4 ${isDark ? 'text-indigo-500' : 'text-indigo-400'}`} />
                <div 
                  contentEditable 
                  suppressContentEditableWarning
                  className={`text-2xl md:text-4xl font-serif font-bold italic outline-none ${isDark ? 'text-stone-100' : 'text-stone-900'}`}
                  placeholder='"Key insight or powerful statement..."'
                >
                </div>
             </div>

             <EditorBlock isDark={isDark} placeholder="Continue writing..." />
          </div>

        </div>
      </main>

      {/* Sidebar */}
      <aside className={`fixed right-0 top-16 bottom-16 w-[320px] border-l transform transition-transform duration-300 z-20 overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} ${isDark ? 'bg-[#181818] border-stone-800' : 'bg-white border-stone-200'}`}>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`absolute -left-8 top-6 p-1.5 rounded-l border-y border-l shadow-sm md:block hidden ${isDark ? 'bg-[#181818] border-stone-800 text-stone-400' : 'bg-white border-stone-200 text-stone-500'}`}>
          {isSidebarOpen ? <ChevronRight size={16} /> : <AlignLeft size={16} />}
        </button>
        
        <div className="p-6 space-y-8">
           {/* Voice & Tone */}
           <div>
              <h4 className={`text-xs font-bold tracking-widest uppercase mb-4 flex items-center ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                <User size={12} className="mr-2" /> Author Voice
              </h4>
              <div className={`p-4 rounded border text-sm mb-4 ${isDark ? 'bg-stone-800 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-indigo-500">Analysis Mode</span>
                 </div>
                 <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Keep sentences punchy. Avoid passive voice. Focus on "Why" rather than "What".</p>
              </div>
              <div className="flex items-center justify-between text-xs">
                 <span className={isDark ? 'text-stone-400' : 'text-stone-600'}>Drop Cap Style</span>
                 <button onClick={() => setDropCap(!dropCap)} className={`w-8 h-4 rounded-full p-0.5 flex items-center transition-colors ${dropCap ? 'bg-indigo-600 justify-end' : 'bg-stone-600 justify-start'}`}>
                    <div className="w-3 h-3 rounded-full bg-white" />
                 </button>
              </div>
           </div>

           {/* References */}
           <div>
            <h4 className={`text-xs font-bold tracking-widest uppercase mb-4 flex items-center ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
              <BookOpen size={12} className="mr-2" /> Citations
            </h4>
            <div className={`border border-dashed rounded p-4 text-center ${isDark ? 'border-stone-800' : 'border-stone-300'}`}>
               <p className={`text-xs mb-2 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>No citations added.</p>
               <button className="text-[10px] uppercase font-bold tracking-wider hover:underline text-indigo-500">Add Reference</button>
            </div>
           </div>

           {/* Metrics */}
           <div>
             <h4 className={`text-xs font-bold tracking-widest uppercase mb-4 flex items-center ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                <AlignJustify size={12} className="mr-2" /> Metrics
             </h4>
             <div className="grid grid-cols-2 gap-4 text-center">
                <div className={`p-3 rounded ${isDark ? 'bg-stone-800' : 'bg-stone-100'}`}>
                   <div className={`text-xl font-serif ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>420</div>
                   <div className="text-[10px] uppercase text-stone-500">Words</div>
                </div>
                <div className={`p-3 rounded ${isDark ? 'bg-stone-800' : 'bg-stone-100'}`}>
                   <div className={`text-xl font-serif ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>2m</div>
                   <div className="text-[10px] uppercase text-stone-500">Read Time</div>
                </div>
             </div>
           </div>
        </div>
      </aside>

      {/* Footer Actions */}
      <footer className={`fixed bottom-0 left-0 right-0 h-16 border-t px-6 md:px-12 flex items-center justify-between z-30 ${isDark ? 'bg-[#121212] border-stone-800' : 'bg-white border-stone-200'}`}>
         <div className="flex items-center space-x-6">
            <Link href="#" className={`flex items-center space-x-2 text-xs font-medium cursor-pointer hover:underline ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                <Layout size={14} />
                <span>Preview</span>
            </Link>
         </div>
         <div className="flex items-center space-x-4">
            <button className={`px-4 py-2 rounded text-sm font-medium transition-colors ${isDark ? 'text-stone-400 hover:bg-stone-800' : 'text-stone-600 hover:bg-stone-100'}`}>Save Draft</button>
            <button className={`px-6 py-2 rounded-full text-sm font-bold tracking-wide uppercase text-white shadow-lg bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center space-x-2`}>
               <span>Submit Opinion</span>
               <Send size={14} />
            </button>
         </div>
      </footer>

    </div>
  );
};

export default EditorialEditor;
