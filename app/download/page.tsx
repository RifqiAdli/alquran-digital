// pages/download/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import {
  CloudArrowDownIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  CpuChipIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import Header from '@/components/layout/Header';

export default function Download() {
  const router = useRouter();

  const downloadOptions = [
    {
      platform: 'Windows',
      icon: ComputerDesktopIcon,
      version: '1.0.0',
      size: '70 MB',
      requirements: ['Windows 10/11 64-bit', '4GB RAM', '100MB Storage'],
      downloadUrl: 'https://github.com/RifqiAdli/alquran-digital/releases/download/Windows/Al-Quran-Ku-Setup.exe',
      description: 'Aplikasi desktop lengkap dengan semua fitur',
      recommended: true,
      installType: 'Installer (.exe)',
      lastUpdated: '15 September 2024'
    },
    {
      platform: 'Windows Portable',
      icon: DocumentArrowDownIcon,
      version: '1.0.0',
      size: '42 MB',
      requirements: ['Windows 10/11 64-bit', '4GB RAM', '100MB Storage'],
      downloadUrl: '#',
      description: 'Versi portable tanpa instalasi, langsung jalankan',
      recommended: false,
      installType: 'Portable (.zip)',
      lastUpdated: 'Coming Soon',
      comingSoon : true
    },
    {
      platform: 'Android',
      icon: DevicePhoneMobileIcon,
      version: '1.0.0',
      size: '25 MB',
      requirements: ['Android 7.0+', '2GB RAM', '50MB Storage'],
      downloadUrl: '#',
      description: 'Aplikasi mobile untuk Android (Coming Soon)',
      recommended: false,
      installType: 'APK File',
      lastUpdated: 'Coming Soon',
      comingSoon: true
    }
  ];

  const features = [
    'Al-Quran 30 Juz lengkap',
    'Terjemahan Bahasa Indonesia',
    'Audio bacaan multiple qori',
    'Pencarian ayat cepat',
    'Bookmark & catatan pribadi',
    'Mode gelap & terang',
    'Offline setelah download'
  ];

  const systemRequirements = {
    minimum: [
      'Windows 10 64-bit atau lebih baru',
      'Processor Intel/AMD 1.5GHz',
      'RAM 2GB',
      'Storage 100MB ruang kosong',
      'DirectX 11 compatible'
    ],
    recommended: [
      'Windows 11 64-bit',
      'Processor Intel/AMD 2.5GHz',
      'RAM 4GB atau lebih',
      'Storage 200MB ruang kosong',
      'Koneksi internet untuk audio'
    ]
  };

  const installSteps = [
    {
      step: 1,
      title: 'Download Installer',
      description: 'Klik tombol download dan simpan file installer'
    },
    {
      step: 2,
      title: 'Jalankan Installer',
      description: 'Double-click file Al-Quran-Ku-Setup.exe'
    },
    {
      step: 3,
      title: 'Ikuti Panduan',
      description: 'Ikuti wizard instalasi sampai selesai'
    },
    {
      step: 4,
      title: 'Mulai Menggunakan',
      description: 'Aplikasi siap digunakan dari Start Menu'
    }
  ];

  return (
    <div className="min-h-screen pb-32">
      <Header />
      
      {/* Back Button */}
      <div className="container-responsive pt-8">
        <button
          onClick={() => router.back()}
          className="glass-button p-3 rounded-lg mb-6 flex items-center space-x-2"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Kembali</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="container-responsive pt-4 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CloudArrowDownIcon className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
            Download Al-Quran Digital
          </h1>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8">
            Unduh aplikasi Al-Quran Digital gratis dan mulai perjalanan spiritual Anda. 
            Tersedia untuk Windows dengan fitur lengkap offline.
          </p>
          
          <div className="glass-card p-6">
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-white/70">
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
                <span>100% Gratis</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                <span>Tanpa Iklan</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                <span>Open Source</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                <span>Tidak Perlu Internet</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download Options */}
      <section className="container-responsive pb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Pilih Platform Download
        </h2>
        
        <div className="grid gap-8 max-w-4xl mx-auto">
          {downloadOptions.map((option, index) => (
            <div key={index} className={`glass-card p-8 relative overflow-hidden ${option.recommended ? 'ring-2 ring-emerald-500/50' : ''}`}>
              {option.recommended && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1 text-sm font-bold">
                  Direkomendasikan
                </div>
              )}
              
              {option.comingSoon && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 text-sm font-bold">
                  Coming Soon
                </div>
              )}
              
              <div className="grid md:grid-cols-3 gap-6 items-center">
                {/* Platform Info */}
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg flex items-center justify-center">
                      <option.icon className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{option.platform}</h3>
                      <p className="text-white/70">{option.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-white/50 text-sm">Versi</span>
                      <p className="text-white font-semibold">{option.version}</p>
                    </div>
                    <div>
                      <span className="text-white/50 text-sm">Ukuran</span>
                      <p className="text-white font-semibold">{option.size}</p>
                    </div>
                    <div>
                      <span className="text-white/50 text-sm">Tipe</span>
                      <p className="text-white font-semibold">{option.installType}</p>
                    </div>
                    <div>
                      <span className="text-white/50 text-sm">Update</span>
                      <p className="text-white font-semibold">{option.lastUpdated}</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-white/50 text-sm mb-2 block">System Requirements:</span>
                    <ul className="space-y-1">
                      {option.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-center space-x-2 text-sm text-white/70">
                          <CheckCircleIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Download Button */}
                <div className="text-center">
                  {option.comingSoon ? (
                    <button 
                      disabled
                      className="w-full bg-gray-600 text-gray-400 py-4 px-6 rounded-lg cursor-not-allowed"
                    >
                      <CloudArrowDownIcon className="w-6 h-6 mx-auto mb-2" />
                      <span className="block font-bold">Coming Soon</span>
                    </button>
                  ) : (
                    <a 
                      href={option.downloadUrl}
                      className="block bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <CloudArrowDownIcon className="w-6 h-6 mx-auto mb-2" />
                      <span className="block font-bold">Download</span>
                      <span className="block text-sm opacity-90">{option.size}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Highlight */}
      <section className="container-responsive pb-16">
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Fitur Lengkap Al-Quran Digital
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-white/70">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Requirements */}
      <section className="container-responsive pb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          System Requirements
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="glass-card p-8">
            <div className="flex items-center space-x-3 mb-6">
              <CpuChipIcon className="w-8 h-8 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Minimum</h3>
            </div>
            
            <ul className="space-y-3">
              {systemRequirements.minimum.map((req, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-white/70">{req}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="glass-card p-8">
            <div className="flex items-center space-x-3 mb-6">
              <CpuChipIcon className="w-8 h-8 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">Recommended</h3>
            </div>
            
            <ul className="space-y-3">
              {systemRequirements.recommended.map((req, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-white/70">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Installation Guide */}
      <section className="container-responsive pb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Panduan Instalasi
        </h2>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {installSteps.map((step, index) => (
              <div key={index} className="glass-card p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{step.step}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-white/70">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Notice */}
      <section className="container-responsive pb-16">
        <div className="glass-card p-8">
          <div className="flex items-start space-x-4">
            <ShieldCheckIcon className="w-8 h-8 text-emerald-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Keamanan & Privasi</h3>
              <div className="space-y-3 text-white/70">
                <p>
                  <strong className="text-white">100% Aman:</strong> Aplikasi telah dipindai dengan 
                  multiple antivirus dan bebas dari malware atau virus.
                </p>
                <p>
                  <strong className="text-white">No Data Collection:</strong> Kami tidak mengumpulkan 
                  data pribadi atau tracking aktivitas pengguna.
                </p>
                <p>
                  <strong className="text-white">Open Source:</strong> Source code tersedia di GitHub 
                  untuk transparansi dan audit keamanan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="container-responsive">
        <div className="glass-card p-8 text-center">
          <ExclamationTriangleIcon className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Butuh Bantuan?
          </h2>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Jika mengalami masalah saat download atau instalasi, hubungi tim support kami 
            atau cek dokumentasi lengkap di GitHub.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="mailto:support@quran.vredeburgstudio.site"
              className="glass-button px-6 py-3 rounded-lg"
            >
              Email Support
            </a>
            <a 
              href="#"
              className="glass-button px-6 py-3 rounded-lg"
            >
              GitHub Repository
            </a>
            <a 
              href="/docs"
              className="glass-button px-6 py-3 rounded-lg"
            >
              Dokumentasi
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}