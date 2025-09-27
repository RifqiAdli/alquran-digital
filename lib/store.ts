'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Surah, Ayah, SurahDetail } from './api';

interface AudioState {
  isPlaying: boolean;
  currentSurah: number | null;
  currentAyah: number | null;
  currentQari: string;
  isLoading: boolean;
  volume: number;
  playbackRate: number;
  repeatMode: 'none' | 'ayah' | 'surah';
  audioElement: HTMLAudioElement | null;
}

interface BookmarkState {
  bookmarkedSurah: number[];
  bookmarkedAyah: Array<{ surah: number; ayah: number }>;
  lastRead: { surah: number; ayah: number } | null;
}

interface AppState {
  // Audio state
  audio: AudioState;
  
  // Bookmark state  
  bookmarks: BookmarkState;
  
  // UI state
  searchQuery: string;
  selectedQari: string;
  showTafsir: boolean;
  fontSize: number;
  
  // Data
  surahList: Surah[];
  currentSurahDetail: SurahDetail | null;
  
  // Actions
  setAudioState: (state: Partial<AudioState>) => void;
  toggleBookmarkSurah: (surahId: number) => void;
  toggleBookmarkAyah: (surahId: number, ayahId: number) => void;
  setLastRead: (surahId: number, ayahId: number) => void;
  setSearchQuery: (query: string) => void;
  setSelectedQari: (qari: string) => void;
  toggleTafsir: () => void;
  setFontSize: (size: number) => void;
  setSurahList: (list: Surah[]) => void;
  setCurrentSurahDetail: (detail: SurahDetail | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      audio: {
        isPlaying: false,
        currentSurah: null,
        currentAyah: null,
        currentQari: '05', // Default to Misyary Rasyid Al-Afasy
        isLoading: false,
        volume: 0.8,
        playbackRate: 1.0,
        repeatMode: 'none',
        audioElement: null,
      },
      
      bookmarks: {
        bookmarkedSurah: [],
        bookmarkedAyah: [],
        lastRead: null,
      },
      
      searchQuery: '',
      selectedQari: '05',
      showTafsir: false,
      fontSize: 18,
      surahList: [],
      currentSurahDetail: null,
      
      // Actions
      setAudioState: (newState) => 
        set((state) => ({ 
          audio: { ...state.audio, ...newState } 
        })),
      
      toggleBookmarkSurah: (surahId) =>
        set((state) => ({
          bookmarks: {
            ...state.bookmarks,
            bookmarkedSurah: state.bookmarks.bookmarkedSurah.includes(surahId)
              ? state.bookmarks.bookmarkedSurah.filter(id => id !== surahId)
              : [...state.bookmarks.bookmarkedSurah, surahId]
          }
        })),
      
      toggleBookmarkAyah: (surahId, ayahId) =>
        set((state) => {
          const existingIndex = state.bookmarks.bookmarkedAyah.findIndex(
            bookmark => bookmark.surah === surahId && bookmark.ayah === ayahId
          );
          
          return {
            bookmarks: {
              ...state.bookmarks,
              bookmarkedAyah: existingIndex !== -1
                ? state.bookmarks.bookmarkedAyah.filter((_, index) => index !== existingIndex)
                : [...state.bookmarks.bookmarkedAyah, { surah: surahId, ayah: ayahId }]
            }
          };
        }),
      
      setLastRead: (surahId, ayahId) =>
        set((state) => ({
          bookmarks: {
            ...state.bookmarks,
            lastRead: { surah: surahId, ayah: ayahId }
          }
        })),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedQari: (qari) => set({ selectedQari: qari }),
      toggleTafsir: () => set((state) => ({ showTafsir: !state.showTafsir })),
      setFontSize: (size) => set({ fontSize: size }),
      setSurahList: (list) => set({ surahList: list }),
      setCurrentSurahDetail: (detail) => set({ currentSurahDetail: detail }),
    }),
    {
      name: 'quran-app-storage',
      partialize: (state) => ({
        bookmarks: state.bookmarks,
        selectedQari: state.selectedQari,
        fontSize: state.fontSize,
      }),
    }
  )
);