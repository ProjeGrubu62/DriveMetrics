'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { validateManualDriveData } from '../utils/validation'
import { ManualDriveData } from '../types'

export default function ManualDataEntry({ onDataSubmit }: { onDataSubmit: (data: ManualDriveData) => void }) {
  const [formData, setFormData] = useState<ManualDriveData>({
    driverSeatTime: {
      start: Date.now(),
      end: Date.now()
    },
    engineTime: {
      start: Date.now(),
      end: Date.now()
    },
    gearTimes: {
      first: 0,
      second: 0,
      third: 0,
      fourth: 0,
      fifth: 0
    },
    stops: {
      count: 0,
      totalDuration: 0,
      stallCount: 0
    },
    averageSpeed: 0,
    maxSpeed: 0,
    distance: 0,
    fuelUsed: 0,
    weatherConditions: {
      temperature: 20,
      weather: 'sunny',
      roadCondition: 'dry'
    }
  });
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateManualDriveData(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    setErrors([]);
    onDataSubmit(formData); // Call onDataSubmit with formData
    // Veri girişi tamamlandığında analiz sayfasına yönlendir
    router.push('/analysis');
  };

  return (
    <div>
      {errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <h4 className="text-red-700 font-medium">Please fix the following errors:</h4>
          <ul className="list-disc list-inside text-red-600">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
        <div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Sürüş Zamanları</h3>
            <div className="grid grid-cols-2 gap-4">
              <label className="block text-sm font-medium text-gray-700">
                Koltuğa Oturma Zamanı
                <input
                  type="datetime-local"
                  value={new Date(formData.driverSeatTime.start).toISOString().slice(0, 16)}
                  onChange={(e) => setFormData({
                    ...formData,
                    driverSeatTime: {
                      ...formData.driverSeatTime,
                      start: new Date(e.target.value).getTime()
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Koltuktan Kalkma Zamanı
                <input
                  type="datetime-local"
                  value={new Date(formData.driverSeatTime.end).toISOString().slice(0, 16)}
                  onChange={(e) => setFormData({
                    ...formData,
                    driverSeatTime: {
                      ...formData.driverSeatTime,
                      end: new Date(e.target.value).getTime()
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Time Spent in Each Gear (minutes)</h3>
          {Object.entries(formData.gearTimes).map(([gear, time]) => (
            <label key={gear} className="block text-sm font-medium text-gray-700">
              {gear.charAt(0).toUpperCase() + gear.slice(1)} Gear
              <input
                type="number"
                value={time}
                onChange={(e) => setFormData({
                  ...formData,
                  gearTimes: {
                    ...formData.gearTimes,
                    [gear]: Number(e.target.value)
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </label>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm font-medium text-gray-700">
            Average Speed (km/h)
            <input
              type="number"
              value={formData.averageSpeed}
              onChange={(e) => setFormData({...formData, averageSpeed: Number(e.target.value)})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Max Speed (km/h)
            <input
              type="number"
              value={formData.maxSpeed}
              onChange={(e) => setFormData({...formData, maxSpeed: Number(e.target.value)})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Distance (km)
            <input
              type="number"
              value={formData.distance}
              onChange={(e) => setFormData({...formData, distance: Number(e.target.value)})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Fuel Used (L)
            <input
              type="number"
              value={formData.fuelUsed}
              onChange={(e) => setFormData({...formData, fuelUsed: Number(e.target.value)})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </label>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Duraksamalar ve İstop</h3>
            <div className="grid grid-cols-3 gap-4">
              <label className="block text-sm font-medium text-gray-700">
                Duraksama Sayısı
                <input
                  type="number"
                  value={formData.stops.count}
                  onChange={(e) => setFormData({
                    ...formData,
                    stops: {
                      ...formData.stops,
                      count: Number(e.target.value)
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Toplam Duraksama Süresi (dk)
                <input
                  type="number"
                  value={formData.stops.totalDuration}
                  onChange={(e) => setFormData({
                    ...formData,
                    stops: {
                      ...formData.stops,
                      totalDuration: Number(e.target.value)
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                İstop Sayısı
                <input
                  type="number"
                  value={formData.stops.stallCount}
                  onChange={(e) => setFormData({
                    ...formData,
                    stops: {
                      ...formData.stops,
                      stallCount: Number(e.target.value)
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Hava ve Yol Koşulları</h3>
            <div className="grid grid-cols-3 gap-4">
              <label className="block text-sm font-medium text-gray-700">
                Sıcaklık (°C)
                <input
                  type="number"
                  value={formData.weatherConditions.temperature}
                  onChange={(e) => setFormData({
                    ...formData,
                    weatherConditions: {
                      ...formData.weatherConditions,
                      temperature: Number(e.target.value)
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Hava Durumu
                <select
                  value={formData.weatherConditions.weather}
                  onChange={(e) => setFormData({
                    ...formData,
                    weatherConditions: {
                      ...formData.weatherConditions,
                      weather: e.target.value as 'sunny' | 'rainy' | 'snowy' | 'cloudy'
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="sunny">Güneşli</option>
                  <option value="rainy">Yağmurlu</option>
                  <option value="snowy">Karlı</option>
                  <option value="cloudy">Bulutlu</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Yol Durumu
                <select
                  value={formData.weatherConditions.roadCondition}
                  onChange={(e) => setFormData({
                    ...formData,
                    weatherConditions: {
                      ...formData.weatherConditions,
                      roadCondition: e.target.value as 'dry' | 'wet' | 'icy' | 'snowy'
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="dry">Kuru</option>
                  <option value="wet">Islak</option>
                  <option value="icy">Buzlu</option>
                  <option value="snowy">Karlı</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Submit Drive Data
        </button>
      </form>
    </div>
  );
}