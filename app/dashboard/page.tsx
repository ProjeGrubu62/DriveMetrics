'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User, UserProfile } from '@/app/types/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Gerçek uygulamada local storage veya session'dan kullanıcı bilgisi alınacak
    const mockUser = {
      id: '123',
      name: 'Test Kullanıcı',
      email: 'test@example.com',
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    };
    setUser(mockUser);

    const mockProfile = {
      userId: '123',
      driveHistory: [
        {
          driveId: '1',
          date: Date.now() - 86400000, // 1 gün önce
          vehicleId: 'vehicle1',
          performance: {
            overallScore: 85,
            clutchHealth: 90,
            fuelEfficiency: 80,
            smoothness: 85,
          },
        },
      ],
      statistics: {
        totalDrives: 1,
        totalDistance: 100,
        averageScore: 85,
        skillProgress: {
          clutchControl: 90,
          gearTransitions: 85,
          braking: 80,
          fuelEfficiency: 85,
        },
      },
    };
    setProfile(mockProfile);
  }, []);

  const startNewDrive = () => {
    router.push('/drive-setup'); // Veri giriş yöntemi seçim sayfasına yönlendir
  };

  const viewDriveDetails = (driveId: string) => {
    router.push(`/analysis?driveId=${driveId}`);
  };

  if (!user || !profile) {
    return <div className="p-8">Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hoş Geldin, {user.name}!</h1>
        <p className="text-gray-600">Sürüş becerilerini geliştirmeye devam et.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Sürüş İstatistikleri</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Toplam Sürüş</p>
              <p className="text-2xl font-bold">{profile.statistics.totalDrives}</p>
            </div>
            <div>
              <p className="text-gray-600">Toplam Mesafe</p>
              <p className="text-2xl font-bold">{profile.statistics.totalDistance} km</p>
            </div>
            <div>
              <p className="text-gray-600">Ortalama Puan</p>
              <p className="text-2xl font-bold">{profile.statistics.averageScore}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Beceri Gelişimi</h2>
          <div className="space-y-4">
            {Object.entries(profile.statistics.skillProgress).map(([skill, progress]) => (
              <div key={skill}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">{skill}</span>
                  <span className="font-semibold">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 rounded-full h-2"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <button
          onClick={startNewDrive}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Yeni Sürüş Başlat
        </button>
      </div>

      {profile.driveHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="text-xl font-semibold p-6 border-b">Geçmiş Sürüşler</h2>
          <div className="divide-y">
            {profile.driveHistory.map((drive) => (
              <div
                key={drive.driveId}
                className="p-6 hover:bg-gray-50 cursor-pointer"
                onClick={() => viewDriveDetails(drive.driveId)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold mb-1">
                      Sürüş #{drive.driveId}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(drive.date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      {drive.performance.overallScore}/100
                    </p>
                    <p className="text-sm text-gray-600">
                      Genel Performans
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}