'use client';

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldCheck, BookOpen, AlertTriangle } from 'lucide-react';

interface EditorialStandardsModalProps {
    isOpen: boolean;
    onAccept: () => void;
    isDark: boolean;
}

export const EditorialStandardsModal = ({ isOpen, onAccept, isDark }: EditorialStandardsModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
            <DialogContent className={`max-w-2xl border-none shadow-2xl ${isDark ? 'bg-[#0c0c0c] text-stone-200' : 'bg-white text-stone-800'}`}>
                <div className="flex flex-col items-center text-center pt-8">
                    <div className="mb-6 p-4 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-500">
                        <ShieldCheck size={48} />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-serif font-bold mb-4">Editorial Standards</DialogTitle>
                        <DialogDescription className={`text-lg leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                            Welcome to The Chronicle's newsroom. As a contributor, you are joining a legacy of truth and integrity. Before you write, please agree to our core values.
                        </DialogDescription>
                    </DialogHeader>

                    <div className={`mt-8 space-y-4 text-left p-6 rounded-xl w-full ${isDark ? 'bg-stone-900' : 'bg-stone-50'}`}>
                        <div className="flex items-start space-x-3">
                            <BookOpen className="shrink-0 mt-1 text-primary" size={20} />
                            <div>
                                <h4 className="font-bold text-sm uppercase tracking-wide">Accuracy First</h4>
                                <p className="text-sm opacity-80">Verify every fact. If you're unsure, leave it out. We do not publish rumors without clear attribution.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <AlertTriangle className="shrink-0 mt-1 text-primary" size={20} />
                            <div>
                                <h4 className="font-bold text-sm uppercase tracking-wide">No Hate Speech</h4>
                                <p className="text-sm opacity-80">We maintain a zero-tolerance policy for hate speech, harassment, or non-constructive polemics.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                        <Button variant="outline" className="w-full py-6 h-auto border-stone-200 dark:border-stone-800" disabled>
                            Read Full Guidelines
                        </Button>
                        <Button onClick={onAccept} className="w-full py-6 h-auto text-base font-bold tracking-wider bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-900/20">
                            I Agree, Start Writing
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
