'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';

const JobOpening = ({ title, department, location, isDark }: { title: string; department: string; location: string; isDark: boolean }) => (
    <motion.div
        whileHover={{
            boxShadow: isDark
                ? "0 0 0 1px hsl(var(--border))"
                : "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
            y: -4,
        }}
        className={`group p-6 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${isDark ? 'border-stone-800 hover:border-stone-700' : 'border-stone-200 hover:border-stone-300'}`}
    >
        <div>
            <h3 className={`font-serif text-xl mb-1 ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>{title}</h3>
            <div className="flex items-center space-x-4 text-xs font-medium">
                <span className={isDark ? 'text-stone-400' : 'text-stone-500'}>{department}</span>
                <span className="flex items-center space-x-1.5 text-stone-500">
                    <MapPin size={12} />
                    <span>{location}</span>
                </span>
            </div>
        </div>
        <ArrowRight size={20} className={`transform transition-transform duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`} />
    </motion.div>
);

export default function CareersPageClient() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    const jobOpenings = [
        { title: 'Senior Backend Engineer', department: 'Engineering', location: 'Remote (Global)' },
        { title: 'Investigative Journalist', department: 'Editorial', location: 'Nairobi, Kenya' },
        { title: 'Product Designer (UI/UX)', department: 'Design', location: 'Remote (EMEA)' },
        { title: 'Head of Growth Marketing', department: 'Marketing', location: 'London, UK' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`min-h-screen pt-32 pb-20 ${isDark ? 'bg-stone-900' : 'bg-stone-50'}`}
        >
            <div className="max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <h1 className={`font-serif text-5xl md:text-7xl mb-4 ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>Join The Chronicle</h1>
                    <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                        We are a team of passionate journalists, engineers, and creators dedicated to building the future of intelligent journalism. If you thrive on challenge and believe in our mission, we want to hear from you.
                    </p>
                </motion.div>

                <div>
                    <h2 className={`font-serif text-3xl mb-8 border-b pb-4 ${isDark ? 'text-stone-200 border-stone-800' : 'text-stone-800 border-stone-200'}`}>
                        Current Openings
                    </h2>
                    <div className="space-y-4">
                        {jobOpenings.map((job, i) => (
                            <JobOpening key={i} {...job} isDark={isDark} />
                        ))}
                    </div>
                </div>

                <div className={`mt-20 p-8 rounded-2xl text-center border ${isDark ? 'bg-black/20 border-stone-800' : 'bg-white border-stone-200'}`}>
                    <h3 className={`font-serif text-2xl mb-2 ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>Don't see your role?</h3>
                    <p className={`text-sm mb-6 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>We're always looking for talented people. Send us your resume.</p>
                    <button className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide uppercase transition-colors
                        ${isDark ? 'bg-stone-800 text-stone-200 hover:bg-stone-700' : 'bg-stone-100 text-stone-800 hover:bg-stone-200'}`}>
                        Contact Us
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
