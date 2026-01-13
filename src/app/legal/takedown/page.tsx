
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileWarning, Send } from 'lucide-react';

const TakedownRequestPage = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`min-h-screen pt-32 pb-20 ${isDark ? 'bg-stone-900' : 'bg-stone-50'}`}
        >
            <div className="max-w-2xl mx-auto px-6">
                <div className="text-center mb-12">
                     <FileWarning size={40} className={`mx-auto mb-4 ${isDark ? 'text-primary' : 'text-primary'}`} />
                    <h1 className={`font-serif text-4xl md:text-5xl mb-4 ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>Takedown Request</h1>
                    <p className={`text-md max-w-2xl mx-auto ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                        If you believe that content on The Chronicle infringes on your copyright or violates other laws, please use this form to submit a takedown request. All submissions are reviewed by our legal team.
                    </p>
                </div>
                
                <form className="space-y-6">
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Your Full Name</label>
                        <input type="text" required className={`w-full p-3 rounded-md border bg-transparent outline-none transition-colors ${isDark ? 'border-stone-700 bg-stone-950 focus:border-primary' : 'border-stone-300 bg-white focus:border-primary'}`} />
                    </div>
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Your Email Address</label>
                        <input type="email" required className={`w-full p-3 rounded-md border bg-transparent outline-none transition-colors ${isDark ? 'border-stone-700 bg-stone-950 focus:border-primary' : 'border-stone-300 bg-white focus:border-primary'}`} />
                    </div>
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>URL of Infringing Content</label>
                        <input type="url" required className={`w-full p-3 rounded-md border bg-transparent outline-none transition-colors ${isDark ? 'border-stone-700 bg-stone-950 focus:border-primary' : 'border-stone-300 bg-white focus:border-primary'}`} />
                    </div>
                     <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Reason for Takedown</label>
                        <textarea rows={5} required className={`w-full p-3 rounded-md border bg-transparent outline-none transition-colors ${isDark ? 'border-stone-700 bg-stone-950 focus:border-primary' : 'border-stone-300 bg-white focus:border-primary'}`} placeholder="Please provide a detailed description of the infringement..."></textarea>
                    </div>

                    <div className="flex items-start space-x-3">
                        <input type="checkbox" id="declaration" required className={`mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary ${isDark ? 'bg-stone-800 border-stone-600' : 'bg-stone-100'}`} />
                        <label htmlFor="declaration" className={`text-sm ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                            I declare under penalty of perjury that the information in this notification is accurate and that I am the copyright owner or am authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.
                        </label>
                    </div>

                     <button type="submit" className={`w-full py-4 rounded-lg text-sm font-bold tracking-widest uppercase transition-all transform active:scale-95 flex items-center justify-center space-x-2 ${isDark ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}>
                        <Send size={16} />
                        <span>Submit Request</span>
                    </button>
                </form>
            </div>
        </motion.div>
    );
}

export default TakedownRequestPage;
