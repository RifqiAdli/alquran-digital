'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  BookOpenIcon,
  BookmarkIcon,
  Cog6ToothIcon,
  HomeIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { useAppStore } from '@/lib/store';
import SearchModal from '../search/SearchModal';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { searchQuery, setSearchQuery } = useAppStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Beranda', href: '/', icon: HomeIcon },
    { name: 'Surat', href: '/surat', icon: BookOpenIcon },
    { name: 'Bookmark', href: '/bookmark', icon: BookmarkIcon },
  ];

  const additionalPages = [
    { name: 'Tentang Kami', href: '/about', icon: UserGroupIcon },
    { name: 'Syarat & Ketentuan', href: '/terms', icon: DocumentTextIcon },
    { name: 'Kebijakan Privasi', href: '/privacy', icon: ShieldCheckIcon },
  ];

  return (
    <>
      <header className={`
        sticky top-0 z-40 w-full transition-all duration-300
        ${isScrolled ? 'glass-card border-b border-white/20' : 'bg-transparent'}
      `}>
        <nav className="container-responsive">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 glass-card flex items-center justify-center">
                <BookOpenIcon className="w-6 h-6 md:w-7 md:h-7 text-emerald-400" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold gradient-text">
                  Al-Quran Digital
                </h1>
                <p className="text-xs text-white/60">Modern & Responsive</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              
              {/* About Us Dropdown for Desktop */}
              <div className="relative group">
                <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300">
                  <InformationCircleIcon className="w-5 h-5" />
                  <span className="font-medium">Info</span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-2 w-56 glass-card border border-white/20 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  {additionalPages.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium text-sm">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-lg glass-button"
                aria-label="Cari"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>

              {/* Settings Button - Desktop */}
              <button 
                className="hidden md:block p-2 rounded-lg glass-button"
                aria-label="Pengaturan"
              >
                <Cog6ToothIcon className="w-5 h-5" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg glass-button"
                aria-label="Menu"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          <div className="absolute top-0 right-0 h-full w-80 max-w-sm glass-card border-l border-white/20 animation-slide-up overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/20 sticky top-0 glass-card">
              <h2 className="text-xl font-semibold gradient-text">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg glass-button"
                aria-label="Tutup menu"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="p-6">
              <div className="space-y-2">
                {/* Main Navigation */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
                    Navigasi Utama
                  </h3>
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  ))}
                </div>
                
                {/* Additional Pages */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
                    Informasi
                  </h3>
                  {additionalPages.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  ))}
                </div>
                
                <hr className="border-white/20 my-4" />
                
                {/* Settings */}
                <button className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 w-full">
                  <Cog6ToothIcon className="w-5 h-5" />
                  <span className="font-medium">Pengaturan</span>
                </button>
              </div>
            </nav>

            {/* Footer in Mobile Menu */}
            <div className="p-6 border-t border-white/20 mt-auto">
              <div className="text-center">
                <p className="text-sm text-white/60 mb-2">Al-Quran Digital</p>
                <p className="text-xs text-white/40">
                  Membaca Al-Quran dengan teknologi modern
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
}