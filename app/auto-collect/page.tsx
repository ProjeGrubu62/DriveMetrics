'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DriveDataGenerator } from '@/lib/data/DriveDataGenerator';

export default function AutoCollectPage() {
  const router = useRouter();
  const [isCollecting, setIsCollecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  
  const [selectedParams, setSelectedParams] = useState({
    yakitTuketimi: true,
    vitesKullanimi: true,
    hiz: true,
    mesafe: true,
    hizlanma: false,
    fren: false,
    motorSicakligi: false,
    lastikBasinci: false
  });

  const handleParamChange = (param: string) => {
    setSelectedParams(prev => ({
      ...prev,
      [param]: !prev[param as keyof typeof prev]
    }));
  };

  const startDataCollection = () => {
    setIsCollecting(true);
    setStatus('Veri toplama başlatılıyor...');
  };

  useEffect(() => {
    if (!isCollecting) return;

    let isMounted = true;
    let collectionInterval: NodeJS.Timeout;

    const simulateDataCollection = async () => {
      const steps = [
        { message: 'Araç sistemlerine bağlanılıyor...', duration: 1500 },
        { message: 'Sürüş verileri toplanıyor...', duration: 2000 },
        { message: 'Veriler işleniyor...', duration: 1500 },
        { message: 'Analiz hazırlanıyor...', duration: 1000 }
      ];

      let currentStep = 0;
      const totalSteps = steps.length;

      const processStep = () => {
        if (!isMounted) return;

        if (currentStep < totalSteps) {
          setStatus(steps[currentStep].message);
          setProgress(((currentStep + 1) / totalSteps) * 100);
          currentStep++;
        } else {
          clearInterval(collectionInterval);
          try {
            // DriveDataGenerator sınıfının statik metodunu doğrudan çağıralım
            const driveData = DriveDataGenerator.generateDriveData(selectedParams);
            localStorage.setItem('driveData', JSON.stringify(driveData));
            
            // Router kullanarak yönlendirme yapalım
            // Önce veri toplama işlemini tamamlayalım
            setStatus('Veri toplama tamamlandı. Analiz sayfasına yönlendiriliyorsunuz...');
            
            // Kısa bir gecikme ile yönlendirme yapalım
            setTimeout(() => {
              try {
                window.location.href = '/analysis';
              } catch (e) {
                console.error('Yönlendirme hatası:', e);
                setStatus('Yönlendirme hatası. Lütfen manuel olarak analiz sayfasına gidin.');
                setIsCollecting(false);
              }
            }, 1000);
          } catch (error) {
            console.error('Veri üretimi hatası:', error);
            setStatus('Bir hata oluştu. Lütfen tekrar deneyin.');
            setIsCollecting(false);
          }
        }
      };

      collectionInterval = setInterval(processStep, 1500);
    };

    simulateDataCollection();

    return () => {
      isMounted = false;
      if (collectionInterval) {
        clearInterval(collectionInterval);
      }
    };
  }, [isCollecting, selectedParams]);

  if (isCollecting) {
    return (
      <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Otomatik Veri Toplama</h1>
          
          <div className="mb-6">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <p className="text-center text-gray-600">{status}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Otomatik Veri Toplama Parametreleri</h1>
      
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {Object.entries(selectedParams).map(([param, isSelected]) => (
            <div key={param} className="flex items-center space-x-3">
              <input
                type="checkbox"
                id={param}
                checked={isSelected}
                onChange={() => handleParamChange(param)}
                className="h-5 w-5 text-blue-600 rounded"
              />
              <label htmlFor={param} className="text-gray-700">
                {{
                  yakitTuketimi: 'Yakıt Tüketimi',
                  vitesKullanimi: 'Vites Kullanımı',
                  hiz: 'Hız',
                  mesafe: 'Mesafe',
                  hizlanma: 'Hızlanma',
                  fren: 'Fren',
                  motorSicakligi: 'Motor Sıcaklığı',
                  lastikBasinci: 'Lastik Basıncı'
                }[param]}
              </label>
            </div>
          ))}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
          >
            Geri
          </button>
          <button
            onClick={startDataCollection}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={!Object.values(selectedParams).some(value => value)}
          >
            Veri Toplamayı Başlat
          </button>
        </div>
      </div>
    </div>
  );
}