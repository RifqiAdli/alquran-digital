import { notFound } from 'next/navigation';
import SurahClient from './SurahClient';

interface SurahPageProps {
  params: { id: string };
}

// Server component untuk generateStaticParams
export async function generateStaticParams() {
  // Generate params untuk semua 114 surat
  return Array.from({ length: 114 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}

export default function SurahPage({ params }: SurahPageProps) {
  const surahId = parseInt(params.id);

  // Validasi surah ID di server component
  if (isNaN(surahId) || surahId < 1 || surahId > 114) {
    notFound();
  }

  // Pass ke client component
  return <SurahClient params={params} />;
}