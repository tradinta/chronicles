'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
    src: string;
    poster?: string;
    title?: string;
    className?: string;
}

export function VideoPlayer({ src, poster, title, className }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showControls, setShowControls] = useState(true);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!isFullscreen) {
            containerRef.current.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
        setIsFullscreen(!isFullscreen);
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setProgress(progress);
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!videoRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        videoRef.current.currentTime = pos * videoRef.current.duration;
    };

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        const handleMouseMove = () => {
            setShowControls(true);
            clearTimeout(timeout);
            timeout = setTimeout(() => setShowControls(false), 3000);
        };

        containerRef.current?.addEventListener('mousemove', handleMouseMove);
        return () => {
            containerRef.current?.removeEventListener('mousemove', handleMouseMove);
            clearTimeout(timeout);
        };
    }, []);

    // Check if it's a YouTube URL
    const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');
    const youtubeId = isYouTube ? src.match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1] : null;

    if (isYouTube && youtubeId) {
        return (
            <div className={cn("relative aspect-video bg-black rounded-lg overflow-hidden", className)}>
                <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title={title || "Video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                />
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={cn("relative aspect-video bg-black rounded-lg overflow-hidden group", className)}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onClick={togglePlay}
                aria-label={title || "Video player"}
            />

            {/* Custom Controls */}
            <div
                className={cn(
                    "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity",
                    showControls || !isPlaying ? "opacity-100" : "opacity-0"
                )}
            >
                {/* Progress Bar */}
                <div
                    onClick={handleSeek}
                    className="w-full h-1 bg-white/30 rounded cursor-pointer mb-3"
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    <div
                        className="h-full bg-primary rounded"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={togglePlay}
                            className="text-white hover:text-primary transition-colors"
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                        </button>
                        <button
                            onClick={toggleMute}
                            className="text-white hover:text-primary transition-colors"
                            aria-label={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                    </div>
                    <button
                        onClick={toggleFullscreen}
                        className="text-white hover:text-primary transition-colors"
                        aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                    >
                        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                    </button>
                </div>
            </div>

            {/* Play Button Overlay */}
            {!isPlaying && (
                <button
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
                    aria-label="Play video"
                >
                    <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play size={32} className="text-white ml-1" fill="currentColor" />
                    </div>
                </button>
            )}
        </div>
    );
}
