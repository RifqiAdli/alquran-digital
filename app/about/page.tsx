// pages/about/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpenIcon,
  HeartIcon,
  UsersIcon,
  StarIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Header from '@/components/layout/Header';

export default function AboutUs() {
  const router = useRouter();

  const features = [
    {
      icon: BookOpenIcon,
      title: 'Teks Arab yang Otentik',
      description: 'Menggunakan mushaf Utsmani dengan teks Arab yang telah diverifikasi oleh para ulama',
    },
    {
      icon: GlobeAltIcon,
      title: 'Terjemahan yang Berkualitas',
      description: 'Terjemahan bahasa Indonesia dari Kementerian Agama RI yang akurat dan mudah dipahami',
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'Responsif & tampilan Modern',
      description: 'Desain yang responsif dan tampilan modern untuk pengalaman membaca yang nyaman di semua perangkat',
    },
    {
      icon: HeartIcon,
      title: 'Bookmark & Progres',
      description: 'Simpan ayat favorit dan lanjutkan bacaan dari halaman terakhir yang dibaca',
    },
  ];

  const team = [
    {
      name: 'Rifqi Adli Al Hafizh',
      role: 'Lead Developer & Founder',
      description: 'Seorang pelajar yang dimana memiliki pengalaman dalam pengembangan website kurang lebih 3+ Tahun.',
    },
    {
      name: 'Ahmed',
      role: 'Pemberi Ide & Saran',
      description: 'Pemberi saran terkait beberapa fitur yang ada di website.',
    },
    {
      name: 'Akid',
      role: 'Quality Check',
      description: 'Memperhatikan dan merevisi terkait adanya kualitas di website.',
    },
  ];

  const stats = [
    { label: 'Users Aktif', value: '10,000+', icon: UsersIcon },
    { label: 'Negara', value: '25+', icon: GlobeAltIcon },
    { label: 'Rating', value: '4.8/5', icon: StarIcon },
    { label: 'Download', value: '50,000+', icon: DevicePhoneMobileIcon },
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
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
            Tentang Kami
          </h1>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed">
            Al-Quran Digital adalah platform modern untuk membaca, mempelajari, dan menghafal Al-Quran 
            dengan teknologi terkini dan antarmuka yang indah serta mudah digunakan.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="glass-card p-6 text-center">
              <div className="flex justify-center mb-3">
                <stat.icon className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container-responsive pb-16">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="glass-card p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mr-4">
                <BookOpenIcon className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Misi Kami</h2>
            </div>
            <p className="text-white/70 leading-relaxed">
              Memudahkan umat Muslim di seluruh dunia untuk mengakses, membaca, dan mempelajari 
              Al-Quran melalui teknologi modern yang user-friendly, authentic, dan dapat diakses 
              kapan saja, di mana saja.
            </p>
          </div>

          <div className="glass-card p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center mr-4">
                <GlobeAltIcon className="w-6 h-6 text-teal-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Visi Kami</h2>
            </div>
            <p className="text-white/70 leading-relaxed">
              Menjadi platform digital Al-Quran terdepan yang menggabungkan keaslian teks suci 
              dengan kemudahan teknologi modern, membantu meningkatkan kualitas spiritual 
              umat Muslim global.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-responsive pb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Fitur Unggulan
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="glass-card p-6 flex space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="container-responsive pb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Tim Pengembang
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="glass-card p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
              <p className="text-emerald-400 text-sm mb-3">{member.role}</p>
              <p className="text-white/70 text-sm">{member.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="container-responsive pb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Nilai-Nilai Kami
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-card p-8 text-center">
            <CheckCircleIcon className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-4">Keaslian</h3>
            <p className="text-white/70">
              Menjaga keaslian teks Al-Quran dengan menggunakan sumber-sumber yang telah 
              diverifikasi oleh para ulama terpercaya.
            </p>
          </div>
          
          <div className="glass-card p-8 text-center">
            <HeartIcon className="w-12 h-12 text-teal-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-4">Kemudahan</h3>
            <p className="text-white/70">
              Menghadirkan pengalaman yang mudah dan nyaman bagi semua kalangan dalam 
              mengakses dan mempelajari Al-Quran.
            </p>
          </div>
          
          <div className="glass-card p-8 text-center">
            <GlobeAltIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-4">Aksesibilitas</h3>
            <p className="text-white/70">
              Memastikan Al-Quran dapat diakses oleh siapa saja, kapan saja, dan di mana saja 
              melalui berbagai perangkat digital.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="container-responsive">
        <div className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Hubungi Kami
          </h2>
          <p className="text-white/70 mb-6">
            Punya saran atau masukan? Kami sangat senang mendengar dari Anda!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="mailto:info@quran.vredeburgstudio.site"
              className="glass-button px-6 py-3 rounded-lg"
            >
              Email Kami
            </a>
            <a 
              href="https://instagram.com/rifqiadli_1"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button px-6 py-3 rounded-lg"
            >
              Instagram
            </a>
            <a 
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button px-6 py-3 rounded-lg"
            >
              Twitter
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}