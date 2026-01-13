
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


const PrivacyPolicyPage = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    return (
        <LegalPageLayout title="Privacy Policy" isDark={isDark}>
            <h2>1. Introduction</h2>
            <p>Welcome to Kihumba. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.</p>
            
            <h2>2. Information We Collect</h2>
            <p>We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and Services, when you participate in activities on the website or otherwise when you contact us.</p>
            <p>The personal information that we collect depends on the context of your interactions with us and the website, the choices you make and the products and features you use. The personal information we collect may include the following: name, email address, and contact data.</p>
            
            <h2>3. How We Use Your Information</h2>
            <p>We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
            
            <h2>4. Will Your Information Be Shared?</h2>
            <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>

            <h2>5. How Long Do We Keep Your Information?</h2>
            <p>We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.</p>
        </LegalPageLayout>
    );
};

export default PrivacyPolicyPage;
