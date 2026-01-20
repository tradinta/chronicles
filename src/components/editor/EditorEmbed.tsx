'use client';

import React, { useState } from 'react';
import { Link, Globe, Check } from 'lucide-react';

interface EditorEmbedProps {
    initialUrl?: string;
    onUpdate: (url: string) => void;
    isDark: boolean;
}

export const EditorEmbed = ({ initialUrl, onUpdate, isDark }: EditorEmbedProps) => {
    const [url, setUrl] = useState(initialUrl || '');
    const [isActive, setIsActive] = useState(!!initialUrl);

    const handleSubmit = () => {
        if (url) {
            setIsActive(true);
            onUpdate(url);
        }
    };

    return (
        <div className={`my-6 rounded-lg overflow-hidden border transition-all ${isActive ? '' : 'p-1'} ${isDark ? 'border-stone-800 bg-stone-900/30' : 'border-stone-200 bg-stone-50'}`}>
            {isActive ? (
                <div className="relative group">
                    <div className="aspect-video w-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                        {/* In a real app, this would be an iframe or a rich preview card generated from metadata */}
                        <div className="text-center p-6">
                            <Globe size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm font-medium">{url}</p>
                            <p className="text-xs mt-2 opacity-60">External Content Embed</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsActive(false)}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        Edit URL
                    </button>
                </div>
            ) : (
                <div className="flex items-center p-3">
                    <div className={`mr-3 p-2 rounded-full ${isDark ? 'bg-stone-800 text-stone-400' : 'bg-white text-stone-500 shadow-sm'}`}>
                        <Link size={16} />
                    </div>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste link to embed (Article, Tweet, Video)..."
                        className={`flex-1 bg-transparent outline-none text-sm ${isDark ? 'text-stone-200 placeholder-stone-600' : 'text-stone-800 placeholder-stone-400'}`}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        autoFocus
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={!url}
                        className="ml-2 p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 text-primary transition-colors disabled:opacity-50"
                    >
                        <Check size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};
