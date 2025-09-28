'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Surah, Ayah, SurahDetail, SurahTafsir } from './api';

// Cache utility class
class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private readonly DEFAULT_TTL = 1000 * 60 * 60; // 1 hour

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((item, key) => {
      if (now - item.timestamp > item.ttl) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => {
      this.cache.delete(key);
    });
  }
}

const cacheManager = new CacheManager();

// Loading state manager to prevent duplicate requests
const loadingStates = new Map<string, Promise<any>>();

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

interface CacheState {
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

interface AppState {
  // Audio state
  audio: AudioState;
  
  // Bookmark state  
  bookmarks: BookmarkState;
  
  // Cache state
  cache: CacheState;
  
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
  
  // Enhanced actions with caching
  loadSurahList: () => Promise<Surah[]>;
  loadSurahDetail: (surahId: number) => Promise<SurahDetail>;
  loadTafsir: (surahId: number, ayahId?: number) => Promise<SurahTafsir>;
  preloadSurahDetail: (surahId: number) => Promise<void>;
  preloadAdjacentSurahs: (currentSurahId: number) => Promise<void>;
  clearCache: () => void;
  getCachedSurahDetail: (surahId: number) => SurahDetail | null;
  searchSurah: (query: string) => Surah[];
  getAudioUrl: (audio: { [key: string]: string }, qari?: string) => string;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      audio: {
        isPlaying: false,
        currentSurah: null,
        currentAyah: null,
        currentQari: '05',
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

      cache: {
        isLoading: false,
        error: null,
        lastUpdated: null,
      },
      
      searchQuery: '',
      selectedQari: '05',
      showTafsir: false,
      fontSize: 18,
      surahList: [],
      currentSurahDetail: null,
      
      // Original Actions
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
      
      setLastRead: (surahId, ayahId) => {
        set((state) => ({
          bookmarks: {
            ...state.bookmarks,
            lastRead: { surah: surahId, ayah: ayahId }
          }
        }));
        
        // Auto preload adjacent surahs
        get().preloadAdjacentSurahs(surahId);
      },
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedQari: (qari) => set({ selectedQari: qari }),
      toggleTafsir: () => set((state) => ({ showTafsir: !state.showTafsir })),
      setFontSize: (size) => set({ fontSize: size }),
      setSurahList: (list) => set({ surahList: list }),
      setCurrentSurahDetail: (detail) => set({ currentSurahDetail: detail }),

      // Enhanced cached methods
      loadSurahList: async () => {
        const cacheKey = 'surah-list';
        
        // Check cache first
        const cached = cacheManager.get<Surah[]>(cacheKey);
        if (cached) {
          set({ surahList: cached });
          return cached;
        }

        // Check if already loading
        if (loadingStates.has(cacheKey)) {
          return loadingStates.get(cacheKey);
        }

        set((state) => ({ cache: { ...state.cache, isLoading: true, error: null } }));

        const loadPromise = (async () => {
          try {
            const response = await fetch('https://equran.id/api/v2/surat', {
              headers: {
                'Accept': 'application/json',
              },
            });
            
            if (!response.ok) {
              throw new Error(`Failed to fetch surah list: ${response.status}`);
            }
            
            const result = await response.json();
            const data: Surah[] = result.data || result;
            
            // Cache the result
            cacheManager.set(cacheKey, data, 1000 * 60 * 60 * 24); // 24 hours
            
            set({ 
              surahList: data,
              cache: { isLoading: false, error: null, lastUpdated: Date.now() }
            });
            
            // Preload popular surahs in background
            const popularSurahs = [1, 2, 18, 36, 55, 67, 112, 113, 114];
            popularSurahs.forEach(id => get().preloadSurahDetail(id));
            
            return data;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Gagal memuat daftar surat';
            set((state) => ({ 
              cache: { ...state.cache, isLoading: false, error: errorMessage }
            }));
            throw error;
          } finally {
            loadingStates.delete(cacheKey);
          }
        })();

        loadingStates.set(cacheKey, loadPromise);
        return loadPromise;
      },

      loadSurahDetail: async (surahId: number) => {
        const cacheKey = `surah-detail-${surahId}`;
        
        // Check cache first
        const cached = cacheManager.get<SurahDetail>(cacheKey);
        if (cached) {
          set({ currentSurahDetail: cached });
          return cached;
        }

        // Check if already loading
        if (loadingStates.has(cacheKey)) {
          return loadingStates.get(cacheKey);
        }

        set((state) => ({ cache: { ...state.cache, isLoading: true, error: null } }));

        const loadPromise = (async () => {
          try {
            const response = await fetch(`https://equran.id/api/v2/surat/${surahId}`, {
              headers: {
                'Accept': 'application/json',
              },
            });
            
            if (!response.ok) {
              throw new Error(`Failed to fetch surah ${surahId}: ${response.status}`);
            }
            
            const result = await response.json();
            const data: SurahDetail = result.data || result;
            
            // Cache the result
            cacheManager.set(cacheKey, data, 1000 * 60 * 60 * 6); // 6 hours
            
            set({ 
              currentSurahDetail: data,
              cache: { isLoading: false, error: null, lastUpdated: Date.now() }
            });
            
            // Auto-preload adjacent surahs
            get().preloadAdjacentSurahs(surahId);
            
            return data;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Gagal memuat detail surat';
            set((state) => ({ 
              cache: { ...state.cache, isLoading: false, error: errorMessage }
            }));
            throw error;
          } finally {
            loadingStates.delete(cacheKey);
          }
        })();

        loadingStates.set(cacheKey, loadPromise);
        return loadPromise;
      },

      loadTafsir: async (surahId: number, ayahId?: number) => {
        const cacheKey = ayahId ? `tafsir-${surahId}-${ayahId}` : `tafsir-${surahId}`;
        
        // Check cache first
        const cached = cacheManager.get<SurahTafsir>(cacheKey);
        if (cached) {
          return cached;
        }

        // Check if already loading
        if (loadingStates.has(cacheKey)) {
          return loadingStates.get(cacheKey);
        }

        const loadPromise = (async () => {
          try {
            const response = await fetch(`https://equran.id/api/v2/tafsir/${surahId}`, {
              headers: {
                'Accept': 'application/json',
              },
            });
            
            if (!response.ok) {
              throw new Error(`Failed to fetch tafsir ${surahId}: ${response.status}`);
            }
            
            const result = await response.json();
            const data: SurahTafsir = result.data || result;
            
            // Cache the result
            cacheManager.set(cacheKey, data, 1000 * 60 * 60 * 12); // 12 hours
            
            return data;
          } catch (error) {
            console.error(`Error loading tafsir ${surahId}:`, error);
            throw error;
          } finally {
            loadingStates.delete(cacheKey);
          }
        })();

        loadingStates.set(cacheKey, loadPromise);
        return loadPromise;
      },

      preloadSurahDetail: async (surahId: number) => {
        const cacheKey = `surah-detail-${surahId}`;
        
        // Don't preload if already cached or loading
        if (cacheManager.has(cacheKey) || loadingStates.has(cacheKey)) {
          return;
        }

        try {
          await get().loadSurahDetail(surahId);
        } catch (error) {
          console.error(`Error preloading surah ${surahId}:`, error);
        }
      },

      preloadAdjacentSurahs: async (currentSurahId: number) => {
        const promises = [];
        
        // Preload previous surah
        if (currentSurahId > 1) {
          promises.push(get().preloadSurahDetail(currentSurahId - 1));
        }
        
        // Preload next surah
        if (currentSurahId < 114) {
          promises.push(get().preloadSurahDetail(currentSurahId + 1));
        }

        await Promise.allSettled(promises);
      },

      getCachedSurahDetail: (surahId: number) => {
        return cacheManager.get<SurahDetail>(`surah-detail-${surahId}`);
      },

      searchSurah: (query: string) => {
        const { surahList } = get();
        if (!query.trim()) return surahList;
        
        const searchTerm = query.toLowerCase();
        return surahList.filter(surah => 
          surah.namaLatin.toLowerCase().includes(searchTerm) ||
          surah.nama.includes(query) ||
          surah.arti.toLowerCase().includes(searchTerm) ||
          surah.nomor.toString() === query
        );
      },

      clearCache: () => {
        cacheManager.clear();
        loadingStates.clear();
        set((state) => ({
          cache: { ...state.cache, lastUpdated: null }
        }));
      },

      getAudioUrl: (audio: { [key: string]: string }, qari?: string) => {
        const { selectedQari } = get();
        const targetQari = qari || selectedQari || '05';
        return audio[targetQari] || audio['05'] || '';
      },
    }),
    {
      name: 'quran-app-storage',
      partialize: (state) => ({
        bookmarks: state.bookmarks,
        selectedQari: state.selectedQari,
        fontSize: state.fontSize,
        surahList: state.surahList, // Cache surah list in localStorage
      }),
    }
  )
);

// Cleanup expired cache every 15 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    cacheManager.cleanup();
  }, 1000 * 60 * 15);
}