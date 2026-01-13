
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Send, Layout, ChevronDown, Hash, ChevronRight, AlignLeft, CheckCircle2, Globe } from 'lucide-react';
import Link from 'next/link';

const EditorBlock = ({ type, content, placeholder }) => {
  const isDark = false; // Simplified
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


export default function NewsEditorPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [category, setCategory] = useState('World');
  const isDark = false; // Simplified

  return (
    <div className={`min-h-screen relative flex flex-col transition-colors duration-500 ${isDark ? 'bg-[#121212]' : 'bg-[#FDFBF7]'}`}>
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

      <main className={`flex-1 pt-16 pb-16 transition-all duration-300 ${isSidebarOpen ? 'pr-0 md:pr-[320px]' : 'pr-0'}`}>
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <button className={`flex items-center space-x-2 text-xs font-bold tracking-widest uppercase border rounded px-3 py-1.5 transition-colors ${isDark ? 'border-stone-700 text-stone-400 hover:border-stone-500' : 'border-stone-300 text-stone-500 hover:border-stone-400'}`}>
                  <span>{category}</span>
                  <ChevronDown size={12} />
                </button>
              </div>
              <div className={`flex-1 flex items-center space-x-2 border-b border-transparent focus-within:border-stone-300 ${isDark ? 'focus-within:border-stone-700' : ''} transition-colors pb-1`}>
                <Hash size={14} className={isDark ? 'text-stone-600' : 'text-stone-400'} />
                <input type="text" placeholder="Add tags..." className={`bg-transparent w-full text-xs font-medium outline-none ${isDark ? 'text-stone-300 placeholder-stone-700' : 'text-stone-700 placeholder-stone-300'}`} />
              </div>
            </div>
            <input type="text" placeholder="Headline" autoFocus className={`w-full bg-transparent outline-none font-serif text-5xl md:text-6xl font-bold leading-[1.1] placeholder-opacity-30 ${isDark ? 'text-stone-100 placeholder-stone-700' : 'text-stone-900 placeholder-stone-300'}`} />
            <p className={`text-xs text-right mt-2 ${isDark ? 'text-stone-600' : 'text-stone-400'}`}>0 / 80 characters</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="min-h-[500px]">
            <EditorBlock type="paragraph" placeholder="Tell your story..." />
          </motion.div>
        </div>
      </main>
      
      <aside className={`fixed right-0 top-16 bottom-16 w-[320px] border-l transform transition-transform duration-300 z-20 overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} ${isDark ? 'bg-[#181818] border-stone-800' : 'bg-white border-stone-200'}`}>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`absolute -left-8 top-6 p-1.5 rounded-l border-y border-l shadow-sm md:block hidden ${isDark ? 'bg-[#181818] border-stone-800 text-stone-400' : 'bg-white border-stone-200 text-stone-500'}`}>
          {isSidebarOpen ? <ChevronRight size={16} /> : <AlignLeft size={16} />}
        </button>
        <div className="p-6 space-y-8">
          <div>
            <h4 className={`text-xs font-bold tracking-widest uppercase mb-4 flex items-center ${isDark ? 'text-stone-500' : 'text-stone-400'}`}><CheckCircle2 size={12} className="mr-2" /> Pre-Flight</h4>
            <div className="space-y-3">
              {[{ label: "Headline optimized", done: true }, { label: "Featured image added", done: false }].map((item, i) => (
                <div key={i} className="flex items-center space-x-3 text-sm">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${item.done ? (isDark ? 'bg-green-900/20 border-green-800 text-green-600' : 'bg-green-100 border-green-300 text-green-600') : (isDark ? 'border-stone-700' : 'border-stone-300')}`}>
                    {item.done && <CheckCircle2 size={10} />}
                  </div>
                  <span className={`${item.done ? 'opacity-50 line-through' : ''} ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className={`text-xs font-bold tracking-widest uppercase mb-4 flex items-center ${isDark ? 'text-stone-500' : 'text-stone-400'}`}><Globe size={12} className="mr-2" /> SEO Preview</h4>
            <div className={`p-4 rounded text-sm ${isDark ? 'bg-stone-800/50' : 'bg-stone-50'}`}>
              <div className="text-blue-500 text-base font-medium truncate mb-1">Headline Preview | The Chronicle</div>
              <div className="text-green-600 text-xs mb-2">www.chronicle.com/news/story-slug</div>
              <div className={`text-xs leading-snug ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>This is how your story will appear in search results.</div>
            </div>
          </div>
        </div>
      </aside>

      <footer className={`fixed bottom-0 left-0 right-0 h-16 border-t px-6 md:px-12 flex items-center justify-between z-30 ${isDark ? 'bg-[#121212] border-stone-800' : 'bg-white border-stone-200'}`}>
        <div className="flex items-center space-x-6">
          <div className={`flex items-center space-x-2 text-xs font-medium cursor-pointer hover:underline ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
            <Layout size={14} />
            <span>Preview</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className={`flex items-center space-x-2 px-4 py-2 rounded text-sm font-medium transition-colors ${isDark ? 'text-stone-400 hover:bg-stone-800' : 'text-stone-600 hover:bg-stone-100'}`}>
            <Save size={16} />
            <span>Save Draft</span>
          </button>
          <button className={`flex items-center space-x-2 px-6 py-2 rounded-full text-sm font-bold tracking-wide uppercase text-white shadow-lg transition-transform hover:-translate-y-0.5 ${isDark ? 'bg-stone-100 text-stone-900 hover:bg-white' : 'bg-stone-900 hover:bg-stone-800'}`}>
            <span>Publish</span>
            <Send size={14} />
          </button>
        </div>
      </footer>
    </div>
  );
}
