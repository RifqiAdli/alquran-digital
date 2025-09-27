const BASE_URL = 'https://equran.id/api/v2';

export interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  arti: string;
  jumlahAyat: number;
  tempatTurun: string;
  audioFull?: { [key: string]: string };
}

export interface Ayah {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: { [key: string]: string };
}

export interface SurahDetail {
  nomor: number;
  nama: string;
  namaLatin: string;
  arti: string;
  jumlahAyat: number;
  tempatTurun: string;
  audioFull: { [key: string]: string };
  suratSelanjutnya?: { nomor: number; nama: string; namaLatin: string };
  suratSebelumnya?: { nomor: number; nama: string; namaLatin: string };
  ayat: Ayah[];
}

export interface Tafsir {
  ayat: number;
  tafsir: string;
}

export interface SurahTafsir {
  nomor: number;
  nama: string;
  namaLatin: string;
  arti: string;
  tafsir: Tafsir[];
}

// Available Qari
export const QARI_OPTIONS = {
  '01': 'Abdullah Al-Juhany',
  '02': 'Abdul Muhsin Al-Qasim', 
  '03': 'Abdurrahman As-Sudais',
  '04': 'Ibrahim Al-Dossari',
  '05': 'Misyary Rasyid Al-Afasy'
};

export const DEFAULT_QARI = '05'; // Misyary Rasyid Al-Afasy

class QuranAPI {
  private async fetchData<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || data;
  }

  async getSurahList(): Promise<Surah[]> {
    return this.fetchData<Surah[]>('/surat');
  }

  async getSurahDetail(nomor: number): Promise<SurahDetail> {
    return this.fetchData<SurahDetail>(`/surat/${nomor}`);
  }

  async getSurahTafsir(nomor: number): Promise<SurahTafsir> {
    return this.fetchData<SurahTafsir>(`/tafsir/${nomor}`);
  }

  // Search functionality
  searchSurah(surahList: Surah[], query: string): Surah[] {
    const lowercaseQuery = query.toLowerCase();
    return surahList.filter(surah => 
      surah.namaLatin.toLowerCase().includes(lowercaseQuery) ||
      surah.nama.includes(query) ||
      surah.arti.toLowerCase().includes(lowercaseQuery) ||
      surah.nomor.toString() === query
    );
  }

  // Filter by Makkiyah/Madaniyah
  filterByLocation(surahList: Surah[], location: string): Surah[] {
    return surahList.filter(surah => 
      surah.tempatTurun.toLowerCase() === location.toLowerCase()
    );
  }

  // Get audio URL for specific qari
  getAudioUrl(audio: { [key: string]: string }, qari: string = DEFAULT_QARI): string {
    return audio[qari] || audio[DEFAULT_QARI] || '';
  }
}

export const quranAPI = new QuranAPI();