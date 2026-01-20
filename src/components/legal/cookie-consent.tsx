'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, Check } from 'lucide-react';
import Link from 'next/link';

const CONSENT_STORAGE_KEY = 'chronicle_cookie_consent';

interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
}

export function CookieConsentBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true, // Always required
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
        if (!stored) {
            // Show banner after a short delay for better UX
            setTimeout(() => setIsVisible(true), 2000);
        }
    }, []);

    const handleAcceptAll = () => {
        const allAccepted = { necessary: true, analytics: true, marketing: true };
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(allAccepted));
        setIsVisible(false);
    };

    const handleRejectNonEssential = () => {
        const minimal = { necessary: true, analytics: false, marketing: false };
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(minimal));
        setIsVisible(false);
    };

    const handleSavePreferences = () => {
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preferences));
        setIsVisible(false);
        setShowSettings(false);
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-0 right-0 z-50 p-4"
            >
                <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
                    {!showSettings ? (
                        // Main Banner
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Cookie size={24} className="text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold mb-2">We Value Your Privacy</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
                                        By clicking "Accept All", you consent to our use of cookies.{' '}
                                        <Link href="/legal/privacy-policy" className="text-primary hover:underline">
                                            Learn more
                                        </Link>
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={handleAcceptAll}
                                            className="px-5 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors"
                                        >
                                            Accept All
                                        </button>
                                        <button
                                            onClick={handleRejectNonEssential}
                                            className="px-5 py-2 border border-border rounded-lg font-bold text-sm hover:bg-secondary transition-colors"
                                        >
                                            Essential Only
                                        </button>
                                        <button
                                            onClick={() => setShowSettings(true)}
                                            className="px-5 py-2 text-muted-foreground hover:text-foreground font-bold text-sm transition-colors flex items-center gap-2"
                                        >
                                            <Settings size={16} />
                                            Customize
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="text-muted-foreground hover:text-foreground"
                                    aria-label="Close"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Settings Panel
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold">Cookie Preferences</h3>
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="text-muted-foreground hover:text-foreground"
                                    aria-label="Close settings"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                {/* Necessary */}
                                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                                    <div>
                                        <p className="font-bold text-sm">Necessary Cookies</p>
                                        <p className="text-xs text-muted-foreground">Required for basic site functionality</p>
                                    </div>
                                    <div className="w-10 h-6 bg-primary rounded-full flex items-center justify-end px-1">
                                        <Check size={14} className="text-white" />
                                    </div>
                                </div>

                                {/* Analytics */}
                                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                                    <div>
                                        <p className="font-bold text-sm">Analytics Cookies</p>
                                        <p className="text-xs text-muted-foreground">Help us understand how visitors use our site</p>
                                    </div>
                                    <button
                                        onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                                        className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${preferences.analytics ? 'bg-primary justify-end' : 'bg-muted justify-start'
                                            }`}
                                        aria-label="Toggle analytics cookies"
                                    >
                                        <div className="w-4 h-4 bg-white rounded-full shadow" />
                                    </button>
                                </div>

                                {/* Marketing */}
                                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                                    <div>
                                        <p className="font-bold text-sm">Marketing Cookies</p>
                                        <p className="text-xs text-muted-foreground">Used to deliver personalized advertisements</p>
                                    </div>
                                    <button
                                        onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                                        className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${preferences.marketing ? 'bg-primary justify-end' : 'bg-muted justify-start'
                                            }`}
                                        aria-label="Toggle marketing cookies"
                                    >
                                        <div className="w-4 h-4 bg-white rounded-full shadow" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleSavePreferences}
                                    className="flex-1 px-5 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors"
                                >
                                    Save Preferences
                                </button>
                                <button
                                    onClick={handleAcceptAll}
                                    className="px-5 py-2 border border-border rounded-lg font-bold text-sm hover:bg-secondary transition-colors"
                                >
                                    Accept All
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
