// pages/privacy/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import {
  ShieldCheckIcon,
  EyeIcon,
  ServerIcon,
  UserCircleIcon,
  DevicePhoneMobileIcon,
  ArrowLeftIcon,
  LockClosedIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import Header from '@/components/layout/Header';

export default function PrivacyPolicy() {
  const router = useRouter();

  const privacySections = [
    {
      title: 'Informasi yang Kami Kumpulkan',
      icon: UserCircleIcon,
      content: [
        'Data penggunaan aplikasi seperti surat yang dibaca dan waktu penggunaan',
        'Bookmark dan catatan pribadi yang Anda simpan',
        'Preferensi pengaturan aplikasi (tema, ukuran font, dll)',
        'Informasi perangkat seperti jenis device, sistem operasi, dan versi aplikasi',
        'Data lokasi umum (negara/kota) untuk statistik penggunaan regional',
      ]
    },
    {
      title: 'Bagaimana Kami Menggunakan Data',
      icon: EyeIcon,
      content: [
        'Menyediakan dan meningkatkan layanan aplikasi Al-Quran Digital',
        'Menyimpan progres bacaan dan bookmark untuk pengalaman yang personal',
        'Menganalisis pola penggunaan untuk pengembangan fitur baru',
        'Mengirimkan notifikasi penting tentang pembaruan aplikasi',
        'Memberikan dukungan teknis dan customer service',
      ]
    },
    {
      title: 'Penyimpanan dan Keamanan Data',
      icon: LockClosedIcon,
      content: [
        'Data bookmark dan progres disimpan secara lokal di perangkat Anda',
        'Data yang dikirim ke server dienkripsi menggunakan protokol HTTPS',
        'Kami tidak menyimpan informasi sensitif di server eksternal',
        'Backup data dapat dilakukan melalui cloud storage pilihan Anda',
        'Implementasi keamanan standar industri untuk melindungi data pengguna',
      ]
    },
    {
      title: 'Berbagi Data dengan Pihak Ketiga',
      icon: ServerIcon,
      content: [
        'Kami TIDAK menjual sama sekali atau menyewakan data pribadi Anda kepada pihak ketiga',
        'Data anonymous dapat dibagikan untuk analisis dan riset pengembangan',
        'Integrasi dengan layanan cloud storage (Google Drive, iCloud) sesuai pilihan Anda',
        'Berbagi terbatas dengan penyedia layanan teknis untuk maintenance aplikasi',
        'Kewajiban hukum dapat mengharuskan kami membagikan data dalam kondisi tertentu',
      ]
    },
    {
      title: 'Cookies',
      icon: EyeIcon,
      content: [
        'Menggunakan cookies untuk menyimpan preferensi dan pengaturan pengguna',
        'Analytics cookies untuk memahami penggunaan fitur aplikasi',
        'Session cookies untuk menjaga keamanan dan kinerja aplikasi',
        'Anda dapat mengelola preferensi cookies melalui pengaturan aplikasi',
        'Tidak menggunakan cookies untuk iklan atau pelacakan lintas platform',
      ]
    },
    {
      title: 'Hak-Hak Pengguna',
      icon: ShieldCheckIcon,
      content: [
        'Hak untuk mengakses data pribadi yang kami simpan',
        'Hak untuk memperbaiki atau memperbarui informasi yang tidak akurat',
        'Hak untuk menghapus data pribadi (right to be forgotten)',
        'Hak untuk membatasi pemrosesan data pribadi Anda',
        'Hak untuk memindahkan data ke layanan lain (data portability)',
      ]
    },
  ];

  const dataTypes = [
    {
      name: 'Data Wajib',
      icon: ExclamationTriangleIcon,
      description: 'Data minimal yang diperlukan untuk menjalankan aplikasi',
      items: ['Progres bacaan', 'Pengaturan aplikasi', 'Bookmark'],
      color: 'red'
    },
    {
      name: 'Data Opsional',
      icon: InformationCircleIcon,
      description: 'Data yang dapat Anda pilih untuk membagikan',
      items: ['Lokasi umum', 'Feedback penggunaan', 'Statistik bacaan'],
      color: 'blue'
    },
    {
      name: 'Data Lokal',
      icon: DevicePhoneMobileIcon,
      description: 'Data yang tersimpan hanya di perangkat Anda',
      items: ['Catatan pribadi', 'Riwayat pencarian', 'Cache Al-Quran'],
      color: 'emerald'
    }
  ];

  const contactInfo = [
    {
      title: 'Data Protection Officer',
      email: 'privacy@quran.vredeburgstudio.site',
      description: 'Untuk pertanyaan tentang kebijakan privasi dan perlindungan data'
    },
    {
      title: 'Customer Support',
      email: 'support@quran.vredeburgstudio.site',
      description: 'Untuk bantuan teknis dan pertanyaan umum'
    },
    {
      title: 'Legal Team',
      email: 'legal@quran.vredeburgstudio.site',
      description: 'Untuk masalah hukum dan kebijakan perusahaan'
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
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheckIcon className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
            Kebijakan Privasi
          </h1>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8">
            Kami berkomitmen untuk melindungi privasi dan keamanan data pribadi Anda. 
            Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.
          </p>
          
          <div className="glass-card p-6">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <InformationCircleIcon className="w-6 h-6 text-blue-400" />
              <span className="text-white font-semibold">Terakhir diperbarui</span>
            </div>
            <p className="text-white/70">20 September 2024</p>
          </div>
        </div>
      </section>

      {/* Data Types Overview */}
      <section className="container-responsive pb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Jenis Data yang Kami Kelola
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {dataTypes.map((dataType, index) => (
            <div key={index} className="glass-card p-6">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                  dataType.color === 'red' ? 'bg-red-500/20' :
                  dataType.color === 'blue' ? 'bg-blue-500/20' : 'bg-emerald-500/20'
                }`}>
                  <dataType.icon className={`w-6 h-6 ${
                    dataType.color === 'red' ? 'text-red-400' :
                    dataType.color === 'blue' ? 'text-blue-400' : 'text-emerald-400'
                  }`} />
                </div>
                <h3 className="text-xl font-bold text-white">{dataType.name}</h3>
              </div>
              
              <p className="text-white/70 text-sm mb-4">{dataType.description}</p>
              
              <ul className="space-y-2">
                {dataType.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start space-x-2">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      dataType.color === 'red' ? 'bg-red-400' :
                      dataType.color === 'blue' ? 'bg-blue-400' : 'bg-emerald-400'
                    }`}></div>
                    <span className="text-white/60 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Privacy Policy */}
      <section className="container-responsive pb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Kebijakan Privasi Lengkap
        </h2>
        
        <div className="space-y-8">
          {privacySections.map((section, index) => (
            <div key={index} className="glass-card p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">{section.title}</h3>
              </div>
              
              <div className="ml-16 space-y-3">
                {section.content.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-white/70 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GDPR Compliance */}
      <section className="container-responsive pb-16">
        <div className="glass-card p-8">
          <div className="flex items-start space-x-4 mb-6">
            <ShieldCheckIcon className="w-8 h-8 text-emerald-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Kepatuhan terhadap Regulasi</h3>
              <div className="space-y-4 text-white/70">
                <p>
                  <strong className="text-white">GDPR (General Data Protection Regulation):</strong> 
                  Kami mematuhi standar perlindungan data Eropa dan memberikan kontrol penuh 
                  kepada pengguna atas data pribadi mereka.
                </p>
                <p>
                  <strong className="text-white">Undang-Undang PDP Indonesia:</strong> 
                  Aplikasi kami mengikuti Undang-Undang Perlindungan Data Pribadi Republik Indonesia 
                  untuk memastikan keamanan data pengguna lokal.
                </p>
                <p>
                  <strong className="text-white">Transparansi Data:</strong> 
                  Kami berkomitmen untuk selalu transparan tentang bagaimana data Anda digunakan 
                  dan memberikan kontrol penuh kepada Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Retention */}
      <section className="container-responsive pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mr-4">
                <ServerIcon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Penyimpanan Data</h3>
            </div>
            <ul className="space-y-3 text-white/70">
              <li>• Data bookmark disimpan hingga Anda menghapusnya</li>
              <li>• Log penggunaan disimpan maksimal 12 bulan</li>
              <li>• Data analytics dianonimkan setelah 6 bulan</li>
              <li>• Cache aplikasi dibersihkan otomatis</li>
            </ul>
          </div>
          
          <div className="glass-card p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mr-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Penghapusan Data</h3>
            </div>
            <ul className="space-y-3 text-white/70">
              <li>• Anda dapat menghapus semua data kapan saja</li>
              <li>• Uninstall aplikasi menghapus data lokal</li>
              <li>• Permintaan penghapusan diproses dalam 30 hari</li>
              <li>• Backup dapat dihapus dari cloud storage</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="container-responsive pb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Hubungi Tim Pengelola Privasi Kami
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {contactInfo.map((contact, index) => (
            <div key={index} className="glass-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <EnvelopeIcon className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{contact.title}</h3>
              <a 
                href={`mailto:privacy@quran.vredeburgstudio.site`}
                className="text-blue-400 hover:text-blue-300 transition-colors mb-3 block"
              >
                {contact.email}
              </a>
              <p className="text-white/60 text-sm">{contact.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Notice */}
      <section className="container-responsive">
        <div className="glass-card p-8 text-center">
          <LockClosedIcon className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Komitmen Privasi Kami
          </h2>
          <p className="text-white/70 mb-6 max-w-3xl mx-auto">
            Privasi Anda adalah prioritas utama kami. Kami terus memperbarui dan meningkatkan 
            keamanan serta transparansi dalam pengelolaan data pribadi. Jika ada perubahan 
            signifikan pada kebijakan ini, kami akan memberitahu Anda melalui aplikasi.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a 
              href="mailto:privacy@quran.vredeburgstudio.site"
              className="glass-button px-6 py-3 rounded-lg"
            >
              Kontak Privacy Officer
            </a>
            <button
              onClick={() => router.push('/terms')}
              className="glass-button px-6 py-3 rounded-lg"
            >
              Lihat Syarat & Ketentuan
            </button>
          </div>
          
          <div className="pt-8 border-t border-white/10">
            <p className="text-white/50 text-sm">
              Dengan menggunakan Al-Quran Digital, Anda menyetujui kebijakan privasi ini.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}