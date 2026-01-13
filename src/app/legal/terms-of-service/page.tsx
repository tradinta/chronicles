
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LegalPageLayout = ({ title, children, isDark }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`min-h-screen pt-32 pb-20 ${isDark ? 'bg-stone-900' : 'bg-stone-50'}`}
    >
        <div className={`max-w-3xl mx-auto px-6 prose ${isDark ? 'prose-invert' : ''} prose-h1:font-serif prose-h1:text-4xl prose-h2:font-serif`}>
            <h1 className={`${isDark ? 'text-stone-100' : 'text-stone-900'}`}>{title}</h1>
            <p className={`text-sm ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>Last updated: October 14, 2024</p>
            <div className={`mt-8 ${isDark ? 'text-stone-400' : 'text-stone-700'}`}>
                {children}
            </div>
        </div>
    </motion.div>
);

const TermsOfServicePage = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    return (
        <LegalPageLayout title="Terms of Service" isDark={isDark}>
            <h2>1. Agreement to Terms</h2>
            <p>By using our services, you agree to be bound by these Terms. If you don’t agree to be bound by these Terms, do not use the Services.</p>
            
            <h2>2. Your Content</h2>
            <p>You retain your rights to any content you submit, post or display on or through the Services. By submitting, posting or displaying content on or through the Services, you grant us a worldwide, non-exclusive, royalty-free license (with the right to sublicense) to use, copy, reproduce, process, adapt, modify, publish, transmit, display and distribute such content in any and all media or distribution methods now known or later developed.</p>
            
            <h2>3. User Conduct</h2>
            <p>You agree not to misuse the Services or help anyone else to do so. For example, you must not even try to do any of the following in connection with the Services: probe, scan, or test the vulnerability of any system or network; breach or otherwise circumvent any security or authentication measures; access, tamper with, or use non-public areas of the Service.</p>
            
            <h2>4. Termination</h2>
            <p>We may terminate or suspend your access to and use of the Services, at our sole discretion, at any time and without notice to you.</p>
        </LegalPageLayout>
    );
};

export default TermsOfServicePage;
