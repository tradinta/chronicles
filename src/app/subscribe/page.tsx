
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, Star, Crown, Coffee,
  Sparkles, ShieldCheck, HelpCircle, ChevronDown, CreditCard,
  Lock, Zap, EyeOff, RefreshCw, Shield, Quote,
} from 'lucide-react';
import Navbar from '@/components/shared/navbar';
import type { View } from '@/app/page';

// Reusable FAQ Accordion Item
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  return (
    <div className={`border-b transition-colors ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left focus:outline-none"
      >
        <span className={`text-lg font-serif ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>{question}</span>
        <ChevronDown 
          size={20} 
          className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'} ${isDark ? 'text-stone-500' : 'text-stone-400'}`} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className={`pb-6 text-sm leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Testimonial Card
const TestimonialCard = ({ quote, author, role, isDark }) => (
  <div className={`p-8 rounded-xl border relative ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-sm'}`}>
    <Quote size={32} className={`absolute top-6 left-6 opacity-20 ${isDark ? 'text-stone-100' : 'text-stone-900'}`} />
    <p className={`relative z-10 text-lg font-serif italic mb-6 leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>"{quote}"</p>
    <div className="flex items-center space-x-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${isDark ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-600'}`}>
        {author.charAt(0)}
      </div>
      <div>
        <p className={`text-sm font-bold ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>{author}</p>
        <p className={`text-xs ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>{role}</p>
      </div>
    </div>
  </div>
);

// Feature Item for Top Section
const FeatureItem = ({ icon: Icon, title, desc, isDark }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`p-6 rounded-xl flex flex-col items-center text-center transition-all ${isDark ? 'hover:bg-stone-900' : 'hover:bg-stone-50'}`}
  >
    <div className={`mb-4 p-3 rounded-full ${isDark ? 'bg-stone-800 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
      <Icon size={24} strokeWidth={1.5} />
    </div>
    <h3 className={`font-bold mb-2 ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>{title}</h3>
    <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>{desc}</p>
  </motion.div>
);

type PricingCardProps = {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  planType: 'explorer' | 'insider' | 'vip';
  isDark: boolean;
  icon: React.ElementType;
  onViewChange: (view: View) => void;
};

const PricingCard = ({ 
  title, price, period, description, features, planType, isDark, icon: Icon, onViewChange
}: PricingCardProps) => {
  const getStyles = () => {
    switch (planType) {
      case 'explorer':
        return {
          wrapper: isDark ? 'bg-stone-900/50 border-stone-800' : 'bg-green-50/50 border-green-100',
          accent: 'text-green-600',
          badge: null,
          btn: isDark ? 'bg-stone-800 hover:bg-stone-700 text-stone-300' : 'bg-green-100 hover:bg-green-200 text-green-800'
        };
      case 'insider':
        return {
          wrapper: isDark ? 'bg-stone-800 border-green-900/50 shadow-2xl shadow-green-900/20 scale-105 z-10' : 'bg-white border-green-200 shadow-xl shadow-green-100 scale-105 z-10',
          accent: 'text-green-600',
          badge: 'Most Popular',
          btn: 'bg-green-700 hover:bg-green-800 text-white shadow-lg'
        };
      case 'vip':
        return {
          wrapper: isDark ? 'bg-[#0f0f0f] border-yellow-900/30' : 'bg-stone-900 text-stone-100 border-stone-800',
          accent: 'text-yellow-500',
          badge: 'Premium',
          btn: 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white shadow-lg'
        };
      default: return {};
    }
  };

  const styles = getStyles();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-500 ${styles.wrapper}`}
    >
      {styles.badge && (
        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-lg
          ${planType === 'vip' ? 'bg-yellow-600 text-white' : 'bg-green-600 text-white'}`}>
          {styles.badge}
        </div>
      )}

      <div className="mb-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 
          ${planType === 'vip' ? 'bg-yellow-500/20 text-yellow-500' : (isDark ? 'bg-stone-800 text-stone-400' : 'bg-white shadow-sm text-green-700')}`}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <h3 className={`font-serif text-2xl font-bold mb-2 ${planType === 'vip' && !isDark ? 'text-white' : (isDark ? 'text-stone-100' : 'text-stone-900')}`}>{title}</h3>
        <p className={`text-sm leading-relaxed min-h-[40px] opacity-80`}>{description}</p>
      </div>

      <div className="mb-8 flex items-baseline">
        <span className={`text-xs font-bold mr-1 opacity-60`}>KES</span>
        <span className={`text-4xl font-serif font-bold ${planType === 'vip' && !isDark ? 'text-white' : (isDark ? 'text-stone-100' : 'text-stone-900')}`}>{price}</span>
        <span className={`text-sm ml-1 opacity-60`}>/{period}</span>
      </div>

      <div className="flex-1 space-y-4 mb-8">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start space-x-3">
            <Check size={16} className={`mt-0.5 ${planType === 'vip' ? 'text-yellow-500' : 'text-green-600'}`} />
            <span className={`text-sm opacity-90`}>{feature}</span>
          </div>
        ))}
      </div>

      <button onClick={() => onViewChange('checkout')} className={`w-full py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-300 ${styles.btn}`}>
        {planType === 'explorer' ? 'Start Exploring' : planType === 'insider' ? 'Become an Insider' : 'Unlock VIP'}
      </button>
      
      <p className="text-[10px] text-center mt-4 opacity-50">Billed in KES. Cancel anytime.</p>
    </motion.div>
  );
};

type SubscribePageProps = {
  onViewChange: (view: View) => void;
};

export default function SubscribePage({ onViewChange }: SubscribePageProps) {
    const [isDark, setIsDark] = useState(false);
    const [billingCycle, setBillingCycle] = useState('monthly'); 

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDark(savedTheme === 'dark');
        } else {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDark(prefersDark);
        }
    }, []);

    const prices = {
      explorer: billingCycle === 'monthly' ? "650" : "550",
      insider: billingCycle === 'monthly' ? "1,500" : "1,275",
      vip: billingCycle === 'monthly' ? "3,200" : "2,720"
    };
  
    const period = billingCycle === 'monthly' ? "mo" : "mo*";

  return (
    <div className={`min-h-screen pt-20 ${isDark ? 'bg-[#121212]' : 'bg-[#FDFBF7]'}`}>
      {/* 1. HERO SECTION */}
      <section className="relative px-6 md:px-12 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
           {/* Text Content */}
           <div className="relative z-10">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                className={`font-serif text-5xl md:text-7xl mb-6 leading-tight ${isDark ? 'text-stone-100' : 'text-stone-900'}`}
              >
                Unlock Full Access <br/> to <span className="text-orange-600 italic">Insight.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }}
                className={`text-lg font-light leading-relaxed mb-8 max-w-md ${isDark ? 'text-stone-400' : 'text-stone-600'}`}
              >
                Choose the plan that fits your curiosity. From breaking news to off-the-record gossip, get the full story anywhere, anytime.
              </motion.p>
              
              <div className="flex items-center space-x-4">
                 <button onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })} className={`px-8 py-3 rounded-full text-sm font-bold tracking-wide uppercase text-white shadow-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 transition-colors`}>
                    Get Started
                 </button>
                 <button className={`px-6 py-3 rounded-full text-sm font-bold tracking-wide uppercase transition-colors ${isDark ? 'text-stone-400 hover:text-stone-200' : 'text-stone-600 hover:text-stone-900'}`}>
                    See Features
                 </button>
              </div>
           </div>

           {/* Animated Illustration Placeholder */}
           <motion.div 
             initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}
             className="relative h-[400px] hidden lg:block"
           >
              {/* Abstract Floating Cards Composition */}
              <div className={`absolute top-10 right-10 w-64 h-80 rounded-xl border shadow-2xl rotate-6 z-10 ${isDark ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
                 <div className="p-6 space-y-4">
                    <div className="h-2 w-1/3 bg-orange-500 rounded"></div>
                    <div className="h-4 w-3/4 bg-stone-300 dark:bg-stone-600 rounded"></div>
                    <div className="space-y-2">
                       <div className="h-2 w-full bg-stone-200 dark:bg-stone-700 rounded"></div>
                       <div className="h-2 w-5/6 bg-stone-200 dark:bg-stone-700 rounded"></div>
                    </div>
                 </div>
              </div>
              <div className={`absolute top-20 right-40 w-64 h-80 rounded-xl border shadow-xl -rotate-3 z-0 opacity-60 ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-50 border-stone-200'}`}></div>
           </motion.div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section className={`py-16 border-y ${isDark ? 'bg-stone-900/30 border-stone-800' : 'bg-white border-stone-200'}`}>
         <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
               <FeatureItem icon={Lock} title="Exclusive Access" desc="Unlock deep dives & analysis" isDark={isDark} />
               <FeatureItem icon={Zap} title="Breaking Alerts" desc="Real-time notifications" isDark={isDark} />
               <FeatureItem icon={EyeOff} title="Off the Record" desc="Gossip & anonymous tips" isDark={isDark} />
               <FeatureItem icon={Sparkles} title="Curated Feed" desc="Personalized for you" isDark={isDark} />
               <FeatureItem icon={ShieldCheck} title="Ad-Free" desc="Pure reading experience" isDark={isDark} />
            </div>
         </div>
      </section>

      {/* 3. PLANS SECTION */}
      <section id="plans" className="py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
           
           <div className="text-center mb-16">
              <h2 className={`font-serif text-4xl mb-6 ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>Choose Your Level</h2>
              
              {/* Toggle */}
              <div className="flex items-center justify-center space-x-4">
                <span className={`text-xs font-bold uppercase tracking-widest ${billingCycle === 'monthly' ? (isDark ? 'text-white' : 'text-black') : 'text-stone-500'}`}>Monthly</span>
                <button 
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${isDark ? 'bg-stone-800' : 'bg-stone-200'}`}
                >
                  <motion.div 
                    className="w-6 h-6 rounded-full bg-white shadow-md"
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    style={{ x: billingCycle === 'annual' ? 24 : 0 }}
                  />
                </button>
                <span className={`text-xs font-bold uppercase tracking-widest ${billingCycle === 'annual' ? (isDark ? 'text-white' : 'text-black') : 'text-stone-500'}`}>
                  Annual <span className="text-green-600 ml-1">(-15%)</span>
                </span>
              </div>
              {billingCycle === 'annual' && <p className="text-[10px] text-stone-500 mt-2">*Billed annually as a one-time payment.</p>}
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              
              <PricingCard 
                planType="explorer"
                title="Explorer"
                price={prices.explorer}
                period={period}
                description="Essential access to daily news and curated briefs."
                features={["Standard news articles", "Weekly Newsletter", "5 Off-Record stories/mo", "Comment access"]}
                icon={Coffee}
                isDark={isDark}
                onViewChange={onViewChange}
              />

              <PricingCard 
                planType="insider"
                title="Insider"
                price={prices.insider}
                period={period}
                description="The complete experience. Deepen your understanding."
                features={["Unlimited News Access", "Full Off-Record Access", "Daily Newsletter", "Ad-Free Experience", "Offline Reading"]}
                icon={Star}
                isDark={isDark}
                onViewChange={onViewChange}
              />

              <PricingCard 
                planType="vip"
                title="VIP Access"
                price={prices.vip}
                period={period}
                description="Shape the conversation. For the true patron."
                features={["Everything in Insider", "Priority Tip Submission", "Direct Editor Access", "Exclusive Events", "Family Account (4)"]}
                icon={Crown}
                isDark={isDark}
                onViewChange={onViewChange}
              />

           </div>
           
           <div className="mt-12 text-center flex items-center justify-center space-x-6 text-xs text-stone-500">
              <span className="flex items-center"><Shield size={12} className="mr-1"/> Secure Payment</span>
              <span className="flex items-center"><RefreshCw size={12} className="mr-1"/> Cancel Anytime</span>
              <span className="flex items-center"><CreditCard size={12} className="mr-1"/> All Cards Accepted</span>
           </div>
        </div>
      </section>

      {/* 4. TESTIMONIALS */}
      <section className={`py-20 border-t ${isDark ? 'bg-[#0f0f0f] border-stone-800' : 'bg-[#F2F0EB] border-stone-200'}`}>
         <div className="max-w-6xl mx-auto px-6">
            <h2 className={`font-serif text-3xl text-center mb-12 ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>Read by the Informed</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <TestimonialCard quote="The only news source I trust. The Off the Record section is addictive." author="Sarah M." role="Creative Director" isDark={isDark} />
               <TestimonialCard quote="Finally, a platform that respects my intelligence and my time." author="David K." role="Tech Entrepreneur" isDark={isDark} />
               <TestimonialCard quote="The analysis pieces are worth the subscription alone." author="Elena R." role="Policy Analyst" isDark={isDark} />
            </div>
         </div>
      </section>

      {/* 5. FAQ */}
      <section className="py-20 px-6 max-w-3xl mx-auto">
         <h2 className={`font-serif text-3xl text-center mb-12 ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>Frequently Asked Questions</h2>
         <div className="space-y-2">
            <FAQItem question="Can I cancel my subscription anytime?" answer="Yes, you can cancel directly from your profile settings. You'll retain access until the end of your billing period." />
            <FAQItem question="Is the Off the Record section verified?" answer="Off the Record contains unverified tips and rumors. While we vet sources, this content is speculative by nature." />
            <FAQItem question="What payment methods do you accept?" answer="We accept M-Pesa, Visa, Mastercard, and PayPal. All transactions are processed securely in KES." />
            <FAQItem question="Can I upgrade my plan later?" answer="Absolutely. You can upgrade from Explorer to Insider or VIP at any time, and we'll prorate the difference." />
         </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className={`py-24 text-center border-t ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
         <h2 className={`font-serif text-4xl mb-6 ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>Ready to Unlock the Full Story?</h2>
         <p className={`text-sm mb-8 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Join thousands of subscribers today.</p>
         <button 
           onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
           className="px-10 py-4 rounded-full text-sm font-bold tracking-widest uppercase bg-orange-600 text-white hover:bg-orange-700 shadow-xl transition-all hover:scale-105"
         >
            Choose Your Plan
         </button>
      </section>
    </div>
  );
}
