'use client';

import { cn } from '@/lib/utils';

type AdSize = 'banner' | 'rectangle' | 'leaderboard' | 'skyscraper';

interface AdSlotProps {
    size: AdSize;
    className?: string;
    position?: string;
}

const AD_DIMENSIONS: Record<AdSize, { width: number; height: number; label: string }> = {
    banner: { width: 468, height: 60, label: 'Banner Ad (468×60)' },
    rectangle: { width: 300, height: 250, label: 'Rectangle Ad (300×250)' },
    leaderboard: { width: 728, height: 90, label: 'Leaderboard Ad (728×90)' },
    skyscraper: { width: 160, height: 600, label: 'Skyscraper Ad (160×600)' },
};

/**
 * Ad slot placeholder component.
 * In production, replace the children with actual ad network code (Google AdSense, etc.)
 */
export function AdSlot({ size, className, position }: AdSlotProps) {
    const { width, height, label } = AD_DIMENSIONS[size];

    return (
        <div
            className={cn(
                "flex items-center justify-center bg-muted/30 border border-dashed border-border rounded-lg overflow-hidden",
                className
            )}
            style={{ maxWidth: width, minHeight: height }}
            data-ad-position={position}
        >
            {/* Placeholder - Replace with actual ad code in production */}
            <div className="text-center px-4 py-2">
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                    {label}
                </p>
                <p className="text-[10px] text-muted-foreground/50 mt-1">
                    Ad Space
                </p>
            </div>
        </div>
    );
}

/**
 * In-article ad slot that appears between paragraphs.
 */
export function InArticleAd({ className }: { className?: string }) {
    return (
        <div className={cn("my-8 flex justify-center", className)}>
            <AdSlot size="rectangle" position="in-article" />
        </div>
    );
}

/**
 * Sidebar ad slot for the news page.
 */
export function SidebarAd({ className }: { className?: string }) {
    return (
        <div className={cn("sticky top-24", className)}>
            <AdSlot size="rectangle" position="sidebar" />
        </div>
    );
}

/**
 * Header leaderboard ad.
 */
export function HeaderAd({ className }: { className?: string }) {
    return (
        <div className={cn("hidden md:flex justify-center py-2 bg-muted/10", className)}>
            <AdSlot size="leaderboard" position="header" />
        </div>
    );
}
