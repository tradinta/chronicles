import { Skeleton } from "@/components/ui/skeleton";

export const FeedSkeleton = () => {
    return (
        <div className="min-h-screen bg-background dark:bg-[#121212] pt-32">
            {/* Hero Skeleton */}
            <div className="container mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-12 mb-20">
                <div className="lg:col-span-8">
                    <div className="flex items-center space-x-3 mb-6">
                        <Skeleton className="h-[1px] w-8" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-16 w-3/4 mb-4" />
                    <Skeleton className="h-16 w-1/2 mb-8" />
                    <Skeleton className="h-6 w-96 mb-10" />
                    <Skeleton className="h-[400px] w-full rounded-lg" />
                </div>
                <div className="lg:col-span-4 hidden lg:flex flex-col justify-end">
                    <div className="p-8 border-l border-border h-full flex flex-col justify-end">
                        <Skeleton className="h-8 w-48 mb-4" />
                        <Skeleton className="h-20 w-full mb-8" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            </div>

            {/* Ticker Skeleton */}
            <div className="w-full h-12 border-y border-border bg-secondary/30 mb-16 flex items-center px-6">
                <div className="flex space-x-8 w-full">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center space-x-2">
                            <Skeleton className="h-2 w-2 rounded-full" />
                            <Skeleton className="h-3 w-48" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Briefing Section Skeleton */}
            <div className="container mx-auto px-6 md:px-12 pb-20">
                <div className="flex items-center space-x-2 mb-8">
                    <Skeleton className="h-[1px] w-8" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-6 rounded-xl border border-border h-72 flex flex-col justify-between">
                            <div className="flex items-center space-x-2 border-b border-dashed border-border/50 pb-4 mb-4">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-5 w-24" />
                            </div>
                            <div className="space-y-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
