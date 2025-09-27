'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
  SpeakerWaveIcon,
  AdjustmentsHorizontalIcon,
  ShareIcon,
  PauseIcon,
} from '@heroicons/react/24/outline';
import Header from '@/components/layout/Header';
import AyahCard from '@/components/quran/AyahCard';
import AudioPlayer from '@/components/quran/AudioPlayer';
import { useAppStore } from '@/lib/store';
import { quranAPI, SurahDetail, quranAPI as api, QARI_OPTIONS } from '@/lib/api';

interface SurahClientProps {
  params: { id: string };
}

export default function SurahClient({ params }: SurahClientProps) {
  const surahId = parseInt(params.id);
  const router = useRouter();
  
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isPlayingFullSurah, setIsPlayingFullSurah] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const { 
    selectedQari, 
    fontSize, 
    setFontSize,
    setCurrentSurahDetail,
    audio,
    setAudioState 
  } = useAppStore();

  useEffect(() => {
    const loadSurahDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const detail = await quranAPI.getSurahDetail(surahId);
        setSurahDetail(detail);
        setCurrentSurahDetail(detail);
      } catch (err) {
        setError('Gagal memuat detail surat. Silakan coba lagi.');
        console.error('Error loading surah detail:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSurahDetail();
  }, [surahId, setCurrentSurahDetail]);

  const handlePlayAyah = (ayahNumber: number) => {
    if (!surahDetail) return;
    
    // Stop full surah if playing individual ayah
    if (isPlayingFullSurah) {
      setIsPlayingFullSurah(false);
      // Reset repeat mode to none for individual playback
      setAudioState({ repeatMode: 'none' });
    }
    
    const ayah = surahDetail.ayat.find(a => a.nomorAyat === ayahNumber);
    if (!ayah || !ayah.audio[selectedQari]) return;

    if (currentPlayingAyah === ayahNumber && audio.isPlaying) {
      setCurrentPlayingAyah(null);
      setAudioState({ isPlaying: false });
    } else {
      setCurrentPlayingAyah(ayahNumber);
      setAudioState({ 
        currentSurah: surahId, 
        currentAyah: ayahNumber,
        isPlaying: true,
        repeatMode: 'none' // Individual ayah playback
      });
    }
  };

  const handlePlayFullSurah = () => {
    if (!surahDetail) return;

    if (isPlayingFullSurah && audio.isPlaying) {
      // Stop full surah
      setIsPlayingFullSurah(false);
      setCurrentPlayingAyah(null);
      setAudioState({ isPlaying: false });
    } else {
      // Start playing full surah from first ayah
      setIsPlayingFullSurah(true);
      
      // Start from first ayah
      const firstAyah = surahDetail.ayat[0];
      if (firstAyah) {
        setCurrentPlayingAyah(firstAyah.nomorAyat);
        setAudioState({ 
          currentSurah: surahId, 
          currentAyah: firstAyah.nomorAyat,
          isPlaying: true,
          repeatMode: 'surah' // This will ensure auto-continue
        });
        
        console.log('Starting full surah mode with ayah:', firstAyah.nomorAyat);
      }
    }
  };

  const handleNextAyah = () => {
    if (!surahDetail || !currentPlayingAyah) {
      console.log('No surah detail or current playing ayah');
      return;
    }
    
    const currentIndex = surahDetail.ayat.findIndex(a => a.nomorAyat === currentPlayingAyah);
    const nextIndex = currentIndex + 1;
    
    console.log('Current index:', currentIndex, 'Next index:', nextIndex, 'Total ayahs:', surahDetail.ayat.length);
    console.log('Is playing full surah:', isPlayingFullSurah);
    
    if (nextIndex < surahDetail.ayat.length) {
      // Play next ayah in current surah
      const nextAyah = surahDetail.ayat[nextIndex];
      console.log('Playing next ayah:', nextAyah.nomorAyat);
      
      setCurrentPlayingAyah(nextAyah.nomorAyat);
      
      // Maintain the repeat mode based on current state
      setAudioState({ 
        currentSurah: surahId, 
        currentAyah: nextAyah.nomorAyat,
        isPlaying: true,
        repeatMode: isPlayingFullSurah ? 'surah' : audio.repeatMode
      });
    } else if (surahDetail.suratSelanjutnya && isPlayingFullSurah) {
      // If playing full surah, continue to next surah
      console.log('Moving to next surah:', surahDetail.suratSelanjutnya.nomor);
      router.push(`/surat/${surahDetail.suratSelanjutnya.nomor}`);
    } else {
      // End of surah, stop playing
      console.log('End of surah, stopping playback');
      setCurrentPlayingAyah(null);
      setIsPlayingFullSurah(false);
      setAudioState({ isPlaying: false, repeatMode: 'none' });
    }
  };

  const handlePreviousAyah = () => {
    if (!surahDetail || !currentPlayingAyah) return;
    
    const currentIndex = surahDetail.ayat.findIndex(a => a.nomorAyat === currentPlayingAyah);
    const prevIndex = currentIndex - 1;
    
    if (prevIndex >= 0) {
      // Play previous ayah in current surah
      const prevAyah = surahDetail.ayat[prevIndex];
      setCurrentPlayingAyah(prevAyah.nomorAyat);
      setAudioState({ 
        currentSurah: surahId, 
        currentAyah: prevAyah.nomorAyat,
        isPlaying: true,
        repeatMode: isPlayingFullSurah ? 'surah' : audio.repeatMode
      });
    } else if (surahDetail.suratSebelumnya) {
      // Go to previous surah
      router.push(`/surat/${surahDetail.suratSebelumnya.nomor}`);
    }
  };

  const getCurrentAudioUrl = () => {
    if (!surahDetail || !currentPlayingAyah) return '';
    
    const ayah = surahDetail.ayat.find(a => a.nomorAyat === currentPlayingAyah);
    return ayah ? api.getAudioUrl(ayah.audio, selectedQari) : '';
  };

  const handleShare = async () => {
    if (!surahDetail) return;
    
    const shareData = {
      title: `${surahDetail.namaLatin} - ${surahDetail.arti}`,
      text: `Baca surat ${surahDetail.namaLatin} (${surahDetail.arti}) - ${surahDetail.jumlahAyat} ayat`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.url}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container-responsive pt-8">
          {/* Header Skeleton */}
          <div className="glass-card p-8 mb-8 animate-pulse">
            <div className="h-8 bg-white/10 rounded mb-4"></div>
            <div className="h-12 bg-white/10 rounded mb-4"></div>
            <div className="h-6 bg-white/10 rounded mb-4"></div>
            <div className="flex space-x-4">
              <div className="h-10 bg-white/10 rounded flex-1"></div>
              <div className="h-10 bg-white/10 rounded flex-1"></div>
            </div>
          </div>
          
          {/* Ayah Skeletons */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass-card p-6 mb-4 animate-pulse">
              <div className="flex space-x-4 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-full"></div>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-white/10 rounded"></div>
                  <div className="w-8 h-8 bg-white/10 rounded"></div>
                </div>
              </div>
              <div className="h-16 bg-white/10 rounded mb-4"></div>
              <div className="h-6 bg-white/10 rounded mb-2"></div>
              <div className="h-6 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !surahDetail) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container-responsive pt-8 text-center">
          <div className="glass-card p-8">
            <BookOpenIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              {error || 'Surat tidak ditemukan'}
            </h2>
            <div className="flex justify-center space-x-4 mt-6">
              <button 
                onClick={() => router.back()}
                className="glass-button px-6 py-2 rounded-lg"
              >
                Kembali
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="glass-button px-6 py-2 rounded-lg"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      <Header />
      
      <div className="container-responsive pt-8">
        {/* Surah Header */}
        <div className="glass-card p-6 md:p-8 mb-8">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 glass-button px-4 py-2 rounded-lg hover-lift"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Kembali</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="glass-button p-2 rounded-lg hover-lift"
              >
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleShare}
                className="glass-button p-2 rounded-lg hover-lift"
              >
                <ShareIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Surah Info */}
          <div className="text-center">
            <h1 className="text-arabic-responsive text-emerald-400 font-bold mb-4">
              {surahDetail.nama}
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {surahDetail.namaLatin}
            </h2>
            <p className="text-lg text-white/70 mb-6">{surahDetail.arti}</p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
              <span className="flex items-center space-x-1">
                <BookOpenIcon className="w-4 h-4" />
                <span>{surahDetail.jumlahAyat} ayat</span>
              </span>
              <span>{surahDetail.tempatTurun}</span>
              <span>No. {surahDetail.nomor}</span>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="flex justify-center mt-6">
            <button 
              onClick={handlePlayFullSurah}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all hover-lift ${
                isPlayingFullSurah && audio.isPlaying 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'glass-button'
              }`}
            >
              {isPlayingFullSurah && audio.isPlaying ? (
                <PauseIcon className="w-5 h-5" />
              ) : (
                <SpeakerWaveIcon className="w-5 h-5" />
              )}
              <span>
                {isPlayingFullSurah && audio.isPlaying 
                  ? 'Jeda Surat Lengkap' 
                  : 'Putar Surat Lengkap'
                }
              </span>
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="glass-card p-6 mb-8 animation-fade-in">
            <h3 className="text-lg font-semibold text-white mb-4">Pengaturan Bacaan</h3>
            
            <div className="flex items-center justify-between">
              <span className="text-white/80">Ukuran Font</span>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                  className="glass-button w-8 h-8 rounded-full flex items-center justify-center hover-lift"
                >
                  -
                </button>
                <span className="text-white w-12 text-center">{fontSize}px</span>
                <button
                  onClick={() => setFontSize(Math.min(32, fontSize + 2))}
                  className="glass-button w-8 h-8 rounded-full flex items-center justify-center hover-lift"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Between Surahs */}
        <div className="flex items-center justify-between mb-8">
          {surahDetail.suratSebelumnya ? (
            <button
              onClick={() => router.push(`/surat/${surahDetail.suratSebelumnya!.nomor}`)}
              className="flex items-center space-x-2 glass-button px-4 py-2 rounded-lg hover-lift"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <div className="text-left">
                <div className="text-xs text-white/60">Sebelumnya</div>
                <div className="text-sm font-medium">{surahDetail.suratSebelumnya.namaLatin}</div>
              </div>
            </button>
          ) : <div />}
          
          {surahDetail.suratSelanjutnya ? (
            <button
              onClick={() => router.push(`/surat/${surahDetail.suratSelanjutnya!.nomor}`)}
              className="flex items-center space-x-2 glass-button px-4 py-2 rounded-lg hover-lift"
            >
              <div className="text-right">
                <div className="text-xs text-white/60">Selanjutnya</div>
                <div className="text-sm font-medium">{surahDetail.suratSelanjutnya.namaLatin}</div>
              </div>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          ) : <div />}
        </div>

        {/* Full Surah Progress Indicator */}
        {isPlayingFullSurah && (
          <div className="glass-card p-4 mb-6 animation-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-emerald-400 font-medium">
                🎵 Memutar Surat Lengkap
              </span>
              <span className="text-xs text-white/60">
                {currentPlayingAyah ? `Ayat ${currentPlayingAyah} / ${surahDetail.jumlahAyat}` : ''}
              </span>
            </div>
            {currentPlayingAyah && (
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(currentPlayingAyah / surahDetail.jumlahAyat) * 100}%` 
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Ayah List */}
        <div className="space-y-6">
          {surahDetail.ayat.map((ayah) => (
            <AyahCard
              key={ayah.nomorAyat}
              ayah={ayah}
              surahNumber={surahId}
              isPlaying={currentPlayingAyah === ayah.nomorAyat && audio.isPlaying}
              onPlayToggle={() => handlePlayAyah(ayah.nomorAyat)}
            />
          ))}
        </div>
      </div>

      {/* Audio Player */}
      {currentPlayingAyah && (
        <AudioPlayer
          surahName={`${surahDetail.namaLatin} - ${surahDetail.arti}${isPlayingFullSurah ? ' (Full Surah)' : ''}`}
          ayahNumber={currentPlayingAyah}
          audioUrl={getCurrentAudioUrl()}
          onNext={handleNextAyah}
          onPrevious={handlePreviousAyah}
          isFullSurahMode={isPlayingFullSurah}
        />
      )}
    </div>
  );
}