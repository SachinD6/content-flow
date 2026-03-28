'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { LoadingSpinner } from '@/components';
import { cn } from '@/lib/utils';

interface AvatarUploadProps {
  currentAvatarUrl: string | null;
  userId: string;
  onUploadComplete: (url: string) => void;
}

export function AvatarUpload({ currentAvatarUrl, userId, onUploadComplete }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File must be less than 2MB');
      return;
    }

    setIsUploading(true);

    try {
      const supabase = createClient();
      const path = `${userId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      onUploadComplete(data.publicUrl);
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <div 
        className={cn(
          "relative h-24 w-24 overflow-hidden rounded-full border border-white/10 shrink-0 group cursor-pointer bg-[#0b0c10]",
          isUploading && "pointer-events-none opacity-80"
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? (
           <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/60">
             <LoadingSpinner size="sm" />
           </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <Camera className="h-6 w-6 text-white" />
          </div>
        )}

        {currentAvatarUrl ? (
          <Image 
            src={currentAvatarUrl}
            alt="Avatar"
            fill
            sizes="96px"
            className="object-cover z-10"
          />
        ) : (
          <div className="flex w-full h-full items-center justify-center bg-[#6154f0] text-3xl font-extrabold text-white uppercase z-10 pt-1 tracking-tighter">
            ?
          </div>
        )}
      </div>
      
      <div className="flex flex-col text-center sm:text-left gap-1 pt-1 justify-center h-24 max-w-[200px]">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />
        <button 
          type="button" 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="text-[12px] font-bold text-[#6154f0] hover:text-[#766bf3] tracking-wide transition-colors bg-white/5 py-1.5 px-4 rounded-full border border-white/10 cursor-pointer disabled:cursor-not-allowed"
        >
          Upload photo
        </button>
        <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 mt-2">
          JPG, GIF or PNG. 2MB max.
        </span>
      </div>
    </div>
  );
}
