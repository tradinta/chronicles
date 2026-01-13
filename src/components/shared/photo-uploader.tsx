
'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Camera, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PhotoUploaderProps {
  initialImage: string | null;
  onUploadComplete: (url: string) => void;
  className?: string;
  imageClassName?: string;
  children?: React.ReactNode;
}

export function PhotoUploader({ 
  initialImage, 
  onUploadComplete, 
  className,
  imageClassName,
  children,
}: PhotoUploaderProps) {
  const [imageUrl, setImageUrl] = useState(initialImage);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const timestamp = Math.round(Date.now() / 1000);
      const public_id = `story_image_${timestamp}`;
      
      const paramsToSign = {
        timestamp: timestamp,
        public_id: public_id,
      };

      // 1. Get signature from our API for the specific parameters
      const signResponse = await fetch('/api/sign-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paramsToSign }),
      });

      if (!signResponse.ok) {
        const errorText = await signResponse.text();
        throw new Error(`Failed to get upload signature. Server responded with: ${errorText}`);
      }
      const { signature } = await signResponse.json();

      // 2. Append all necessary data to the form for the final upload
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      formData.append('timestamp', timestamp.toString());
      formData.append('public_id', public_id);
      formData.append('signature', signature);
      
      // 3. Upload to Cloudinary
      const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (uploadResponse.ok) {
        const imageData = await uploadResponse.json();
        const uploadedUrl = imageData.secure_url;
        setImageUrl(uploadedUrl);
        onUploadComplete(uploadedUrl);
        toast({ title: "Photo uploaded!" });
      } else {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error.message || 'Cloudinary upload failed.');
      }
    } catch (error: any) {
      console.error('Image upload error:', error);
      toast({ 
        variant: 'destructive', 
        title: "Upload Failed", 
        description: error.message || "Could not upload the photo. Please check your credentials or try again." 
      });
    } finally {
      setIsUploading(false);
    }
  }, [onUploadComplete, toast]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const currentImage = imageUrl || initialImage;

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={cn(
        "relative group cursor-pointer",
        className
      )}
    >
      {currentImage ? (
        <Image 
          src={currentImage}
          alt="Uploaded content" 
          width={80} 
          height={80} 
          className={cn("bg-muted border border-border object-cover", imageClassName)} 
        />
      ) : (
        children
      )}
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
        {isUploading ? (
          <Loader2 size={24} className="animate-spin" />
        ) : (
          <Camera size={24} />
        )}
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageSelect} 
        accept="image/*" 
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}
