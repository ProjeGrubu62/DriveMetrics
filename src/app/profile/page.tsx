'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Profil Bilgileri</h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Kullanıcı Bilgileri</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600">
                  <span className="font-medium">Ad Soyad:</span> {session?.user?.name}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">E-posta:</span> {session?.user?.email}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Sürüş İstatistikleri</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600">
                  <span className="font-medium">Toplam Sürüş:</span> 0
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Ortalama Puan:</span> 0
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 