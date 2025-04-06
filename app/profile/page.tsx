'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DriveData } from '../types/drive';
import DrivePerformanceChart from '../components/DrivePerformanceChart';
import { FaCar, FaGasPump, FaRoad, FaClock } from 'react-icons/fa';
import { getUserDriveHistory } from '@/lib/firebase/auth';

export default function ProfilePage() {
  const { user } = useAuth();
  const [driveHistory, setDriveHistory] = useState<DriveData[]>([]);

  useEffect(() => {
    const fetchDriveHistory = async () => {
      try {
        if (user) {
          const driveData = await getUserDriveHistory();
          setDriveHistory(driveData);
        }
      } catch (error) {
        console.error('Sürüş verileri alınırken hata oluştu:', error);
      }
    };

    fetchDriveHistory();
  }, [user]);

  if (!user) {
    return <div>Lütfen giriş yapın</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{user.displayName || 'Kullanıcı'}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <div className="bg-blue-100 rounded-full p-4">
            <FaCar className="text-blue-600 text-2xl" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <FaRoad className="text-blue-600 text-xl mr-3" />
            <div>
              <p className="text-gray-600">Toplam Mesafe</p>
              <p className="text-2xl font-bold">{driveHistory.reduce((acc, curr) => acc + curr.distance, 0)} km</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <FaClock className="text-blue-600 text-xl mr-3" />
            <div>
              <p className="text-gray-600">Toplam Süre</p>
              <p className="text-2xl font-bold">{driveHistory.reduce((acc, curr) => acc + curr.duration, 0)} dk</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <FaGasPump className="text-blue-600 text-xl mr-3" />
            <div>
              <p className="text-gray-600">Ort. Yakıt Tüketimi</p>
              <p className="text-2xl font-bold">
                {(driveHistory.reduce((acc, curr) => acc + curr.fuelConsumption, 0) / driveHistory.length || 0).toFixed(1)} L/100km
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <FaCar className="text-blue-600 text-xl mr-3" />
            <div>
              <p className="text-gray-600">Ort. Hız</p>
              <p className="text-2xl font-bold">
                {(driveHistory.reduce((acc, curr) => acc + curr.averageSpeed, 0) / driveHistory.length || 0).toFixed(1)} km/s
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Performans Analizi</h2>
        {driveHistory.length === 0 ? (
          <p className="text-gray-600">Henüz kaydedilmiş sürüş bulunmuyor.</p>
        ) : (
          <DrivePerformanceChart driveHistory={driveHistory} />
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Son Sürüşler</h2>
        {driveHistory.length === 0 ? (
          <p className="text-gray-600">Henüz kaydedilmiş sürüş bulunmuyor.</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {driveHistory.map((drive, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold">{new Date(drive.date).toLocaleDateString('tr-TR')}</p>
                  <span className="text-sm text-gray-500">{drive.vehicleType}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="text-gray-600">Mesafe:</span> {drive.distance} km</p>
                  <p><span className="text-gray-600">Süre:</span> {drive.duration} dk</p>
                  <p><span className="text-gray-600">Ort. Hız:</span> {drive.averageSpeed} km/s</p>
                  <p><span className="text-gray-600">Yakıt:</span> {drive.fuelConsumption} L/100km</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}