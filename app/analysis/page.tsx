'use client'
import { useEffect, useState, useRef, useMemo } from 'react'
import Image from 'next/image'
// Fix the import paths - remove duplicate and use correct path
import { generateDriveData } from '../../utils/dataGenerator'
import { DriveData, Vehicle } from '../types'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'
import DriveDataEntry from '../components/DriveDataEntry';
import DriveAnalysisReport from '../components/DriveAnalysisReport';
import { ManualDriveData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function Analysis() {
  const [isLoading, setIsLoading] = useState(true);
  const [vehicleImage, setVehicleImage] = useState('/images/vehicles/default-car.jpg');
  const [activeTab, setActiveTab] = useState('vites')
  const [driveData, setDriveData] = useState<DriveData | null>(null)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [dataMode, setDataMode] = useState<'auto' | 'manual'>('auto');
  const [error, setError] = useState<string | null>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleManualDataSubmit = async (data: ManualDriveData) => {
    setIsLoading(true);
    try {
      const convertedData: DriveData = {
        id: Date.now().toString(),
        vehicleId: '1',
        startTime: Date.now() - 3600000,
        endTime: Date.now(),
        gearShifts: [],
        speedChanges: [],
        brakeUsages: [],
        clutchUsages: [],
        averageSpeed: data.averageSpeed,
        maxSpeed: data.maxSpeed,
        totalDistance: data.distance,
        fuelConsumption: data.fuelUsed,
        drivingStyle: 'normal',
        clutchHealth: 100
      };  // Added missing semicolon
      
      setDriveData(convertedData);
      setLastUpdate(new Date());
      setDataMode('auto'); // Switch back to auto mode after manual submission
    } catch (error) {
      console.error('Error processing manual data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleVehicle: Vehicle = {
    id: '1',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2020,
    fuelType: 'petrol',
    transmission: 'manual',
    weight: 1300
  }

  const updateData = () => {
    setIsLoading(true);
    try {
      const data = generateDriveData(sampleVehicle, 3600)
      setDriveData(prevData => {
        if (JSON.stringify(prevData) !== JSON.stringify(data)) {
          return data;
        }
        return prevData;
      });
      setLastUpdate(new Date());
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Önce localStorage'dan veri yüklemeyi deneyelim
    try {
      const savedDriveData = localStorage.getItem('driveData');
      if (savedDriveData) {
        console.log("localStorage'dan veri yükleniyor...");
        const parsedData = JSON.parse(savedDriveData);
        
        // Veri formatını kontrol edelim
        if (parsedData && typeof parsedData === 'object') {
          // Eksik alanları tamamlayalım
          if (!parsedData.id) parsedData.id = Date.now().toString();
          if (!parsedData.vehicleId) parsedData.vehicleId = '1';
          if (!parsedData.gearShifts) parsedData.gearShifts = [];
          if (!parsedData.speedChanges) parsedData.speedChanges = [];
          if (!parsedData.brakeUsages) parsedData.brakeUsages = [];
          if (!parsedData.clutchUsages) parsedData.clutchUsages = [];
          if (!parsedData.stopEvents) parsedData.stopEvents = [];
          if (!parsedData.stallEvents) parsedData.stallEvents = [];
          if (!parsedData.drivingStyle) parsedData.drivingStyle = 'normal';
          if (!parsedData.clutchHealth) parsedData.clutchHealth = 85;
          
          setDriveData(parsedData);
          setLastUpdate(new Date());
          console.log('Veri başarıyla yüklendi:', parsedData);
          
          // localStorage'dan veriyi temizleyelim ki bir sonraki ziyarette tekrar kullanılmasın
          localStorage.removeItem('driveData');
          setError(null);
        } else {
          console.error('Geçersiz veri formatı:', parsedData);
          setError('Geçersiz veri formatı. Yeni veri üretiliyor...');
          updateData();
        }
      } else {
        console.log("localStorage'da veri bulunamadı, yeni veri üretiliyor...");
        updateData();
      }
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      setError('Veri yükleme hatası. Yeni veri üretiliyor...');
      updateData();
    }
    
    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const loadVehicleImage = () => {
      const savedImage = localStorage.getItem('selectedVehicleImage');
      console.log('Attempting to load vehicle image from localStorage:', savedImage);

      if (savedImage) {
        setVehicleImage(savedImage);
        console.log('Vehicle image set to:', savedImage);
      } else {
        console.log('No saved vehicle image found in localStorage');
      }
    };

    loadVehicleImage();
  }, []);

  const vitesData = useMemo(() => ({
    labels: ['1. Vites', '2. Vites', '3. Vites', '4. Vites', '5. Vites'],
    datasets: [{
      label: 'Vites Kullanım Süresi (dakika)',
      data: driveData ? driveData.gearShifts.reduce((acc, shift) => {
        const startCount = Math.ceil(driveData.totalDistance / 5)
        if (acc[0] === 0) acc[0] = Math.max(startCount * (2/60), Math.floor(driveData.gearShifts.length * 0.15))
        acc[shift.fromGear - 1] = (acc[shift.fromGear - 1] || 0) + 1
        return acc
      }, Array(5).fill(0)) : [0, 0, 0, 0, 0],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  }), [driveData])

  const hizData = useMemo(() => ({
    labels: ['0-20', '20-40', '40-60', '60-80', '80+'],
    datasets: [{
      label: 'Hız Dağılımı (%)',
      data: driveData ? driveData.speedChanges.reduce((acc, change) => {
        const speedIndex = Math.floor(change.fromSpeed / 20)
        if (speedIndex < 5) acc[speedIndex]++
        return acc
      }, Array(5).fill(0)) : [0, 0, 0, 0, 0],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)'
      ]
    }]
  }), [driveData])

  const yakitData = useMemo(() => ({
    labels: ['0-10km', '10-20km', '20-30km', '30-40km', '40-50km'],
    datasets: [{
      label: 'Yakıt Tüketimi (L/100km)',
      data: driveData ? [
        driveData.fuelConsumption * 0.8,
        driveData.fuelConsumption * 1.0,
        driveData.fuelConsumption * 0.9,
        driveData.fuelConsumption * 1.1,
        driveData.fuelConsumption * 1.2
      ] : [0, 0, 0, 0, 0],
      borderColor: 'rgb(255, 99, 132)',
      tension: 0.1
    }]
  }), [driveData])

  const agirlikData = useMemo(() => ({
    labels: ['Yakıt Etkisi', 'Süspansiyon Etkisi', 'Performans Etkisi'],
    datasets: [{
      data: driveData ? [
        40 + (driveData.averageSpeed / 100) * 10,
        35 + (driveData.maxSpeed / 150) * 10,
        25 + (driveData.totalDistance / 50) * 10
      ] : [0, 0, 0],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)'
      ]
    }]
  }), [driveData])

  const frenKullanimData = useMemo(() => ({
    labels: ['0-5km', '5-10km', '10-15km', '15-20km', '20-25km'],
    datasets: [{
      label: 'Fren Kullanım Sıklığı',
      data: driveData ? driveData.brakeUsages.reduce((acc, brake, index) => {
        const segment = Math.floor((index / driveData.brakeUsages.length) * 5)
        acc[segment]++
        return acc
      }, Array(5).fill(0)) : [0, 0, 0, 0, 0],
      borderColor: 'rgb(255, 99, 132)',
      tension: 0.1
    }]
  }), [driveData])

  const frenDurumData = useMemo(() => ({
    labels: ['Balata Aşınması', 'Disk Aşınması', 'El Freni Kullanımı'],
    datasets: [{
      data: driveData ? [
        driveData.brakeUsages.reduce((sum, brake) => sum + brake.intensity, 0) / driveData.brakeUsages.length * 100,
        driveData.brakeUsages.filter(brake => brake.isEmergency).length / driveData.brakeUsages.length * 100,
        driveData.brakeUsages.filter(brake => brake.handbrakeUsed).length / driveData.brakeUsages.length * 100
      ] : [0, 0, 0],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)'
      ]
    }]
  }), [driveData])

  const hizlanmaData = useMemo(() => ({
    labels: ['0-5km', '5-10km', '10-15km', '15-20km', '20-25km'],
    datasets: [
      {
        label: 'Ani Hızlanma',
        data: driveData ? driveData.speedChanges.reduce((acc, change, index) => {
          if (change.acceleration > 0 && change.isSudden) {
            const segment = Math.floor((index / driveData.speedChanges.length) * 5)
            acc[segment]++
          }
          return acc
        }, Array(5).fill(0)) : [0, 0, 0, 0, 0],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Ani Frenleme',
        data: driveData ? driveData.speedChanges.reduce((acc, change, index) => {
          if (change.acceleration < 0 && change.isSudden) {
            const segment = Math.floor((index / driveData.speedChanges.length) * 5)
            acc[segment]++
          }
          return acc
        }, Array(5).fill(0)) : [0, 0, 0, 0, 0],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  }), [driveData])

  const surusTarziData = useMemo(() => ({
    labels: ['Ekonomik', 'Normal', 'Sportif'],
    datasets: [{
      data: driveData ? [
        driveData.drivingStyle === 'economic' ? 60 : 20,
        driveData.drivingStyle === 'normal' ? 60 : 20,
        driveData.drivingStyle === 'sporty' ? 60 : 20
      ] : [0, 0, 0],
      backgroundColor: [
        'rgba(75, 192, 192, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 99, 132, 0.5)'
      ]
    }]
  }), [driveData])

  // Add new clutch data
  const clutchUsageData = useMemo(() => ({
    labels: ['1. Vites', '2. Vites', '3. Vites', '4. Vites', '5. Vites'],
    datasets: [{
      label: 'Debriyaj Kullanım Süresi (ms)',
      data: driveData ? driveData.clutchUsages.reduce((acc, usage) => {
        acc[usage.gearAtUse - 1] += usage.duration;
        return acc;
      }, Array(5).fill(0)) : [0, 0, 0, 0, 0],
      borderColor: 'rgb(153, 102, 255)',
      tension: 0.1
    }]
  }), [driveData]);

  const clutchHealthData = useMemo(() => ({
    labels: ['Sağlıklı', 'Aşınma', 'Kritik'],
    datasets: [{
      data: driveData ? [
        driveData.clutchHealth,
        100 - driveData.clutchHealth,
        Math.max(0, 100 - driveData.clutchHealth * 1.5)
      ] : [0, 0, 0],
      backgroundColor: [
        'rgba(75, 192, 192, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(255, 99, 132, 0.5)'
      ]
    }]
  }), [driveData]);

  const clutchRecommendations = useMemo(() => driveData ? [
    driveData.clutchHealth < 70 ? 'Debriyaj bakımı önerilir' : null,
    driveData.clutchUsages.some(u => u.duration > 3000) ? 'Debriyajda uzun süreli bekleme tespit edildi' : null,
    driveData.clutchUsages.filter(u => u.isHardRelease).length > 5 ? 'Sert debriyaj bırakmaları azaltılmalı' : null,
    driveData.clutchUsages.filter(u => u.isSlipping).length > 3 ? 'Debriyaj kaydırması tespit edildi' : null,
  ].filter(Boolean) : [], [driveData]);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto relative">
        <div className="absolute top-16 right-4 w-48 h-32 rounded-lg overflow-hidden shadow-lg z-10">
          <Image
            src={vehicleImage}
            alt="Selected Vehicle"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Sürüş Analizi</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Son Güncelleme: {lastUpdate.toLocaleTimeString('tr-TR')}
            </div>
            <button
              onClick={updateData}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Veri Üretiliyor...' : 'Yeni Veri Üret'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="flex space-x-4 mb-8">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'vites' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab('vites')}
          >
            Vites-Hız Analizi
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'yakit' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab('yakit')}
          >
            Yakıt ve Ağırlık
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'fren' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab('fren')}
          >
            Fren Sistemi
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'patern' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab('patern')}
          >
            Sürüş Paterni
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'debriyaj' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab('debriyaj')}
          >
            Debriyaj Analizi
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {activeTab === 'vites' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Vites-Hız Analizi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="text-lg font-medium mb-2">Vites Geçişleri</h3>
                  <div className="h-[300px]">
                    <Line data={vitesData} />
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="text-lg font-medium mb-2">Hız Dağılımı</h3>
                  <div className="h-[300px]">
                    <Doughnut data={hizData} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'yakit' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Yakıt ve Ağırlık Analizi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="text-lg font-medium mb-2">Yakıt Tüketimi</h3>
                  <div className="h-[300px]">
                    <Line data={yakitData} />
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="text-lg font-medium mb-2">Ağırlık Etkisi</h3>
                  <div className="h-[300px]">
                    <Doughnut data={agirlikData} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fren' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Fren Sistemi Analizi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="text-lg font-medium mb-2">Fren Kullanımı</h3>
                  <div className="h-[300px]">
                    <Line data={frenKullanimData} />
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="text-lg font-medium mb-2">Fren Sistemi Durumu</h3>
                  <div className="h-[300px]">
                    <Doughnut data={frenDurumData} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'patern' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Sürüş Paterni Analizi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="text-lg font-medium mb-2">Ani Hızlanma/Frenleme</h3>
                  <div className="h-[300px]">
                    <Line data={hizlanmaData} />
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="text-lg font-medium mb-2">Sürüş Tarzı Dağılımı</h3>
                  <div className="h-[300px]">
                    <Doughnut data={surusTarziData} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'debriyaj' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Debriyaj Analizi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="text-lg font-medium mb-2">Debriyaj Kullanımı</h3>
                  <div className="h-[300px]">
                    <Line data={clutchUsageData} />
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="text-lg font-medium mb-2">Debriyaj Sağlığı</h3>
                  <div className="h-[300px]">
                    <Doughnut data={clutchHealthData} />
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded">
                <h3 className="text-lg font-medium mb-2">Öneriler ve Uyarılar</h3>
                {clutchRecommendations.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {clutchRecommendations.map((rec, index) => (
                      <li key={index} className="text-gray-700">{rec}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700">Debriyaj kullanımı normal seviyelerde.</p>
                )}
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-medium mb-2">Sert Bırakma Oranı</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {driveData ? 
                      `${((driveData.clutchUsages.filter(u => u.isHardRelease).length / driveData.clutchUsages.length) * 100).toFixed(1)}%` 
                      : '0%'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-medium mb-2">Ortalama Kullanım Süresi</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {driveData ? 
                      `${(driveData.clutchUsages.reduce((acc, u) => acc + u.duration, 0) / driveData.clutchUsages.length).toFixed(0)}ms` 
                      : '0ms'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-medium mb-2">Kaydırma Sayısı</h4>
                  <p className="text-2xl font-bold text-red-600">
                    {driveData ? 
                      driveData.clutchUsages.filter(u => u.isSlipping).length 
                      : '0'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DriveAnalysisReport driveData={driveData as import('../../types').DriveData} analysisResult={{
            overallScore: 85,
            categoryScores: {
              gearUsage: driveData ? Math.min(100, 100 - (driveData.clutchUsages.filter(u => u.isHardRelease).length * 5)) : 0,
              brakeUsage: driveData ? Math.min(100, 100 - (driveData.brakeUsages.filter(b => b.isEmergency).length * 10)) : 0,
              speedManagement: driveData ? Math.min(100, 100 - (driveData.speedChanges.filter(s => s.isSudden).length * 5)) : 0,
              fuelEfficiency: driveData ? Math.min(100, 100 - ((driveData.fuelConsumption / driveData.totalDistance * 100 - 5) * 10)) : 0,
              safetyScore: driveData ? driveData.clutchHealth : 0
            },
            warnings: driveData ? [
              ...(driveData.clutchUsages.filter(u => u.isHardRelease).length > 2 ? ['Sert debriyaj bırakmaları tespit edildi'] : []),
              ...(driveData.brakeUsages.filter(b => b.isEmergency).length > 1 ? ['Ani fren kullanımları mevcut'] : []),
              ...(driveData.speedChanges.filter(s => s.isSudden).length > 3 ? ['Ani hızlanmalar tespit edildi'] : [])
            ] : [],
            recommendations: driveData ? [
              'Vites geçişlerinde debriyajı daha yumuşak kullanın',
              'Takip mesafesini koruyarak ani fren ihtiyacını azaltın',
              'Ekonomik sürüş için sabit hızda gitmeye özen gösterin'
            ] : []
          }} />

          <div className="mb-8">
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded ${dataMode === 'auto' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setDataMode('auto')}
              >
                Automatic Data
              </button>
              <button
                className={`px-4 py-2 rounded ${dataMode === 'manual' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setDataMode('manual')}
              >
                Manual Entry
              </button>
            </div>
            
            {dataMode === 'manual' && (
              <div className="mt-4">
                <DriveDataEntry onDataSubmit={handleManualDataSubmit} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
