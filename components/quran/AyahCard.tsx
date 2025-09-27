'use client';

import { useState } from 'react';
import {
  PlayIcon,
  PauseIcon,
  BookmarkIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { Ayah } from '@/lib/api';
import { useAppStore } from '@/lib/store';

interface AyahCardProps {
  ayah: Ayah;
  surahNumber: number;
  isPlaying?: boolean;
  onPlayToggle?: () => void;
}

export default function AyahCard({ 
  ayah, 
  surahNumber, 
  isPlaying = false, 
  onPlayToggle 
}: AyahCardProps) {
  const [showActions, setShowActions] = useState(false);
  
  const { 
    bookmarks, 
    toggleBookmarkAyah, 
    setLastRead,
    fontSize 
  } = useAppStore();
  
  const isBookmarked = bookmarks.bookmarkedAyah.some(
    bookmark => bookmark.surah === surahNumber && bookmark.ayah === ayah.nomorAyat
  );

  const handleBookmarkClick = () => {
    toggleBookmarkAyah(surahNumber, ayah.nomorAyat);
  };

  const handleReadingMark = () => {
    setLastRead(surahNumber, ayah.nomorAyat);
  };

  const handleShare = async () => {
    const shareText = `${ayah.teksArab}\n\n"${ayah.teksIndonesia}"\n\n(QS. ${surahNumber}:${ayah.nomorAyat})`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QS. ${surahNumber}:${ayah.nomorAyat}`,
          text: shareText,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      // Could add a toast notification here
    }
  };

  return (
    <div 
      className="ayah-card group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={handleReadingMark}
    >
      {/* Ayah Number */}
      <div className="flex items-start space-x-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {ayah.nomorAyat}
        </div>
        
        {/* Action Buttons */}
        <div className={`flex items-center space-x-2 transition-opacity duration-300 ${
          showActions ? 'opacity-100' : 'opacity-0'
        }`}>
          {ayah.audio && Object.keys(ayah.audio).length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlayToggle?.();
              }}
              className="p-2 rounded-lg glass-button hover:scale-105 transition-all duration-300"
            >
              {isPlaying ? (
                <PauseIcon className="w-4 h-4" />
              ) : (
                <PlayIcon className="w-4 h-4" />
              )}
            </button>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleBookmarkClick();
            }}
            className="p-2 rounded-lg glass-button hover:scale-105 transition-all duration-300"
          >
            {isBookmarked ? (
              <BookmarkSolidIcon className="w-4 h-4 text-emerald-400" />
            ) : (
              <BookmarkIcon className="w-4 h-4" />
            )}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="p-2 rounded-lg glass-button hover:scale-105 transition-all duration-300"
          >
            <ShareIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Arabic Text */}
      <div className="mb-6">
        <p 
          className="arabic-text text-white leading-loose"
          style={{ fontSize: `${fontSize + 8}px` }}
        >
          {ayah.teksArab}
        </p>
      </div>

      {/* Transliteration */}
      <div className="mb-4">
        <p 
          className="text-emerald-300 italic leading-relaxed"
          style={{ fontSize: `${fontSize - 2}px` }}
        >
          {ayah.teksLatin}
        </p>
      </div>

      {/* Translation */}
      <div>
        <p 
          className="text-white/90 leading-relaxed"
          style={{ fontSize: `${fontSize}px` }}
        >
          {ayah.teksIndonesia}
        </p>
      </div>

      {/* Reading Progress Indicator */}
      {bookmarks.lastRead?.surah === surahNumber && 
       bookmarks.lastRead?.ayah === ayah.nomorAyat && (
        <div className="absolute -left-1 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full" />
      )}
    </div>
  );
}