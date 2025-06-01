'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Ride {
  id: string;
  startTime: string;
  averageSpeed: number;
  maxSpeed: number;
  fuelEfficiency: number;
}

export default function RidesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (status === 'authenticated') {
      fetchRides();
    }
  }, [status, router]);

  const fetchRides = async () => {
    try {
      const response = await fetch('/api/user/rides');
      if (!response.ok) {
        throw new Error('Sürüşler yüklenemedi');
      }
      const data = await response.json();
      setRides(data);
    } catch (error) {
      setError('Sürüşler yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Geçmiş Sürüşlerim</h1>
          <div className="text-center">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Geçmiş Sürüşlerim</h1>

        {error && (
          <div className="bg-red-900/50 text-red-200 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {rides.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            Henüz kaydedilmiş sürüşünüz bulunmuyor.
          </div>
        ) : (
          <div className="grid gap-6">
            {rides.map((ride) => (
              <div
                key={ride.id}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {new Date(ride.startTime).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </h3>
                    <div className="text-gray-400">
                      Ortalama Hız: {ride.averageSpeed} km/s
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-red-500">
                    {ride.fuelEfficiency}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 