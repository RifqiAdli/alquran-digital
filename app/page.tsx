'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpenIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  PlayIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import Header from '@/components/layout/Header';
import SurahCard from '@/components/quran/SurahCard';
import { useAppStore } from '@/lib/store';
import { quranAPI, Surah } from '@/lib/api';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [randomAyah, setRandomAyah] = useState<string>('');
  const router = useRouter();
  
  const { 
    surahList, 
    setSurahList, 
    searchQuery,
    bookmarks 
  } = useAppStore();

  // Famous verses for hero section
  const famousVerses = [
    'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
    'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    'وَاللَّهُ غَالِبٌ عَلَىٰ أَمْرِهِ وَلَـٰكِنَّ أَكْثَرَ النَّاسِ لَا يَعْلَمُونَ',
  ];

  useEffect(() => {
    const loadSurahList = async () => {
      try {
        setIsLoading(true);
        const list = await quranAPI.getSurahList();
        setSurahList(list);
        
        // Set random ayah for hero
        const randomIndex = Math.floor(Math.random() * famousVerses.length);
        setRandomAyah(famousVerses[randomIndex]);
      } catch (err) {
        setError('Gagal memuat daftar surat. Silakan coba lagi.');
        console.error('Error loading surah list:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (surahList.length === 0) {
      loadSurahList();
    } else {
      setIsLoading(false);
      const randomIndex = Math.floor(Math.random() * famousVerses.length);
      setRandomAyah(famousVerses[randomIndex]);
    }
  }, [surahList, setSurahList]);

  const filteredSurah = searchQuery 
    ? quranAPI.searchSurah(surahList, searchQuery)
    : surahList;

  const stats = {
    totalSurah: 114,
    totalAyah: 6236,
    totalBookmarks: bookmarks.bookmarkedSurah.length + bookmarks.bookmarkedAyah.length,
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Header />
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpenIcon className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Terjadi Kesalahan</h2>
          <p className="text-white/60 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="glass-button px-6 py-2 rounded-lg"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      <Header />
      
      {/* Hero Section */}
      <section className="container-responsive pt-12 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Title */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold gradient-text mb-4">
              Al-Quran Digital
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Baca, dengarkan, dan pelajari Al-Quran dengan pengalaman modern yang nyaman
            </p>
          </div>

          {/* Featured Verse */}
          <div className="glass-card p-8 md:p-12 mb-8">
            <p className="arabic-text text-2xl md:text-3xl lg:text-4xl text-emerald-400 mb-6 leading-loose">
              {randomAyah}
            </p>
            <p className="text-white/60 text-sm">
              Ayat pilihan hari ini
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="glass-card p-6">
              <div className="flex items-center justify-center mb-3">
                <BookOpenIcon className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stats.totalSurah}</div>
              <div className="text-white/60 text-sm">Surat</div>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center justify-center mb-3">
                <ChartBarIcon className="w-8 h-8 text-teal-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stats.totalAyah.toLocaleString()}</div>
              <div className="text-white/60 text-sm">Ayat</div>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex items-center justify-center mb-3">
                <BookmarkIcon className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stats.totalBookmarks}</div>
              <div className="text-white/60 text-sm">Bookmark</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => router.push('/surat/1')}
              className="glass-button px-6 py-3 rounded-lg flex items-center space-x-2"
            >
              <BookOpenIcon className="w-5 h-5" />
              <span>Mulai Membaca</span>
            </button>
            
            <button
              onClick={() => router.push('/bookmark')}
              className="glass-button px-6 py-3 rounded-lg flex items-center space-x-2"
            >
              <BookmarkIcon className="w-5 h-5" />
              <span>Bookmark</span>
            </button>
            
            {bookmarks.lastRead && (
              <button
                onClick={() => router.push(`/surat/${bookmarks.lastRead?.surah}`)}
                className="bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/50 px-6 py-3 rounded-lg flex items-center space-x-2 text-emerald-400 hover:bg-emerald-500/30 transition-all duration-300"
              >
                <PlayIcon className="w-5 h-5" />
                <span>Lanjut Baca</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Surah List Section */}
      <section className="container-responsive">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Daftar Surat
          </h2>
          
          <div className="text-white/60 text-sm">
            {searchQuery ? `${filteredSurah.length} hasil` : '114 surat'}
          </div>
        </div>

        {isLoading ? (
          // Loading Skeleton
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-8 bg-white/10 rounded mb-4"></div>
                <div className="h-6 bg-white/10 rounded mb-2"></div>
                <div className="h-4 bg-white/10 rounded mb-4"></div>
                <div className="flex space-x-2">
                  <div className="flex-1 h-10 bg-white/10 rounded"></div>
                  <div className="w-10 h-10 bg-white/10 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSurah.map((surah) => (
              <SurahCard key={surah.nomor} surah={surah} />
            ))}
          </div>
        )}

        {!isLoading && filteredSurah.length === 0 && searchQuery && (
          <div className="text-center py-16">
            <MagnifyingGlassIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Tidak ada hasil
            </h3>
            <p className="text-white/60">
              Tidak ditemukan surat dengan kata kunci "{searchQuery}"
            </p>
          </div>
        )}
      </section>
    </div>
  );
}