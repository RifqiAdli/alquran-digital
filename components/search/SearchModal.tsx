'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  BookOpenIcon,
  ClockIcon,
  SparklesIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { useAppStore } from '@/lib/store';
import { quranAPI, Surah } from '@/lib/api';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RecentSearch {
  surahId: number;
  namaLatin: string;
  nama: string;
  timestamp: number;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Surah[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const { surahList, setSurahList } = useAppStore();

  // Popular surahs for suggestions
  const popularSurahs = [
    { id: 1, name: 'Al-Fatihah', arabic: 'الفاتحة' },
    { id: 2, name: 'Al-Baqarah', arabic: 'البقرة' },
    { id: 18, name: 'Al-Kahf', arabic: 'الكهف' },
    { id: 36, name: 'Yasin', arabic: 'يس' },
    { id: 55, name: 'Ar-Rahman', arabic: 'الرحمن' },
    { id: 67, name: 'Al-Mulk', arabic: 'الملك' },
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('quran_recent_searches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Load surah list
  useEffect(() => {
    const loadSurahList = async () => {
      if (surahList.length === 0) {
        try {
          const list = await quranAPI.getSurahList();
          setSurahList(list);
        } catch (error) {
          console.error('Error loading surah list:', error);
        }
      }
    };
    
    if (isOpen) {
      loadSurahList();
    }
  }, [isOpen, surahList, setSurahList]);

  // Search functionality with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(-1);
      setShowSuggestions(true);
      return;
    }

    setShowSuggestions(false);
    setIsLoading(true);
    
    const timeoutId = setTimeout(() => {
      const filteredResults = quranAPI.searchSurah(surahList, query);
      setResults(filteredResults.slice(0, 8)); // Limit to 8 results for better UX
      setSelectedIndex(-1);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, surahList]);

  // Save to recent searches
  const saveToRecent = useCallback((surah: Surah) => {
    const recentItem: RecentSearch = {
      surahId: surah.nomor,
      namaLatin: surah.namaLatin,
      nama: surah.nama,
      timestamp: Date.now(),
    };

    const updatedRecents = [
      recentItem,
      ...recentSearches.filter(item => item.surahId !== surah.nomor)
    ].slice(0, 5); // Keep only 5 recent searches

    setRecentSearches(updatedRecents);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('quran_recent_searches', JSON.stringify(updatedRecents));
    }
  }, [recentSearches]);

  const handleSurahSelect = (surahId: number) => {
    const surah = surahList.find(s => s.nomor === surahId);
    if (surah) {
      saveToRecent(surah);
    }
    router.push(`/surat/${surahId}`);
    onClose();
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const maxIndex = results.length - 1;
    
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < maxIndex ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSurahSelect(results[selectedIndex].nomor);
        }
        break;
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      selectedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  const clearRecentSearches = () => {
    setRecentSearches([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('quran_recent_searches');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl glass-card overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Search Header */}
        <div className="flex items-center p-4 border-b border-white/20">
          <div className="relative flex-1 flex items-center">
            <MagnifyingGlassIcon className="w-5 h-5 text-white/60 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Cari surat Al-Quran..."
              className="flex-1 bg-transparent text-white placeholder-white/60 outline-none text-lg"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <XMarkIcon className="w-4 h-4 text-white/60" />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors ml-2"
          >
            <XMarkIcon className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-white/60">Mencari surat...</p>
            </div>
          )}

          {/* Search Results */}
          {!isLoading && query.trim() && results.length > 0 && (
            <div className="p-2" ref={resultsRef}>
              <div className="text-xs text-white/40 px-3 py-2 font-medium">
                {results.length} surat ditemukan
              </div>
              <div className="space-y-1">
                {results.map((surah, index) => (
                  <button
                    key={surah.nomor}
                    onClick={() => handleSurahSelect(surah.nomor)}
                    className={`w-full flex items-center space-x-4 p-3 rounded-xl text-left transition-all duration-200 group ${
                      selectedIndex === index
                        ? 'bg-white/10 shadow-md scale-[1.02]'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${
                      selectedIndex === index
                        ? 'bg-emerald-500 text-white'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {surah.nomor}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-semibold text-white truncate">
                          {surah.namaLatin}
                        </h3>
                        <span className="arabic-text text-emerald-400 text-lg shrink-0">
                          {surah.nama}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-white/60">
                        <span className="truncate">{surah.arti}</span>
                        <span>•</span>
                        <span>{surah.jumlahAyat} ayat</span>
                        <span>•</span>
                        <span className="capitalize">{surah.tempatTurun}</span>
                      </div>
                    </div>
                    <ArrowRightIcon className={`w-5 h-5 transition-all duration-200 ${
                      selectedIndex === index
                        ? 'text-emerald-400 translate-x-1'
                        : 'text-white/40 group-hover:text-white/60'
                    }`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!isLoading && query.trim() && results.length === 0 && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <MagnifyingGlassIcon className="w-8 h-8 text-white/40" />
              </div>
              <p className="text-white/80 font-medium mb-2">
                Tidak ada surat yang ditemukan
              </p>
              <p className="text-sm text-white/60">
                Coba dengan kata kunci lain atau periksa ejaan
              </p>
            </div>
          )}

          {/* Recent Searches & Suggestions */}
          {showSuggestions && !query.trim() && (
            <div className="p-4 space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-4 h-4 text-white/60" />
                      <h3 className="text-sm font-semibold text-white/80">
                        Pencarian Terakhir
                      </h3>
                    </div>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-white/60 hover:text-red-400 transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((recent) => (
                      <button
                        key={recent.surahId}
                        onClick={() => handleSurahSelect(recent.surahId)}
                        className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 text-left transition-colors group"
                      >
                        <ClockIcon className="w-4 h-4 text-white/60" />
                        <span className="text-white/80 font-medium">
                          {recent.namaLatin}
                        </span>
                        <span className="arabic-text text-emerald-400 text-sm">
                          {recent.nama}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Suggestions */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <SparklesIcon className="w-4 h-4 text-white/60" />
                  <h3 className="text-sm font-semibold text-white/80">
                    Surat Populer
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {popularSurahs.map((surah) => (
                    <button
                      key={surah.id}
                      onClick={() => setQuery(surah.name)}
                      className="flex items-center space-x-2 p-3 rounded-lg border border-white/20 hover:border-emerald-400 hover:bg-white/10 transition-all group"
                    >
                      <span className="text-sm font-medium text-white/80 group-hover:text-emerald-400">
                        {surah.name}
                      </span>
                      <span className="arabic-text text-xs text-emerald-400">
                        {surah.arabic}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Tips */}
        <div className="px-4 py-3 bg-white/5 border-t border-white/20">
          <div className="flex items-center justify-between text-xs text-white/60">
            <div className="flex items-center space-x-4">
              <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-xs">
                ↑↓
              </kbd>
              <span>Navigasi</span>
              <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-xs">
                Enter
              </kbd>
              <span>Pilih</span>
            </div>
            <div className="flex items-center space-x-4">
              <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-xs">
                Esc
              </kbd>
              <span>Tutup</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}