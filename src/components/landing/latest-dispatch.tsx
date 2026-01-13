
'use client';

import { useRouter } from 'next/navigation';
import { ExternalLink } from 'lucide-react';

const dispatchItems = [
    { time: "12m ago", title: "Global markets react to new trade sanctions" },
    { time: "45m ago", title: "Tech giant announces surprise CEO departure" },
    { time: "1h ago", title: "Climate summit reaches tentative agreement" },
];

export default function LatestDispatch() {
    const router = useRouter();
    return (
        <div className="max-w-md mx-auto bg-card border border-border rounded-lg shadow-sm p-8">
            <div className="flex justify-between items-baseline mb-8">
                <h3 className="font-serif text-2xl text-foreground">Latest Dispatch</h3>
                <span className="text-xs font-bold tracking-widest uppercase text-primary">Live Feed</span>
            </div>

            <div className="space-y-6 mb-8">
                {dispatchItems.map((item, i) => (
                    <div key={i} className="group cursor-pointer" onClick={() => router.push('/news')}>
                        <p className="text-xs text-muted-foreground mb-1">{item.time}</p>
                        <p className="text-foreground group-hover:underline">{item.title}</p>
                    </div>
                ))}
            </div>

            <div className="border-t border-dashed border-border pt-8">
                <button
                    onClick={() => router.push('/news')}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-foreground text-background rounded-md text-sm font-bold tracking-wider uppercase hover:bg-foreground/80 transition-colors"
                >
                    Explore All Stories
                    <ExternalLink size={16} />
                </button>
            </div>
        </div>
    );
}
