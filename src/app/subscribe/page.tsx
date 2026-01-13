
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Star, Crown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Navbar from '@/components/shared/navbar';

const tiers = [
  {
    name: 'The Observer',
    price: '800',
    description: 'Essential access to daily news and curated briefs.',
    icon: Coffee,
    features: [
      'Unlimited article access',
      'Daily Morning Briefing',
      'Comment section access',
      'Mobile app support',
    ],
    isPopular: false,
    cta: 'Start Observing',
  },
  {
    name: 'The Member',
    price: '1,500',
    description: 'Deepen your understanding with analysis and community.',
    icon: Star,
    features: [
      'Everything in Observer',
      "Exclusive 'Off the Record' tips",
      'Weekly Analysis & Op-Eds',
      'Ad-free reading experience',
      'Offline reading mode',
    ],
    isPopular: true,
    cta: 'Become a Member',
  },
  {
    name: 'The Patron',
    price: '5,000',
    description: 'For those who want to shape the future of journalism.',
    icon: Crown,
    features: [
      'All Member benefits',
      'Quarterly print magazine',
      'Direct access to editors',
      'Exclusive events & webinars',
      'Family account (up to 4)',
    ],
    isPopular: false,
    cta: 'Become a Patron',
  },
];

const PricingCard = ({ tier, isDark }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={cn(
        'relative rounded-xl border p-8 h-full flex flex-col shadow-sm hover:shadow-xl transition-all duration-300',
        isDark ? 'bg-stone-900' : 'bg-white',
        tier.isPopular
          ? 'border-primary/50'
          : isDark
          ? 'border-stone-800'
          : 'border-stone-200'
      )}
    >
      {tier.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
          Most Popular
        </div>
      )}
      <div className="flex-grow">
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center mb-6',
            isDark ? 'bg-stone-800' : 'bg-stone-100',
            tier.isPopular && 'bg-primary/10'
          )}
        >
          <tier.icon
            size={24}
            className={cn(
              isDark ? 'text-stone-400' : 'text-stone-500',
              tier.isPopular && 'text-primary'
            )}
          />
        </div>
        <h3
          className={cn(
            'font-serif text-2xl mb-2',
            isDark ? 'text-stone-100' : 'text-stone-900'
          )}
        >
          {tier.name}
        </h3>
        <p className={cn('text-sm mb-8', isDark ? 'text-stone-400' : 'text-stone-600')}>
          {tier.description}
        </p>

        <div className="mb-8">
          <span
            className={cn(
              'text-4xl font-serif font-bold',
              isDark ? 'text-white' : 'text-black'
            )}
          >
            {tier.price}
          </span>
          <span className="text-sm text-stone-500"> KES /mo</span>
        </div>

        <ul className="space-y-4">
          {tier.features.map((feature, i) => (
            <li key={i} className="flex items-center space-x-3">
              <Check
                size={16}
                className={
                  tier.isPopular ? 'text-primary' : 'text-green-500'
                }
              />
              <span className={cn('text-sm', isDark ? 'text-stone-300' : 'text-stone-700')}>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-10">
        <button
          className={cn(
            'w-full py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors',
            tier.isPopular
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : isDark
              ? 'bg-stone-700 text-stone-200 hover:bg-stone-600'
              : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
          )}
        >
          {tier.cta}
        </button>
      </div>
    </motion.div>
  );
};

export default function SubscribePage() {
    const [isDark, setIsDark] = useState(false);
    const [currentView, setCurrentView] = useState('main');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
        setIsDark(savedTheme === 'dark');
        } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(prefersDark);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', newTheme);
    }


  return (
    <div className={cn("min-h-screen", isDark ? 'bg-black' : 'bg-stone-50')}>
      <Navbar 
          isDark={isDark} 
          toggleTheme={toggleTheme}
          onViewChange={setCurrentView}
          currentView={currentView}
          isFocusMode={false}
      />
      <div className="container mx-auto px-6 py-24 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className={cn('font-serif text-5xl mb-4', isDark ? 'text-white' : 'text-black')}>
            Support Independent Journalism
          </h1>
          <p className={cn('text-lg max-w-2xl mx-auto', isDark ? 'text-stone-400' : 'text-stone-600')}>
            Become a member to get unlimited access and support our mission to deliver
            intelligent, modern journalism.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="w-full"
            >
                <PricingCard tier={tier} isDark={isDark} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
