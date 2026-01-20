'use client';

import { motion } from 'framer-motion';
import { Lock, Zap, CreditCard, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PaywallOverlayProps {
    articlesRemaining?: number;
}

export function PaywallOverlay({ articlesRemaining = 0 }: PaywallOverlayProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-gradient-to-t from-background via-background/95 to-transparent flex items-end justify-center pb-20"
        >
            <div className="max-w-lg text-center px-6">
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-card border border-border rounded-2xl p-8 shadow-2xl"
                >
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <Lock size={28} className="text-primary" />
                    </div>

                    <h2 className="font-serif text-3xl font-bold mb-3">You've reached your limit</h2>
                    <p className="text-muted-foreground mb-6">
                        You've read all your free articles this month. Subscribe to continue reading quality journalism.
                    </p>

                    <div className="space-y-3">
                        <Link
                            href="/subscribe"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
                        >
                            <Zap size={18} />
                            Unlock Unlimited Access
                            <ArrowRight size={16} />
                        </Link>

                        <p className="text-xs text-muted-foreground">
                            Already a subscriber?{' '}
                            <Link href="/auth" className="text-primary hover:underline">Sign in</Link>
                        </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border">
                        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <CreditCard size={14} />
                                Cancel anytime
                            </div>
                            <div className="flex items-center gap-1">
                                <Zap size={14} />
                                Instant access
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

export function PaywallBanner({ articlesRemaining }: { articlesRemaining: number }) {
    if (articlesRemaining >= 3) return null;

    return (
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-16 left-0 right-0 z-40 bg-primary/10 border-b border-primary/20 py-2 px-4 text-center"
        >
            <p className="text-sm">
                <span className="font-bold text-primary">{articlesRemaining}</span> free {articlesRemaining === 1 ? 'article' : 'articles'} remaining.{' '}
                <Link href="/subscribe" className="font-bold text-primary hover:underline">
                    Subscribe for unlimited access →
                </Link>
            </p>
        </motion.div>
    );
}
