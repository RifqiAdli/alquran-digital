'use client';

import { useState, useEffect, useRef } from 'react';
import {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  SpeakerWaveIcon,
  ArrowPathIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useAppStore } from '@/lib/store';
import { QARI_OPTIONS, DEFAULT_QARI, quranAPI } from '@/lib/api';

interface AudioPlayerProps {
  surahName?: string;
  ayahNumber?: number;
  audioUrl: string;
  onNext?: () => void;
  onPrevious?: () => void;
  isFullSurahMode?: boolean; // Add this prop to identify full surah mode
}

export default function AudioPlayer({ 
  surahName, 
  ayahNumber, 
  audioUrl,
  onNext,
  onPrevious,
  isFullSurahMode = false
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showQariMenu, setShowQariMenu] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  
  const { 
    audio, 
    setAudioState,
    selectedQari,
    setSelectedQari 
  } = useAppStore();

  // Auto-play when audioUrl changes and audio is supposed to be playing
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement || !audioUrl) return;

    const handleCanPlay = async () => {
      setIsBuffering(false);
      
      // Auto-play if audio state says it should be playing
      if (audio.isPlaying) {
        try {
          await audioElement.play();
        } catch (error) {
          console.error('Auto-play failed:', error);
          setAudioState({ isPlaying: false });
        }
      }
    };

    const handleLoadStart = () => {
      setIsBuffering(true);
    };

    const handleError = () => {
      setIsBuffering(false);
      setAudioState({ isPlaying: false });
      console.error('Audio loading error');
    };

    audioElement.addEventListener('canplay', handleCanPlay);
    audioElement.addEventListener('loadstart', handleLoadStart);
    audioElement.addEventListener('error', handleError);
    
    // Load new audio source
    audioElement.load();

    return () => {
      audioElement.removeEventListener('canplay', handleCanPlay);
      audioElement.removeEventListener('loadstart', handleLoadStart);
      audioElement.removeEventListener('error', handleError);
    };
  }, [audioUrl, audio.isPlaying, setAudioState]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const updateTime = () => setCurrentTime(audioElement.currentTime);
    const updateDuration = () => setDuration(audioElement.duration || 0);
    
    const handleEnded = () => {
      console.log('Audio ended. Repeat mode:', audio.repeatMode, 'Full surah mode:', isFullSurahMode);
      
      if (audio.repeatMode === 'ayah') {
        // Repeat current ayah
        audioElement.currentTime = 0;
        setTimeout(() => {
          audioElement.play().catch(console.error);
        }, 500);
      } else if (isFullSurahMode || audio.repeatMode === 'surah') {
        // Auto-continue to next ayah in full surah mode
        if (onNext) {
          console.log('Auto-continuing to next ayah in full surah mode...');
          setTimeout(() => {
            onNext();
          }, 800);
        } else {
          // No more ayahs, stop playing
          console.log('No more ayahs, stopping playback');
          setAudioState({ isPlaying: false });
        }
      } else {
        // For individual ayah playback, just stop
        console.log('Individual ayah ended, stopping playback');
        setAudioState({ isPlaying: false });
      }
    };

    const handlePause = () => {
      setAudioState({ isPlaying: false });
    };

    const handlePlay = () => {
      setAudioState({ isPlaying: true });
    };

    audioElement.addEventListener('timeupdate', updateTime);
    audioElement.addEventListener('loadedmetadata', updateDuration);
    audioElement.addEventListener('durationchange', updateDuration);
    audioElement.addEventListener('ended', handleEnded);
    audioElement.addEventListener('pause', handlePause);
    audioElement.addEventListener('play', handlePlay);

    return () => {
      audioElement.removeEventListener('timeupdate', updateTime);
      audioElement.removeEventListener('loadedmetadata', updateDuration);
      audioElement.removeEventListener('durationchange', updateDuration);
      audioElement.removeEventListener('ended', handleEnded);
      audioElement.removeEventListener('pause', handlePause);
      audioElement.removeEventListener('play', handlePlay);
    };
  }, [audio.repeatMode, onNext, setAudioState, isFullSurahMode]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audio.volume;
      audioRef.current.playbackRate = audio.playbackRate;
    }
  }, [audio.volume, audio.playbackRate]);

  const togglePlay = async () => {
    const audioElement = audioRef.current;
    if (!audioElement || !audioUrl) return;

    try {
      if (audio.isPlaying) {
        audioElement.pause();
      } else {
        setIsBuffering(true);
        await audioElement.play();
        setIsBuffering(false);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsBuffering(false);
      setAudioState({ isPlaying: false });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audioElement = audioRef.current;
    if (!audioElement || !duration) return;
    
    const time = (parseFloat(e.target.value) / 100) * duration;
    audioElement.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value) / 100;
    setAudioState({ volume });
  };

  const toggleRepeatMode = () => {
    const modes = ['none', 'ayah', 'surah'] as const;
    const currentIndex = modes.indexOf(audio.repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setAudioState({ repeatMode: nextMode });
  };

  const handleQariChange = (newQari: string) => {
    const wasPlaying = audio.isPlaying;
    const currentTimeBackup = currentTime;
    
    // Stop current audio
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    // Change qari
    setSelectedQari(newQari);
    setShowQariMenu(false);
    
    // If was playing, it will auto-resume with new qari due to useEffect
    if (wasPlaying) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = currentTimeBackup;
        }
      }, 100);
    }
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getRepeatIcon = () => {
    switch (audio.repeatMode) {
      case 'ayah':
        return <ArrowPathIcon className="w-5 h-5 text-emerald-400" />;
      case 'surah':
        return <ArrowPathIcon className="w-5 h-5 text-blue-400" />;
      default:
        return <ArrowPathIcon className="w-5 h-5 text-white/60" />;
    }
  };

  const progressPercent = duration && isFinite(duration) ? (currentTime / duration) * 100 : 0;

  return (
    <div className="floating-audio">
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
      />
      
      <div className="container-responsive">
        <div className="flex flex-col space-y-3">
          {/* Progress Bar */}
          <div className="flex items-center space-x-3 text-sm">
            <span className="text-white/60 w-12 text-right text-xs">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 relative">
              <div className="w-full h-2 bg-white/20 rounded-lg overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progressPercent}
                onChange={handleSeek}
                className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
              />
            </div>
            <span className="text-white/60 w-12 text-xs">
              {formatTime(duration)}
            </span>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-between">
            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white truncate text-sm md:text-base">
                {surahName || 'Al-Quran'}
                {ayahNumber && ` - Ayat ${ayahNumber}`}
              </h4>
              <p className="text-xs md:text-sm text-white/60 truncate">
                {QARI_OPTIONS[selectedQari as keyof typeof QARI_OPTIONS]}
                {isFullSurahMode && <span className="ml-2 text-emerald-400">• Full Surah</span>}
              </p>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center space-x-1 md:space-x-2 mx-2 md:mx-4">
              <button
                onClick={onPrevious}
                disabled={!onPrevious}
                className="p-2 rounded-lg glass-button disabled:opacity-50 hover-lift"
              >
                <BackwardIcon className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              
              <button
                onClick={togglePlay}
                disabled={isBuffering}
                className="p-2 md:p-3 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                {isBuffering ? (
                  <div className="w-5 h-5 md:w-6 md:h-6 animate-spin border-2 border-white border-t-transparent rounded-full" />
                ) : audio.isPlaying ? (
                  <PauseIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                ) : (
                  <PlayIcon className="w-5 h-5 md:w-6 md:h-6 text-white ml-0.5" />
                )}
              </button>
              
              <button
                onClick={onNext}
                disabled={!onNext}
                className="p-2 rounded-lg glass-button disabled:opacity-50 hover-lift"
              >
                <ForwardIcon className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            {/* Additional Controls */}
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleRepeatMode}
                className="p-2 rounded-lg glass-button hover-lift"
                title={`Repeat: ${audio.repeatMode}`}
              >
                {getRepeatIcon()}
              </button>
              
              <div className="relative hidden md:block">
                <button
                  onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                  className="p-2 rounded-lg glass-button hover-lift"
                >
                  <SpeakerWaveIcon className="w-5 h-5" />
                </button>
                
                {showVolumeSlider && (
                  <div className="absolute bottom-full right-0 mb-2 glass-card p-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={audio.volume * 100}
                      onChange={handleVolumeChange}
                      className="w-20 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                )}
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowQariMenu(!showQariMenu)}
                  className="flex items-center space-x-1 px-2 md:px-3 py-2 rounded-lg glass-button hover-lift"
                >
                  <span className="text-xs md:text-sm hidden sm:inline">Qari</span>
                  <ChevronDownIcon className="w-3 h-3 md:w-4 md:h-4" />
                </button>
                
                {showQariMenu && (
                  <div className="absolute bottom-full right-0 mb-2 w-48 glass-card overflow-hidden max-h-60 overflow-y-auto">
                    {Object.entries(QARI_OPTIONS).map(([id, name]) => (
                      <button
                        key={id}
                        onClick={() => handleQariChange(id)}
                        className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors text-sm ${
                          selectedQari === id ? 'bg-emerald-500/20 text-emerald-400' : ''
                        }`}
                      >
                        <div className="font-medium">{name}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}