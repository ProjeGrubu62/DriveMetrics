'use client';

import { useRouter } from 'next/navigation';
import ManualDataEntry from '../components/ManualDataEntry';
import { ManualDriveData } from '../types';

export default function ManualEntryPage() {
  const router = useRouter();

  const handleDataSubmit = (data: ManualDriveData) => {
    // Veriyi localStorage'a kaydet
    localStorage.setItem('manualDriveData', JSON.stringify(data));
    // Analiz sayfasına yönlendir
    router.push('/analysis');
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Manuel Veri Girişi</h1>
      <ManualDataEntry onDataSubmit={handleDataSubmit} />
    </div>
  );
}