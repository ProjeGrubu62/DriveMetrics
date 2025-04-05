'use client'
import { useState } from 'react'
import { validateManualDriveData } from '../utils/validation'
import { ManualDriveData } from '../types'

export default function DriveDataEntry({ onDataSubmit }: { onDataSubmit: (data: ManualDriveData) => void }) {
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
    },
    gearShifts: [],
    speedChanges: [],
    brakeUsages: [],
    clutchUsages: [],
    stopEvents: [],
    stallEvents: [],
    drivingStyle: 'normal',
    clutchHealth: 100
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateManualDriveData(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    setErrors([]);
    onDataSubmit(formData);
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
          <label className="block text-sm font-medium text-gray-700">
            Total Journey Time (minutes)
            <input
              type="number"
              value={formData.totalTime}
              onChange={(e) => setFormData({...formData, totalTime: Number(e.target.value)})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </label>
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