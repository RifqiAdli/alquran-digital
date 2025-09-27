'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookmarkIcon,
  TrashIcon,
  PlayIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import Header from '@/components/layout/Header';
import { useAppStore } from '@/lib/store';
import { quranAPI, Surah } from '@/lib/api';

export default function BookmarkPage() {
  const [surahList, setSurahList] = useState<Surah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  const { 
    bookmarks, 
    toggleBookmarkSurah, 
    toggleBookmarkAyah,
    setLastRead 
  } = useAppStore();

  useEffect(() => {
    const loadSurahList = async () => {
      try {
        const list = await quranAPI.getSurahList();
        setSurahList(list);
      } catch (error) {
        console.error('Error loading surah list:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSurahList();
  }, []);

  const bookmarkedSurahs = surahList.filter(surah => 
    bookmarks.bookmarkedSurah.includes(surah.nomor)
  );

  const handleContinueReading = () => {
    if (bookmarks.lastRead) {
      setLastRead(bookmarks.lastRead.surah, bookmarks.lastRead.ayah);
      router.push(`/surat/${bookmarks.lastRead.surah}`);
    }
  };

  const handleRemoveBookmarkSurah = (surahId: number) => {
    toggleBookmarkSurah(surahId);
  };

  const handleRemoveBookmarkAyah = (surahId: number, ayahId: number) => {
    toggleBookmarkAyah(surahId, ayahId);
  };

  const getBookmarkedSurahName = (surahId: number) => {
    const surah = surahList.find(s => s.nomor === surahId);
    return surah ? surah.namaLatin : `Surat ${surahId}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container-responsive pt-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded mb-8 w-48"></div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card p-6 mb-4">
                <div className="h-6 bg-white/10 rounded mb-2"></div>
                <div className="h-4 bg-white/10 rounded mb-4"></div>
                <div className="flex space-x-2">
                  <div className="h-8 bg-white/10 rounded flex-1"></div>
                  <div className="h-8 bg-white/10 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      <Header />
      
      <div className="container-responsive pt-8">
        {/* Page Header */}
        <div className="flex items-center space-x-3 mb-8">
          <BookmarkIcon className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-bold gradient-text">Bookmark</h1>
        </div>

        {/* Continue Reading Section */}
        {bookmarks.lastRead && (
          <div className="glass-card p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Lanjutkan Membaca</h2>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-emerald-400">
                  {getBookmarkedSurahName(bookmarks.lastRead.surah)}
                </h3>
                <p className="text-white/60 text-sm">
                  Ayat {bookmarks.lastRead.ayah}
                </p>
              </div>
              <button
                onClick={handleContinueReading}
                className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg transition-colors"
              >
                <PlayIcon className="w-4 h-4" />
                <span>Lanjutkan</span>
              </button>
            </div>
          </div>
        )}

        {/* Bookmarked Surahs */}
        {bookmarkedSurahs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Surat yang Di-bookmark ({bookmarkedSurahs.length})
            </h2>
            <div className="space-y-4">
              {bookmarkedSurahs.map((surah) => (
                <div key={surah.nomor} className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => router.push(`/surat/${surah.nomor}`)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                          {surah.nomor}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-white">{surah.namaLatin}</h3>
                            <span className="arabic-text text-emerald-400">{surah.nama}</span>
                          </div>
                          <p className="text-white/60 text-sm">
                            {surah.arti} • {surah.jumlahAyat} ayat • {surah.tempatTurun}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => router.push(`/surat/${surah.nomor}`)}
                        className="glass-button px-3 py-2 rounded-lg flex items-center space-x-1"
                      >
                        <BookOpenIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Baca</span>
                      </button>
                      
                      <button
                        onClick={() => handleRemoveBookmarkSurah(surah.nomor)}
                        className="glass-button p-2 rounded-lg text-red-400 hover:bg-red-500/20"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookmarked Ayahs */}
        {bookmarks.bookmarkedAyah.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Ayat yang Di-bookmark ({bookmarks.bookmarkedAyah.length})
            </h2>
            <div className="space-y-4">
              {bookmarks.bookmarkedAyah.map((bookmark, index) => (
                <div key={`${bookmark.surah}-${bookmark.ayah}`} className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => router.push(`/surat/${bookmark.surah}#ayah-${bookmark.ayah}`)}
                    >
                      <h3 className="font-semibold text-white mb-1">
                        {getBookmarkedSurahName(bookmark.surah)} - Ayat {bookmark.ayah}
                      </h3>
                      <p className="text-white/60 text-sm">
                        Tap untuk membaca ayat ini
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => router.push(`/surat/${bookmark.surah}#ayah-${bookmark.ayah}`)}
                        className="glass-button px-3 py-2 rounded-lg flex items-center space-x-1"
                      >
                        <BookOpenIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Baca</span>
                      </button>
                      
                      <button
                        onClick={() => handleRemoveBookmarkAyah(bookmark.surah, bookmark.ayah)}
                        className="glass-button p-2 rounded-lg text-red-400 hover:bg-red-500/20"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {bookmarkedSurahs.length === 0 && bookmarks.bookmarkedAyah.length === 0 && !bookmarks.lastRead && (
          <div className="text-center py-16">
            <BookmarkIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Belum Ada Bookmark
            </h2>
            <p className="text-white/60 mb-6">
              Bookmark surat atau ayat favorit Anda untuk akses cepat
            </p>
            <button
              onClick={() => router.push('/')}
              className="glass-button px-6 py-2 rounded-lg"
            >
              Mulai Membaca
            </button>
          </div>
        )}
      </div>
    </div>
  );
}