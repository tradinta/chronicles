
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  Mail, 
  User,
  Eye,
  EyeOff,
  Github,
  Twitter,
  Check
} from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { initiateEmailSignUp, initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';

const AuthInput = ({ label, type, placeholder, icon: Icon, isDark, value, onChange, showPasswordToggle }) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-2 group">
      <label className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-stone-500 group-focus-within:text-stone-300' : 'text-stone-500 group-focus-within:text-stone-700'} transition-colors`}>{label}</label>
      <div className={`relative flex items-center border-b transition-colors ${isDark ? 'border-stone-700 focus-within:border-stone-400' : 'border-stone-300 focus-within:border-stone-800'}`}>
        <Icon size={18} className={`mr-3 ${isDark ? 'text-stone-600' : 'text-stone-400'}`} />
        <input 
          type={inputType} 
          placeholder={placeholder} 
          className={`w-full bg-transparent py-3 outline-none text-sm ${isDark ? 'text-stone-200 placeholder-stone-700' : 'text-stone-800 placeholder-stone-400'}`}
          value={value}
          onChange={onChange}
          required
        />
        {showPasswordToggle && (
          <button type="button" onClick={() => setShowPassword(!showPassword)} className={`${isDark ? 'text-stone-600 hover:text-stone-300' : 'text-stone-400 hover:text-stone-600'}`}>
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

const SocialButton = ({ icon: Icon, label, isDark }) => (
  <button type="button" className={`flex items-center justify-center space-x-2 py-3 rounded-lg border transition-all hover:scale-105
    ${isDark ? 'border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-300' : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-600'}`}>
    <Icon size={18} />
    <span className="text-xs font-bold">{label}</span>
  </button>
);

const AuthPage = () => {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const [isDark, setIsDark] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);
  
  useEffect(() => {
    if (!isUserLoading && user) {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push('/'); // Redirect after success
      }, 1500);
    }
  }, [user, isUserLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);

    try {
      if (authMode === 'signup') {
        await initiateEmailSignUp(auth, email, password);
        // The useEffect above will handle the redirect on successful user state change
      } else {
        await initiateEmailSignIn(auth, email, password);
      }
    } catch (error: any) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-[#121212]' : 'bg-[#FDFBF7]'}`}>
      
      {/* LEFT PANEL: VISUAL STORYTELLING (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-stone-900 items-center justify-center">
         <div className="absolute inset-0 bg-gradient-to-br from-stone-900 to-black z-0" />
         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
           className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 z-0 pointer-events-none"
         />
         
         <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}
            className="relative z-10 text-center px-12"
         >
            <div className="mb-8 relative inline-block">
               <motion.div 
                 animate={{ y: [0, -15, 0] }}
                 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute -top-16 -right-16 w-32 h-40 bg-orange-600/20 backdrop-blur-md rounded-lg border border-orange-500/30 rotate-12"
               />
               <motion.div 
                 animate={{ y: [0, 10, 0] }}
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute -bottom-10 -left-16 w-24 h-32 bg-stone-700/30 backdrop-blur-md rounded-lg border border-stone-600/30 -rotate-6"
               />
               <h1 className="text-6xl font-serif text-white font-bold relative z-10">The Future <br/> of News.</h1>
            </div>
            <p className="text-stone-400 text-lg max-w-md mx-auto leading-relaxed">Join a community of critical thinkers. Dive into breaking stories, exclusive gossip, and in-depth analysis.</p>
         </motion.div>
      </div>

      {/* RIGHT PANEL: INTERACTIVE FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative pt-20 lg:pt-12">
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
           className={`w-full max-w-md relative z-10`}
         >
            <div className="text-center mb-10">
               <h2 className={`font-serif text-3xl md:text-4xl mb-2 ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                 {authMode === 'login' ? 'Welcome Back' : 'Join The Chronicle'}
               </h2>
               <p className={`text-sm ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>
                 {authMode === 'login' ? 'Enter your credentials to access your account.' : 'Create an account to start your journey.'}
               </p>
            </div>

            <div className={`flex mb-8 border-b relative ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
               {['login', 'signup'].map(mode => (
                 <button 
                   key={mode}
                   onClick={() => setAuthMode(mode)}
                   className={`flex-1 pb-4 text-sm font-bold uppercase tracking-widest relative transition-colors
                     ${authMode === mode 
                       ? (isDark ? 'text-white' : 'text-black') 
                       : (isDark ? 'text-stone-600 hover:text-stone-400' : 'text-stone-400 hover:text-stone-600')}`}
                 >
                   {mode === 'login' ? 'Log In' : 'Sign Up'}
                   {authMode === mode && (
                     <motion.div 
                       layoutId="authTab"
                       className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDark ? 'bg-white' : 'bg-black'}`}
                     />
                   )}
                 </button>
               ))}
            </div>

            <AnimatePresence mode="wait">
               {success ? (
                 <motion.div 
                   key="success"
                   initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                   className="flex flex-col items-center justify-center py-12"
                 >
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/30">
                       <Check size={40} className="text-white" />
                    </div>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-stone-900'}`}>Welcome Aboard!</h3>
                    <p className={`text-sm mt-2 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Redirecting... </p>
                 </motion.div>
               ) : (
                 <motion.form 
                   key={authMode}
                   initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                   className="space-y-6"
                   onSubmit={handleSubmit}
                 >
                    {authMode === 'signup' && (
                      <AuthInput label="Full Name" type="text" placeholder="Jane Doe" icon={User} isDark={isDark} showPasswordToggle={false} value={fullName} onChange={e => setFullName(e.target.value)} />
                    )}
                    
                    <AuthInput label="Email Address" type="email" placeholder="jane@example.com" icon={Mail} isDark={isDark} showPasswordToggle={false} value={email} onChange={e => setEmail(e.target.value)} />
                    
                    <div className="space-y-4">
                       <AuthInput label="Password" type="password" placeholder="••••••••" icon={Lock} isDark={isDark} showPasswordToggle value={password} onChange={e => setPassword(e.target.value)} />
                       {authMode === 'signup' && (
                         <div className="flex gap-1 h-1 mt-2">
                            <div className="flex-1 bg-red-500 rounded-full opacity-50"></div>
                            <div className="flex-1 bg-yellow-500 rounded-full opacity-20"></div>
                            <div className="flex-1 bg-green-500 rounded-full opacity-20"></div>
                         </div>
                       )}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                       <label className={`flex items-center space-x-2 cursor-pointer ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                          <input type="checkbox" className="rounded border-stone-600 bg-transparent" />
                          <span>Remember me</span>
                       </label>
                       {authMode === 'login' && (
                         <a href="#" onClick={() => router.push('/auth/reset-password')} className="font-bold hover:underline">Forgot Password?</a>
                       )}
                    </div>

                    <button 
                      type="submit"
                      disabled={loading || isUserLoading}
                      className={`w-full py-4 rounded-lg text-sm font-bold tracking-widest uppercase transition-all transform active:scale-95
                        ${isDark 
                          ? 'bg-white text-black hover:bg-stone-200' 
                          : 'bg-black text-white hover:bg-stone-800'}
                        ${loading || isUserLoading ? 'opacity-70 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'}
                      `}
                    >
                      {loading || isUserLoading ? 'Processing...' : (authMode === 'login' ? 'Log In' : 'Create Account')}
                    </button>

                    <div className="relative flex items-center justify-center my-8">
                       <div className={`absolute inset-0 flex items-center`}>
                          <div className={`w-full border-t ${isDark ? 'border-stone-800' : 'border-stone-200'}`}></div>
                       </div>
                       <span className={`relative px-4 text-xs uppercase tracking-widest bg-transparent ${isDark ? 'text-stone-600 bg-[#121212]' : 'text-stone-400 bg-[#FDFBF7]'}`}>Or continue with</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <SocialButton icon={Github} label="Github" isDark={isDark} />
                       <SocialButton icon={Twitter} label="Twitter" isDark={isDark} />
                    </div>
                 </motion.form>
               )}
            </AnimatePresence>
         </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;

    