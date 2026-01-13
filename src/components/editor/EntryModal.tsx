
'use client';
import { motion, AnimatePresence } from 'framer-motion';

type EntryModalProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  isDark: boolean;
  setCategory: (category: string) => void;
};

const kenyanCategories = ['Politics', 'Business', 'Counties', 'Technology', 'Sports', 'Africa', 'World', 'Opinion'];

export const EntryModal = ({ show, setShow, isDark, setCategory }: EntryModalProps) => (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
            className={`w-full max-w-lg p-8 rounded-xl shadow-2xl relative border overflow-hidden ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}
          >
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-pink-500 to-purple-500"></div>

             <div className="mb-8">
               <h2 className={`text-3xl font-serif mb-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>New Assignment</h2>
               <p className={`text-sm ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Configure the parameters for your new piece.</p>
             </div>
             
             <div className="space-y-6">
                <div>
                   <label className={`block text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>Primary Section</label>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {kenyanCategories.map((cat, i) => (
                        <button 
                          key={i} 
                          onClick={() => setCategory(cat)}
                          className={`px-4 py-2 rounded-md border text-xs font-medium transition-colors ${isDark ? 'border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-200' : 'border-stone-300 text-stone-600 hover:border-stone-400 hover:text-stone-900'}`}
                        >
                           {cat}
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             <div className="mt-10 flex justify-end">
                <button 
                  onClick={() => setShow(false)}
                  className={`px-8 py-3 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-primary/20`}
                >
                  Create Draft
                </button>
             </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
