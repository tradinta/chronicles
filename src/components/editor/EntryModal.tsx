
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

type EntryModalProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  isDark: boolean;
  setCategory: (category: string) => void;
  setArticleFormat: (format: string) => void;
};

const kenyanCategories = ['Politics', 'Business', 'Counties', 'Technology', 'Sports', 'Africa', 'World', 'Opinion'];
const articleFormats = ['Standard Report', 'Breaking Wire', 'Longform', 'Investigation'];

export const EntryModal = ({ show, setShow, isDark, setCategory, setArticleFormat }: EntryModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);

  const handleCreateDraft = () => {
    if (selectedCategory) {
      setCategory(selectedCategory);
    }
    if (selectedFormat) {
      setArticleFormat(selectedFormat);
    }
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
            className={`w-full max-w-2xl p-8 rounded-xl shadow-2xl relative border overflow-hidden ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}
          >
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-pink-500 to-purple-500"></div>

             <div className="mb-8">
               <h2 className={`text-3xl font-serif mb-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>New Assignment</h2>
               <p className={`text-sm ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Configure the parameters for your new piece.</p>
             </div>
             
             <div className="space-y-8">
                <div>
                   <label className={`block text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>Format</label>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {articleFormats.map((format) => (
                        <button 
                          key={format} 
                          onClick={() => setSelectedFormat(format)}
                          className={`text-left p-3 rounded-md border text-sm transition-all group ${
                            selectedFormat === format 
                              ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background' 
                              : (isDark ? 'border-stone-700 bg-stone-800/50 text-stone-300 hover:border-stone-600' : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-400')
                          }`}
                        >
                           <span className={`block font-medium transition-colors ${selectedFormat === format ? 'text-primary' : 'group-hover:text-foreground'}`}>{format}</span>
                        </button>
                      ))}
                   </div>
                </div>
                <div>
                   <label className={`block text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>Primary Section</label>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {kenyanCategories.map((cat) => (
                        <button 
                          key={cat} 
                          onClick={() => setSelectedCategory(cat)}
                           className={`px-4 py-2 rounded-md border text-xs font-medium transition-colors ${
                            selectedCategory === cat 
                              ? 'bg-primary text-primary-foreground border-primary' 
                              : (isDark ? 'border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-200' : 'border-stone-300 text-stone-600 hover:border-stone-400 hover:text-stone-900')
                          }`}
                        >
                           {cat}
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             <div className="mt-10 flex justify-end">
                <button 
                  onClick={handleCreateDraft}
                  disabled={!selectedCategory || !selectedFormat}
                  className="px-8 py-3 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Draft
                </button>
             </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
