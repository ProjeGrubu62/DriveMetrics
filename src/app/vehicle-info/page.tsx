"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Marka ve model verileri
const carData = {
  'Renault': ['Clio', 'Megane', 'Captur', 'Kadjar', 'Twingo', 'Austral'],
  'Fiat': ['500', 'Punto', 'Egea', 'Doblo', 'Panda', 'Egea Cross', '600'],
  'Volkswagen': ['Golf', 'Passat', 'Tiguan', 'Polo', 'T-Roc'],
  'Opel': ['Corsa', 'Astra', 'Mokka', 'Insignia', 'Crossland'],
  'Hyundai': ['i20', 'i30', 'Tucson', 'Santa Fe', 'Kona', 'Bayon'],
  'Ford': ['Focus', 'Fiesta', 'Kuga', 'Mustang', 'Mustang Mach-E','Mustang Shelby GT500', 'Puma', 'Transit'],
  'Toyota': ['Corolla', 'C-HR', 'Supra', 'RAV4', 'Yaris', 'Hilux'],
  'Peugeot': ['208', '308', '3008', '508', '2008'],
  'Honda': ['Civic', 'CR-V', 'HR-V', 'Jazz', 'Accord'],
  'Porsche': ['911', '718', 'Taycan', 'Macan', 'Cayenne', 'Panamera'],
  'Dacia': ['Duster', 'Sandero', 'Logan', 'Jogger', 'Spring'],
  'BMW': ['3 Serisi', '5 Serisi', 'X3', 'X5', '1 Serisi'],
  'Audi': ['A3', 'A4', 'A6', 'Q5','Coupe', 'Q3'],
  'Mercedes-Benz': ['C Serisi', 'E Serisi', 'A Serisi', 'GLC', 'CLA'],
  'Skoda': ['Octavia', 'Fabia', 'Kodiaq', 'Superb', 'Karoq'],
  'Nissan': ['Qashqai', 'Juke','GTR', 'Leaf', 'Ariya', 'Qashqai Cross', 'Qashqai e-Power'],
  'Volvo': ['XC60', 'XC90', 'S90', 'S60', 'XC40', 'V60']
};

const fuelTypes = ['Benzin', 'Dizel', 'LPG', 'Hibrit', 'Elektrik'];

export default function VehicleInfoPage() {
  const router = useRouter();
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [carImage, setCarImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  // Marka değiştiğinde modelleri güncelle
  useEffect(() => {
    if (brand) {
      setAvailableModels(carData[brand as keyof typeof carData] || []);
      setModel(''); // Model seçimini sıfırla
    } else {
      setAvailableModels([]);
    }
    setCarImage(null); // Fotoğrafı sıfırla
  }, [brand]);

  // Marka, model veya yıl değiştiğinde fotoğrafı güncelle
  useEffect(() => {
    if (brand && model && year && year.length === 4) {
      fetchCarImage();
    } else {
      setCarImage(null);
    }
  }, [brand, model, year]);

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBrand(e.target.value);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModel(e.target.value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Sadece sayı girişine izin ver
    if (/^\d*$/.test(value)) {
      setYear(value);
    }
  };

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Sadece sayı girişine izin ver
    if (/^\d*$/.test(value)) {
      setMileage(value);
    }
  };

  const handleFuelTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFuelType(e.target.value);
  };

  const fetchCarImage = async () => {
    if (!brand || !model || !year || year.length !== 4) return;

    setLoading(true);
    try {
      const query = `${brand} ${model} ${year} car`;
      const response = await fetch(`/api/car-image?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (response.ok && data.imageUrl) {
        setCarImage(data.imageUrl);
      } else {
        setCarImage(null);
        console.error('Fotoğraf bulunamadı veya API hatası:', data.error || response.statusText);
      }
    } catch (error) {
      console.error('Error fetching car image:', error);
      setCarImage(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (brand && model && year && year.length === 4 && mileage && fuelType) {
      // Seçilen araç bilgilerini localStorage'a kaydet
      const selectedVehicle = {
        brand: brand,
        model: model,
        year: year,
        mileage: mileage,
        fuelType: fuelType,
        image: carImage // API'den gelen görsel URL'i
      };
      localStorage.setItem('selectedVehicle', JSON.stringify(selectedVehicle));

      // Yönlendirme yap
      router.push('/upload');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Araç Bilgilerinizi Girin
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Lütfen aracınızın bilgilerini girin
          </p>
        </div>

        <div className="mt-12">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="bg-white shadow sm:rounded-lg p-6">
              <div className="space-y-4">
                {/* Marka */}
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                    Marka
                  </label>
                  <select
                    id="brand"
                    value={brand}
                    onChange={handleBrandChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    required
                  >
                    <option value="">Marka Seçin</option>
                    {Object.keys(carData).map((brandKey) => (
                      <option key={brandKey} value={brandKey}>
                        {brandKey}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Model */}
                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                    Model
                  </label>
                  <select
                    id="model"
                    value={model}
                    onChange={handleModelChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    required
                    disabled={!brand || availableModels.length === 0}
                  >
                    <option value="">Model Seçin</option>
                    {availableModels.map((modelName) => (
                      <option key={modelName} value={modelName}>
                        {modelName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Yıl */}
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                    Yıl
                  </label>
                  <input
                    type="text"
                    id="year"
                    value={year}
                    onChange={handleYearChange}
                    placeholder="Örn: 2020"
                    maxLength={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    required
                  />
                </div>

                {/* Kilometre */}
                <div>
                  <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">
                    Kilometre
                  </label>
                  <input
                    type="text"
                    id="mileage"
                    value={mileage}
                    onChange={handleMileageChange}
                    placeholder="Örn: 50000"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    required
                  />
                </div>

                {/* Yakıt Tipi */}
                <div>
                  <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700">
                    Yakıt Tipi
                  </label>
                  <select
                    id="fuelType"
                    value={fuelType}
                    onChange={handleFuelTypeChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    required
                  >
                    <option value="">Yakıt Tipi Seçin</option>
                    {fuelTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!brand || !model || !year || year.length !== 4 || !mileage || !fuelType}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      brand && model && year && year.length === 4 && mileage && fuelType
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                  >
                    Devam Et
                  </button>
                </div>
              </div>
            </div>

            {/* Fotoğraf Alanı */}
            <div className="bg-white shadow sm:rounded-lg p-6">
              <div className="aspect-w-16 aspect-h-9">
                {loading ? (
                   <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                     <p className="text-gray-500">Fotoğraf yükleniyor...</p>
                   </div>
                ) : carImage ? (
                  <img
                    src={carImage}
                    alt={`${brand} ${model} ${year}`}
                    className="object-cover rounded-lg w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                    <p className="text-gray-500">
                      Fotoğraf görüntülemek için marka, model ve yıl bilgilerini girin
                    </p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 