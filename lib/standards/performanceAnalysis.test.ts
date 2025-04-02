import { analyzePerformance } from './performanceAnalysis';
import { DriveData, Vehicle } from '../../types';

describe('Performance Analysis Tests', () => {
  const mockVehicle: Vehicle = {
    id: '1',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2020,
    fuelType: 'petrol',
    transmission: 'manual',
    weight: 1300
  };

  const mockDriveData: DriveData = {
    id: '1',
    vehicleId: '1',
    startTime: Date.now() - 3600000,
    endTime: Date.now(),
    gearShifts: [],
    speedChanges: [
      { time: Date.now(), speed: 60, acceleration: 5, isSudden: true },
      { time: Date.now(), speed: 80, acceleration: 2, isSudden: false }
    ],
    brakeUsages: [
      { time: Date.now(), intensity: 0.8, isEmergency: true },
      { time: Date.now(), intensity: 0.3, isEmergency: false }
    ],
    clutchUsages: [
      { time: Date.now(), duration: 1.5, isHardRelease: true },
      { time: Date.now(), duration: 0.5, isHardRelease: false }
    ],
    averageSpeed: 65,
    maxSpeed: 120,
    totalDistance: 50,
    fuelConsumption: 5.8,
    drivingStyle: 'normal',
    clutchHealth: 85
  };

  it('should analyze fuel efficiency correctly', () => {
    const result = analyzePerformance(mockVehicle, mockDriveData);
    expect(result.fuelEfficiency).toBeDefined();
    expect(result.fuelEfficiency.score).toBeGreaterThanOrEqual(0);
    expect(result.fuelEfficiency.score).toBeLessThanOrEqual(100);
    expect(Array.isArray(result.fuelEfficiency.recommendations)).toBeTruthy();
  });

  it('should analyze clutch health correctly', () => {
    const result = analyzePerformance(mockVehicle, mockDriveData);
    expect(result.clutchHealth).toBeDefined();
    expect(result.clutchHealth.score).toBe(mockDriveData.clutchHealth);
    expect(result.clutchHealth.wear).toBe(100 - mockDriveData.clutchHealth);
    expect(Array.isArray(result.clutchHealth.recommendations)).toBeTruthy();
  });

  it('should analyze brake system correctly', () => {
    const result = analyzePerformance(mockVehicle, mockDriveData);
    expect(result.brakeSystem).toBeDefined();
    expect(result.brakeSystem.score).toBeGreaterThanOrEqual(0);
    expect(result.brakeSystem.score).toBeLessThanOrEqual(100);
    expect(Array.isArray(result.brakeSystem.recommendations)).toBeTruthy();
  });

  it('should calculate overall score', () => {
    const result = analyzePerformance(mockVehicle, mockDriveData);
    expect(result.overallScore).toBeDefined();
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });

  it('should handle extreme values correctly', () => {
    const extremeDriveData = {
      ...mockDriveData,
      fuelConsumption: 15,
      clutchHealth: 20,
      brakeUsages: Array(10).fill({ time: Date.now(), intensity: 1, isEmergency: true })
    };

    const result = analyzePerformance(mockVehicle, extremeDriveData);
    expect(result.fuelEfficiency.score).toBeLessThan(50);
    expect(result.clutchHealth.score).toBe(20);
    expect(result.brakeSystem.score).toBeLessThan(50);
    expect(result.overallScore).toBeLessThan(50);
  });
});