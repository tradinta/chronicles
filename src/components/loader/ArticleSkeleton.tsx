import { Skeleton } from "@/components/ui/skeleton";

export const ArticleSkeleton = () => {
    return (
        <div className="min-h-screen bg-background pt-20 pb-12 px-6 md:px-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center space-x-3 mb-6">
                    <Skeleton className="h-[1px] w-8" />
                    <Skeleton className="h-4 w-24" />
                </div>

                <Skeleton className="h-16 w-full mb-4" />
                <Skeleton className="h-16 w-3/4 mb-8" />

                <div className="flex flex-col md:flex-row justify-between border-t border-b py-6 gap-6 border-border mb-8">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-3 w-48" />
                        </div>
                    </div>
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>

            {/* Image */}
            <Skeleton className="w-full h-[50vh] md:h-[70vh] mb-16" />

            {/* Body */}
            <div className="max-w-3xl mx-auto space-y-6">
                <Skeleton className="h-8 w-full mb-8 border-l-4 border-muted pl-4" /> {/* Summary quote style */}

                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[90%]" />
                    </div>
                ))}
            </div>
        </div>
    );
};
