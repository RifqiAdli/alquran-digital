'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpenIcon,
  BookmarkIcon,
  PlayIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { Surah } from '@/lib/api';
import { useAppStore } from '@/lib/store';

interface SurahCardProps {
  surah: Surah;
}

export default function SurahCard({ surah }: SurahCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { bookmarks, toggleBookmarkSurah } = useAppStore();
  
  const isBookmarked = bookmarks.bookmarkedSurah.includes(surah.nomor);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmarkSurah(surah.nomor);
  };

  return (
    <Link href={`/surat/${surah.nomor}`}>
      <div
        className="surah-card group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Surah Number Badge */}
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
          {surah.nomor}
        </div>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmarkClick}
          className="absolute top-4 right-4 p-2 rounded-full glass-button opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        >
          {isBookmarked ? (
            <BookmarkSolidIcon className="w-5 h-5 text-emerald-400" />
          ) : (
            <BookmarkIcon className="w-5 h-5" />
          )}
        </button>

        {/* Content */}
        <div className="pt-2">
          {/* Arabic Name */}
          <div className="text-center mb-4">
            <h2 className="arabic-text text-2xl md:text-3xl text-emerald-400 font-bold mb-2">
              {surah.nama}
            </h2>
            <h3 className="text-lg md:text-xl font-semibold text-white mb-1">
              {surah.namaLatin}
            </h3>
            <p className="text-sm text-white/60">{surah.arti}</p>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-white/60 mb-4">
            <div className="flex items-center space-x-1">
              <BookOpenIcon className="w-4 h-4" />
              <span>{surah.jumlahAyat} ayat</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPinIcon className="w-4 h-4" />
              <span>{surah.tempatTurun}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <div className="flex-1 glass-button flex items-center justify-center py-2 rounded-lg transition-all duration-300 hover:bg-emerald-500/30">
              <BookOpenIcon className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Baca</span>
            </div>
            
            {surah.audioFull && (
              <div className="glass-button p-2 rounded-lg transition-all duration-300 hover:bg-emerald-500/30">
                <PlayIcon className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>

        {/* Hover Effect Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl pointer-events-none" />
        )}
      </div>
    </Link>
  );
}