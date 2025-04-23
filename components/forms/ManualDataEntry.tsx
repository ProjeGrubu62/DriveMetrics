'use client';

import { useState, useEffect } from 'react';
import { generateTestData } from '../../lib/data/testData';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Vehicle {
  brand: string;
  model: string;
  year: number;
  weight: number;
}

export default function ManualDataEntry() {
  const { data: session } = useSession();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle>({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    weight: 0
  });

  const [availableModels, setAvailableModels] = useState<string[]>([]);

  const carBrands = [
    'Toyota', 'Honda', 'Ford', 'Volkswagen', 'BMW',
    'Mercedes-Benz', 'Audi', 'Hyundai', 'Kia', 'Nissan'
  ];

  const modelsByBrand: { [key: string]: string[] } = {
    'Toyota': ['Corolla', 'Camry', 'RAV4', 'Yaris'],
    'Honda': ['Civic', 'Accord', 'CR-V', 'HR-V'],
    'Ford': ['Focus', 'Fiesta', 'Mustang', 'Kuga'],
    'Volkswagen': ['Golf', 'Passat', 'Polo', 'Tiguan'],
    'BMW': ['3 Series', '5 Series', 'X3', 'X5'],
    'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'GLC'],
    'Audi': ['A3', 'A4', 'Q3', 'Q5'],
    'Hyundai': ['i20', 'i30', 'Tucson', 'Kona'],
    'Kia': ['Ceed', 'Sportage', 'Rio', 'Stonic'],
    'Nissan': ['Micra', 'Qashqai', 'Juke', 'X-Trail']
  };

  const standardWeights: { [key: string]: { [key: string]: number } } = {
    'Toyota': { 'Corolla': 1795, 'Camry': 1850, 'RAV4': 1950, 'Yaris': 1450 },
    'Honda': { 'Civic': 1800, 'Accord': 1850, 'CR-V': 1900, 'HR-V': 1750 },
    'Ford': { 'Focus': 1750, 'Fiesta': 1600, 'Mustang': 2100, 'Kuga': 1900 },
    'Volkswagen': { 'Golf': 1750, 'Passat': 1850, 'Polo': 1600, 'Tiguan': 1950 },
    'BMW': { '3 Series': 1900, '5 Series': 2050, 'X3': 2000, 'X5': 2400 },
    'Mercedes-Benz': { 'A-Class': 1850, 'C-Class': 1950, 'E-Class': 2100, 'GLC': 2150 },
    'Audi': { 'A3': 1800, 'A4': 1900, 'Q3': 1950, 'Q5': 2100 },
    'Hyundai': { 'i20': 1550, 'i30': 1700, 'Tucson': 1850, 'Kona': 1750 },
    'Kia': { 'Ceed': 1700, 'Sportage': 1850, 'Rio': 1600, 'Stonic': 1750 },
    'Nissan': { 'Micra': 1550, 'Qashqai': 1850, 'Juke': 1750, 'X-Trail': 1950 }
  };

  const [loading, setLoading] = useState(false);
  const [weightWarning, setWeightWarning] = useState('');
  const [vehicleImage, setVehicleImage] = useState('/images/vehicles/default-car.jpg');
  const [standardWeight, setStandardWeight] = useState(0);

  // Initialize form with default values
  useEffect(() => {
    if (carBrands.length > 0) {
      const defaultBrand = carBrands[0];
      const defaultModels = modelsByBrand[defaultBrand] || [];
      const defaultModel = defaultModels.length > 0 ? defaultModels[0] : '';
      const defaultWeight = defaultModel ? standardWeights[defaultBrand]?.[defaultModel] || 0 : 0;
      
      setVehicle({
        brand: defaultBrand,
        model: defaultModel,
        year: new Date().getFullYear(),
        weight: defaultWeight
      });
      
      setAvailableModels(defaultModels);
      setStandardWeight(defaultWeight);
      
      if (defaultBrand && defaultModel) {
        fetchVehicleImage(new Date().getFullYear());
      }
    }
  }, []);

  const fetchVehicleImage = async (year: number) => {
    if (!vehicle.brand || !vehicle.model) return;
    
    try {
      console.log('Fetching image for:', {
        brand: vehicle.brand,
        model: vehicle.model,
        year: year
      });

      const response = await fetch(
        `/api/vehicle-image?brand=${encodeURIComponent(vehicle.brand)}&model=${encodeURIComponent(vehicle.model)}&year=${year}`,
        { cache: 'no-store' }
      );
      
      if (!response.ok) {
        throw new Error('Image fetch failed');
      }

      const data = await response.json();
      console.log('Vehicle image API response:', data);
      
      if (data.error) {
        console.error('API Error:', data.error);
        return;
      }
      
      if (data.imageUrl) {
        console.log('Setting new vehicle image:', data.imageUrl);
        setVehicleImage(data.imageUrl);
      }
    } catch (error) {
      console.error('Error fetching vehicle image:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!session?.user) {
      router.push('/auth?callbackUrl=/vehicle-setup');
      return;
    }

    try {
      const testData = generateTestData();
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicle,
          driveData: testData,
          vehicleImage,
          userId: session.user.id
        }),
      });

      if (!response.ok) {
        throw new Error('Veri gönderimi başarısız');
      }

      // Save the vehicle image before navigation
      localStorage.setItem('selectedVehicleImage', vehicleImage);
      
      // Analiz sayfasına yönlendir
      router.push('/analysis');
    } catch (error) {
      console.error('Hata:', error);
      alert('Veri gönderilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBrand = e.target.value;
    const models = modelsByBrand[selectedBrand] || [];
    const defaultModel = models.length > 0 ? models[0] : '';
    const defaultWeight = defaultModel ? standardWeights[selectedBrand]?.[defaultModel] || 0 : 0;
    
    setVehicle(prev => {
      const newVehicle = {
        ...prev,
        brand: selectedBrand,
        model: defaultModel,
        weight: defaultWeight
      };
      
      // Fetch new image after state update
      if (selectedBrand && defaultModel) {
        fetchVehicleImage(newVehicle.year);
      }
      
      return newVehicle;
    });
    
    setAvailableModels(models);
    setStandardWeight(defaultWeight);
    setWeightWarning('');
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedModel = e.target.value;
    const newStandardWeight = standardWeights[vehicle.brand]?.[selectedModel] || 0;
    
    setVehicle(prev => {
      const newVehicle = {
        ...prev,
        model: selectedModel,
        weight: newStandardWeight
      };
      
      // Fetch new image after state update
      if (vehicle.brand && selectedModel) {
        fetchVehicleImage(newVehicle.year);
      }
      
      return newVehicle;
    });
    
    setStandardWeight(newStandardWeight);
    setWeightWarning('');
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = parseInt(e.target.value) || new Date().getFullYear();
    setVehicle(prev => {
      const newVehicle = {
        ...prev,
        year
      };
      
      if (newVehicle.brand && newVehicle.model) {
        fetchVehicleImage(year);
      }
      
      return newVehicle;
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Araç Performans Analizi</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Marka</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={vehicle.brand}
            onChange={handleBrandChange}
            required
          >
            <option value="">Marka Seçiniz</option>
            {carBrands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={vehicle.model}
            onChange={handleModelChange}
            disabled={!vehicle.brand}
            required
          >
            <option value="">Model Seçiniz</option>
            {availableModels.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Yıl</label>
          <input
            type="number"
            min="1990"
            max={new Date().getFullYear() + 5}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={vehicle.year || ''}
            onChange={handleYearChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Ağırlık (kg)</label>
          <div className="relative">
            <input
              type="number"
              min="800"
              max="5000"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={vehicle.weight || ''}
              onChange={(e) => {
                const weight = parseInt(e.target.value);
                setVehicle({ ...vehicle, weight });
                if (weight < standardWeight * 0.7) {
                  setWeightWarning('Ağırlık çok düşük - Parça eksikliği olabilir');
                } else if (weight > standardWeight * 1.3) {
                  setWeightWarning('Maksimum ağırlık aşıldı');
                } else {
                  setWeightWarning('');
                }
              }}
              required
            />
            <div className="absolute right-0 top-0 mt-1 mr-2 text-sm text-gray-400">
              Standart: {standardWeight} kg
            </div>
          </div>
          {weightWarning && (
            <p className="mt-1 text-sm text-red-600">{weightWarning}</p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'İşleniyor...' : 'Analizi Başlat'}
        </button>

        <div className="mt-6">
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <Image
              src={vehicleImage}
              alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
              fill
              className="object-cover"
              priority
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
      </form>
    </div>
  );
}