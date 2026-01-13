
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Lock,
  ArrowLeft,
  CreditCard,
  User,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { useUser } from '@/firebase';
import Link from 'next/link';

const CheckoutPage = () => {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const { user, isUserLoading } = useUser();
  
  // This effect ensures the component re-renders with the correct theme class.
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-stone-900' : 'bg-stone-50'}`}>
      {/* Minimal Header */}
      <header className={`py-4 px-6 md:px-12 border-b ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 onClick={() => router.push('/')} className={`font-serif text-2xl tracking-tighter font-bold cursor-pointer ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
            The Chronicle<span className="text-orange-600">.</span>
          </h1>
          <div className={`flex items-center space-x-2 text-xs font-medium ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
            <Lock size={14} />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>
      
      <main className="px-6 md:px-12 py-12 md:py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Left Column: Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 order-2 lg:order-1"
          >
            <button onClick={() => router.push('/subscribe')} className={`flex items-center space-x-2 text-sm mb-8 transition-colors ${isDark ? 'text-stone-400 hover:text-white' : 'text-stone-500 hover:text-black'}`}>
              <ArrowLeft size={16} />
              <span>Back to Plans</span>
            </button>
            <div className={`p-8 rounded-2xl border ${isDark ? 'bg-black/20 border-stone-800' : 'bg-white border-stone-200'}`}>
              <h2 className={`font-serif text-2xl mb-6 pb-6 border-b ${isDark ? 'text-stone-100 border-stone-800' : 'text-stone-900 border-stone-200'}`}>Order Summary</h2>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'}`}>Insider Plan (Annual)</p>
                  <p className={`font-medium ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>KES 15,300</p>
                </div>
                <div className="flex justify-between items-center text-green-600">
                  <p>Annual Discount (-15%)</p>
                  <p className="font-medium">- KES 2,700</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className={`${isDark ? 'text-stone-300' : 'text-stone-600'}`}>VAT (16%)</p>
                  <p className={`font-medium ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>KES 2,448</p>
                </div>
              </div>

              <div className="my-6 h-[1px] bg-gradient-to-r from-transparent via-stone-200 dark:via-stone-800 to-transparent"></div>

              <div className="flex justify-between items-center text-lg font-bold">
                <p className={`${isDark ? 'text-stone-100' : 'text-stone-900'}`}>Total Due Today</p>
                <p className="text-orange-600">KES 15,048</p>
              </div>

              <div className={`mt-8 pt-6 border-t ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">Your Membership Includes:</h3>
                <ul className="space-y-3 text-sm">
                  {["Unlimited News & Off-Record", "Ad-Free Experience", "Daily Newsletter"].map(feature => (
                    <li key={feature} className={`flex items-center space-x-3 ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                      <CheckCircle2 size={16} className="text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-center text-xs text-stone-500 mt-8">Your subscription will auto-renew annually. You can cancel anytime from your profile.</p>
            </div>
          </motion.div>

          {/* Right Column: Payment Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-7 order-1 lg:order-2"
          >
            <h2 className={`font-serif text-3xl md:text-4xl mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Complete Your Purchase</h2>
            <p className={`mb-8 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Your premium reading experience is just a click away.</p>
            
            <div className="space-y-6">
              {/* Account Info */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>Account Information</label>
                <div className={`p-4 rounded-lg flex items-center space-x-4 border ${isDark ? 'bg-black/20 border-stone-800' : 'bg-white border-stone-200'}`}>
                  <img src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} alt="Profile" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className={`font-semibold ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>
                      {user?.displayName || 'Anonymous User'} 
                      <Link href="/profile"><span className="text-xs opacity-50 hover:underline ml-2">(Not you?)</span></Link>
                    </p>
                    <p className={`text-sm ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>Payment Details</label>
                <div className={`p-6 rounded-lg space-y-4 border ${isDark ? 'bg-black/20 border-stone-800' : 'bg-white border-stone-200'}`}>
                  <div className={`relative flex items-center border rounded-md transition-colors ${isDark ? 'border-stone-700 bg-stone-900 focus-within:border-orange-500' : 'border-stone-300 bg-white focus-within:border-orange-500'}`}>
                    <CreditCard size={18} className={`absolute left-3 ${isDark ? 'text-stone-500' : 'text-stone-400'}`} />
                    <input placeholder="Card Number" className="pl-10 w-full bg-transparent p-3 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="MM / YY" className={`w-full p-3 rounded-md border bg-transparent outline-none transition-colors ${isDark ? 'border-stone-700 bg-stone-900 focus:border-orange-500' : 'border-stone-300 bg-white focus:border-orange-500'}`} />
                    <input placeholder="CVC" className={`w-full p-3 rounded-md border bg-transparent outline-none transition-colors ${isDark ? 'border-stone-700 bg-stone-900 focus:border-orange-500' : 'border-stone-300 bg-white focus:border-orange-500'}`} />
                  </div>
                </div>
              </div>
              
              {/* CTA Button */}
              <button className="w-full text-center py-4 rounded-lg bg-orange-600 text-white font-bold tracking-widest uppercase text-sm shadow-lg shadow-orange-500/20 hover:bg-orange-700 transition-all duration-300 transform hover:scale-[1.02]">
                Subscribe & Pay KES 15,048
              </button>

              <p className="text-center text-xs text-stone-500 px-8">By clicking "Subscribe & Pay", you agree to our Terms of Service and authorize this payment. Your subscription will auto-renew.</p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
