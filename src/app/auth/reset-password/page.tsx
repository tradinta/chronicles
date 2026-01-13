
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PasswordResetPage = () => {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${isDark ? 'bg-[#121212]' : 'bg-stone-50'}`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md p-8 md:p-12 rounded-2xl border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}
      >
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                <Check size={32} />
              </div>
              <h2 className={`font-serif text-2xl mb-2 ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>Check Your Inbox</h2>
              <p className={`text-sm ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                If an account exists for <span className="font-semibold">{email}</span>, you will receive an email with instructions on how to reset your password.
              </p>
              <button
                onClick={() => router.push('/auth')}
                className={`mt-8 flex items-center justify-center w-full space-x-2 text-sm font-medium transition-colors ${isDark ? 'text-stone-400 hover:text-white' : 'text-stone-500 hover:text-black'}`}
              >
                <ArrowLeft size={16} />
                <span>Back to Sign In</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center mb-8">
                <h2 className={`font-serif text-3xl mb-2 ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>Forgot Password?</h2>
                <p className={`text-sm ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                  No problem. Enter your email address below and we'll send you a link to reset it.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 group">
                  <label className={`text-xs font-bold uppercase tracking-widest transition-colors ${isDark ? 'text-stone-500 group-focus-within:text-stone-300' : 'text-stone-500 group-focus-within:text-stone-700'}`}>Email Address</label>
                  <div className={`relative flex items-center border-b transition-colors ${isDark ? 'border-stone-700 focus-within:border-primary' : 'border-stone-300 focus-within:border-primary'}`}>
                    <Mail size={18} className={`mr-3 ${isDark ? 'text-stone-600' : 'text-stone-400'}`} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={`w-full bg-transparent py-3 outline-none text-sm ${isDark ? 'text-stone-200 placeholder:text-stone-700' : 'text-stone-800 placeholder:text-stone-400'}`}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className={`w-full py-3 rounded-lg text-sm font-bold tracking-widest uppercase transition-all transform active:scale-95 ${isDark ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                >
                  Send Reset Link
                </button>
              </form>

              <button
                onClick={() => router.push('/auth')}
                className={`mt-8 flex items-center justify-center w-full space-x-2 text-sm font-medium transition-colors ${isDark ? 'text-stone-400 hover:text-white' : 'text-stone-500 hover:text-black'}`}
              >
                <ArrowLeft size={16} />
                <span>Back to Sign In</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PasswordResetPage;
