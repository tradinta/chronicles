'use client';

import { motion } from 'framer-motion';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f4f1ea] dark:bg-[#09090b] text-[#1c1c1c] dark:text-[#e4e4e7]">
            <div className="relative flex flex-col items-center">
                {/* Typewriter text effect */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-serif text-4xl md:text-6xl font-black tracking-tighter mb-8"
                >
                    The Chronicle
                </motion.div>

                {/* Printing Press Progress Bar */}
                <div className="w-64 h-1 bg-gray-300 dark:bg-gray-800 rounded-full overflow-hidden relative">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-primary"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                            duration: 1.5,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatType: "mirror"
                        }}
                    />
                </div>

                <motion.p
                    className="mt-4 font-mono text-xs uppercase tracking-widest text-gray-500"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    Printing Today's Edition...
                </motion.p>
            </div>
        </div>
    );
}
