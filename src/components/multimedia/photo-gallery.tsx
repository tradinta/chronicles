'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GalleryImage {
    src: string;
    alt?: string;
    caption?: string;
}

interface PhotoGalleryProps {
    images: GalleryImage[];
    className?: string;
}

export function PhotoGallery({ images, className }: PhotoGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'ArrowRight') goToNext();
        if (e.key === 'Escape') setIsLightboxOpen(false);
    }, [goToPrevious, goToNext]);

    if (images.length === 0) return null;

    return (
        <>
            {/* Gallery Grid/Carousel */}
            <div className={cn("relative", className)}>
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-muted">
                    <Image
                        src={images[currentIndex].src}
                        alt={images[currentIndex].alt || `Photo ${currentIndex + 1}`}
                        fill
                        className="object-cover cursor-pointer"
                        onClick={() => setIsLightboxOpen(true)}
                        sizes="(max-width: 768px) 100vw, 800px"
                    />

                    {/* Zoom Indicator */}
                    <button
                        onClick={() => setIsLightboxOpen(true)}
                        className="absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                        aria-label="Open fullscreen"
                    >
                        <ZoomIn size={18} />
                    </button>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={goToPrevious}
                                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                                aria-label="Previous image"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                                aria-label="Next image"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}
                </div>

                {/* Caption */}
                {images[currentIndex].caption && (
                    <p className="text-sm text-muted-foreground mt-2 text-center italic">
                        {images[currentIndex].caption}
                    </p>
                )}

                {/* Thumbnails/Indicators */}
                {images.length > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all",
                                    index === currentIndex
                                        ? "bg-primary w-6"
                                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                )}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
                        onClick={() => setIsLightboxOpen(false)}
                        onKeyDown={handleKeyDown}
                        tabIndex={0}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors z-10"
                            aria-label="Close lightbox"
                        >
                            <X size={24} />
                        </button>

                        {/* Navigation */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                                    className="absolute left-4 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft size={32} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); goToNext(); }}
                                    className="absolute right-4 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                                    aria-label="Next image"
                                >
                                    <ChevronRight size={32} />
                                </button>
                            </>
                        )}

                        {/* Image */}
                        <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                            <Image
                                src={images[currentIndex].src}
                                alt={images[currentIndex].alt || `Photo ${currentIndex + 1}`}
                                width={1200}
                                height={800}
                                className="object-contain max-h-[90vh]"
                            />
                            {images[currentIndex].caption && (
                                <p className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-center">
                                    {images[currentIndex].caption}
                                </p>
                            )}
                        </div>

                        {/* Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm font-mono">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
