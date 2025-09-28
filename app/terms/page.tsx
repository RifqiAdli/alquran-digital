// pages/terms/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import {
  DocumentTextIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import Header from '@/components/layout/Header';

export default function Terms() {
  const router = useRouter();

  const termsData = [
    {
      title: 'Penerimaan Syarat dan Ketentuan',
      content: [
        'Dengan menggunakan aplikasi Al-Quran Digital, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini.',
        'Jika Anda tidak setuju dengan syarat dan ketentuan ini, harap tidak menggunakan aplikasi kami.',
        'Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya.',
      ]
    },
    {
      title: 'Penggunaan Aplikasi',
      content: [
        'Aplikasi ini disediakan untuk membantu dalam membaca, mempelajari, dan memahami Al-Quran.',
        'Anda dilarang menggunakan aplikasi ini untuk tujuan yang melanggar hukum atau merugikan pihak lain.',
        'Anda bertanggung jawab untuk menjaga keamanan akun dan data pribadi Anda.',
        'Dilarang melakukan reverse engineering, decompile, atau disassemble aplikasi.',
      ]
    },
    {
      title: 'Konten dan Kekayaan Intelektual',
      content: [
        'Teks Al-Quran adalah kitab suci yang tidak memiliki hak cipta dan bebas digunakan untuk tujuan ibadah.',
        'Terjemahan yang digunakan mengikuti terjemahan resmi Kementerian Agama Republik Indonesia.',
        'Desain aplikasi, antarmuka, dan kode program dilindungi oleh hak cipta.',
        'Anda dilarang menyalin, mendistribusikan, atau memodifikasi konten aplikasi tanpa izin.',
      ]
    },
    {
      title: 'Privasi dan Data Pribadi',
      content: [
        'Kami menghormati privasi Anda dan berkomitmen melindungi data pribadi.',
        'Data yang dikumpulkan hanya digunakan untuk meningkatkan pengalaman pengguna.',
        'Kami tidak akan membagikan data pribadi kepada pihak ketiga tanpa persetujuan.',
        'Data bookmark dan progres bacaan disimpan secara lokal di perangkat Anda.',
      ]
    },
    {
      title: 'Batasan Tanggung Jawab',
      content: [
        'Aplikasi disediakan "sebagaimana adanya" tanpa jaminan dalam bentuk apapun.',
        'Kami tidak bertanggung jawab atas kerusakan atau kerugian yang timbul dari penggunaan aplikasi.',
        'Kami tidak menjamin ketersediaan aplikasi secara terus-menerus tanpa gangguan.',
        'Untuk interpretasi religious, silakan konsultasi dengan ulama atau ahli agama terpercaya.',
      ]
    },
    {
      title: 'Pemutusan Layanan',
      content: [
        'Kami berhak menghentikan atau menangguhkan akses Anda tanpa pemberitahuan sebelumnya.',
        'Pemutusan dapat dilakukan jika Anda melanggar syarat dan ketentuan ini.',
        'Setelah pemutusan, semua hak dan lisensi yang diberikan akan berakhir.',
      ]
    },
  ];

  const guidelines = [
    {
      icon: CheckCircleIcon,
      title: 'Diperbolehkan',
      items: [
        'Menggunakan aplikasi untuk ibadah dan pembelajaran',
        'Menyimpan bookmark dan catatan pribadi',
        'Berbagi ayat melalui fitur share',
        'Menggunakan offline setelah download',
      ],
      type: 'allowed'
    },
    {
      icon: XCircleIcon,
      title: 'Tidak Diperbolehkan',
      items: [
        'Menggunakan untuk tujuan komersial tanpa izin',
        'Memodifikasi atau mengubah konten',
        'Menyalin kode aplikasi atau desain',
        'Menggunakan untuk menyebarkan konten negatif',
      ],
      type: 'forbidden'
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
            <DocumentTextIcon className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
            Syarat & Ketentuan
          </h1>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8">
            Silakan baca syarat dan ketentuan penggunaan Al-Quran Digital dengan seksama 
            sebelum menggunakan aplikasi ini.
          </p>
          
          <div className="glass-card p-6">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <InformationCircleIcon className="w-6 h-6 text-blue-400" />
              <span className="text-white font-semibold">Terakhir diperbarui</span>
            </div>
            <p className="text-white/70">15 September 2024</p>
          </div>
        </div>
      </section>

      {/* Quick Guidelines */}
      <section className="container-responsive pb-16">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {guidelines.map((guideline, index) => (
            <div key={index} className="glass-card p-8">
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                  guideline.type === 'allowed' 
                    ? 'bg-emerald-500/20' 
                    : 'bg-red-500/20'
                }`}>
                  <guideline.icon className={`w-6 h-6 ${
                    guideline.type === 'allowed' 
                      ? 'text-emerald-400' 
                      : 'text-red-400'
                  }`} />
                </div>
                <h3 className="text-xl font-bold text-white">{guideline.title}</h3>
              </div>
              
              <ul className="space-y-3">
                {guideline.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      guideline.type === 'allowed' 
                        ? 'bg-emerald-400' 
                        : 'bg-red-400'
                    }`}></div>
                    <span className="text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Terms */}
      <section className="container-responsive pb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Syarat dan Ketentuan Lengkap
        </h2>
        
        <div className="space-y-8">
          {termsData.map((section, index) => (
            <div key={index} className="glass-card p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-400 font-bold">{index + 1}</span>
                </div>
                <h3 className="text-2xl font-bold text-white">{section.title}</h3>
              </div>
              
              <div className="ml-14 space-y-4">
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-white/70 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Important Notice */}
      <section className="container-responsive pb-16">
        <div className="glass-card p-8">
          <div className="flex items-start space-x-4 mb-6">
            <ExclamationTriangleIcon className="w-8 h-8 text-amber-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Pemberitahuan Penting</h3>
              <div className="space-y-4 text-white/70">
                <p>
                  <strong className="text-white">Tentang Konten Religi:</strong> Meskipun kami berusaha menyediakan 
                  terjemahan dan tafsir yang akurat, kami menyarankan Anda untuk selalu berkonsultasi 
                  dengan ulama atau ahli agama terpercaya untuk interpretasi yang lebih mendalam.
                </p>
                <p>
                  <strong className="text-white">Tentang Akurasi:</strong> Kami berusaha memastikan akurasi 
                  teks Al-Quran, namun jika Anda menemukan kesalahan, harap laporkan kepada kami untuk 
                  perbaikan segera.
                </p>
                <p>
                  <strong className="text-white">Tentang Pembaruan:</strong> Syarat dan ketentuan ini dapat 
                  berubah sewaktu-waktu. Pembaruan akan dinotifikasi melalui aplikasi atau email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact for Questions */}
      <section className="container-responsive">
        <div className="glass-card p-8 text-center">
          <ShieldCheckIcon className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Ada Pertanyaan?
          </h2>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, atau memerlukan 
            klarifikasi lebih lanjut, jangan ragu untuk menghubungi tim kami.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="mailto:legal@quran.vredeburgstudio.site"
              className="glass-button px-6 py-3 rounded-lg"
            >
              Email Legal Team
            </a>
            <a 
              href="mailto:support@quran.vredeburgstudio.site"
              className="glass-button px-6 py-3 rounded-lg"
            >
              Customer Support
            </a>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-white/50 text-sm">
              Dengan melanjutkan penggunaan aplikasi, Anda menyetujui syarat dan ketentuan di atas.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}