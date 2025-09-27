'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import { useAppStore } from '@/lib/store';
import { quranAPI, Surah } from '@/lib/api';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Surah[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const { surahList, setSurahList } = useAppStore();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const filteredResults = quranAPI.searchSurah(surahList, query);
    setResults(filteredResults.slice(0, 10)); // Limit to 10 results
    setIsLoading(false);
  }, [query, surahList]);

  const handleSurahSelect = (surahId: number) => {
    router.push(`/surat/${surahId}`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl glass-card animation-fade-in">
        {/* Search Header */}
        <div className="flex items-center p-4 border-b border-white/20">
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
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {query.trim() && (
            <div className="p-2">
              {isLoading ? (
                <div className="p-8 text-center text-white/60">
                  <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full mx-auto mb-4" />
                  Mencari...
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((surah) => (
                    <button
                      key={surah.nomor}
                      onClick={() => handleSurahSelect(surah.nomor)}
                      className="w-full flex items-center space-x-4 p-3 rounded-lg hover:bg-white/10 text-left transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-semibold">
                        {surah.nomor}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-white">{surah.namaLatin}</h3>
                          <span className="arabic-text text-emerald-400">{surah.nama}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-white/60">
                          <span>{surah.arti}</span>
                          <span>•</span>
                          <span>{surah.jumlahAyat} ayat</span>
                          <span>•</span>
                          <span>{surah.tempatTurun}</span>
                        </div>
                      </div>
                      <BookOpenIcon className="w-5 h-5 text-white/40" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-white/60">
                  <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-4 text-white/40" />
                  <p>Tidak ada surat yang ditemukan</p>
                  <p className="text-sm mt-2">Coba dengan kata kunci lain</p>
                </div>
              )}
            </div>
          )}

          {!query.trim() && (
            <div className="p-8 text-center text-white/60">
              <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-4 text-white/40" />
              <p>Mulai mengetik untuk mencari surat</p>
              <p className="text-sm mt-2">Anda bisa mencari berdasarkan nama, nomor, atau arti surat</p>
            </div>
          )}
        </div>

        {/* Search Tips */}
        <div className="p-4 border-t border-white/20 text-xs text-white/40">
          <div className="flex flex-wrap gap-4">
            <span>Tips: Coba "Al-Fatihah", "Baqarah", atau nomor surat</span>
          </div>
        </div>
      </div>
    </div>
  );
}