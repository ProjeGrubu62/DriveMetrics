'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ManualDataEntry from '../../components/forms/ManualDataEntry';
import Header from '../components/Header';

export default function VehicleSetupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth?callbackUrl=/vehicle-setup');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Araç Seçimi</h1>
        <ManualDataEntry />
      </div>
    </>
  );
} 