'use client';

import React, { useState, useEffect } from 'react';
import { AtSign, Check, X, User } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

interface EditorReferenceProps {
    initialEmail?: string;
    onResolve: (name: string, email: string) => void;
    isDark: boolean;
}

export const EditorReference = ({ initialEmail, onResolve, isDark }: EditorReferenceProps) => {
    const firestore = useFirestore();
    const [email, setEmail] = useState(initialEmail || '');
    const [isResolved, setIsResolved] = useState(!!initialEmail);
    const [resolvedName, setResolvedName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleResolve = async () => {
        if (!email.includes('@')) {
            setError('Invalid email address');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Check if it's a known author in our 'users' collection
            // Note: In a real app, you might want a dedicated 'authors' index or edge function for privacy
            // For now, we simulate a query or perform a direct one if rules allow
            const usersRef = collection(firestore, 'users');
            const q = query(usersRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                const name = userData.displayName || 'Anonymous Author';
                setResolvedName(name);
                setIsResolved(true);
                onResolve(name, email);
            } else {
                // If not found, we can either error or allow it as an external reference
                // For this feature, let's treat it as "External Contributor" if not in DB
                // Or user requested "resolve to just their name for privacy" - implying they must exist.
                // Let's assume we want to fallback to a "Guest" state or specific error.
                // "User not found" is safer.
                setError('Author not found in The Chronicle database.');
            }
        } catch (err) {
            console.error('Error resolving author:', err);
            setError('Could not verify author.');
        } finally {
            setIsLoading(false);
        }
    };

    const reset = () => {
        setIsResolved(false);
        setResolvedName('');
        setEmail('');
        setError('');
    };

    return (
        <div className={`p-4 rounded-lg border flex items-center space-x-4 transition-all ${isDark ? 'bg-stone-800/50 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
            <div className={`p-2 rounded-full ${isDark ? 'bg-stone-700 text-stone-300' : 'bg-white text-stone-500 shadow-sm'}`}>
                <AtSign size={16} />
            </div>

            {isResolved ? (
                <div className="flex items-center justify-between flex-1">
                    <div>
                        <p className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>Referenced Author</p>
                        <p className={`text-lg font-serif font-medium ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>{resolvedName}</p>
                    </div>
                    <button onClick={reset} className="p-1 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full transition-colors">
                        <X size={14} className="text-stone-400" />
                    </button>
                </div>
            ) : (
                <div className="flex-1 flex items-center space-x-2">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter author email to reference..."
                        className={`flex-1 bg-transparent outline-none text-sm font-medium ${isDark ? 'text-stone-200 placeholder-stone-600' : 'text-stone-800 placeholder-stone-400'}`}
                        onKeyDown={(e) => e.key === 'Enter' && handleResolve()}
                    />
                    {isLoading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                    ) : (
                        <button
                            onClick={handleResolve}
                            disabled={!email}
                            className="text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80 disabled:opacity-50"
                        >
                            Verify
                        </button>
                    )}
                </div>
            )}

            {error && (
                <div className="absolute -bottom-6 left-0 text-[10px] text-red-500 font-medium">
                    {error}
                </div>
            )}
        </div>
    );
};
