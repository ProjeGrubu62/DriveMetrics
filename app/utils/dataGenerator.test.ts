import { generateDriveData } from './dataGenerator';
import { Vehicle } from '../types';

describe('Drive Data Generator Tests', () => {
  const mockVehicle: Vehicle = {
    id: '1',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2020,
    fuelType: 'petrol',
    transmission: 'manual',
    weight: 1300
  };

  it('should generate drive data with correct duration', () => {
    const duration = 3600; // 1 saat
    const data = generateDriveData(mockVehicle, duration);
    expect(data.endTime - data.startTime).toBe(duration * 1000);
  });

  it('should generate valid speed changes', () => {
    const data = generateDriveData(mockVehicle, 3600);
    expect(data.speedChanges.length).toBeGreaterThan(0);
    data.speedChanges.forEach(change => {
      expect(change.speed).toBeGreaterThanOrEqual(0);
      expect(change.speed).toBeLessThanOrEqual(200);
      expect(change.acceleration).toBeDefined();
      expect(typeof change.isSudden).toBe('boolean');
    });
  });

  it('should generate valid gear shifts', () => {
    const data = generateDriveData(mockVehicle, 3600);
    expect(data.gearShifts.length).toBeGreaterThan(0);
    data.gearShifts.forEach(shift => {
      expect(shift.fromGear).toBeGreaterThanOrEqual(0);
      expect(shift.toGear).toBeGreaterThanOrEqual(0);
      expect(shift.toGear).toBeLessThanOrEqual(6);
      expect(typeof shift.isSmooth).toBe('boolean');
    });
  });

  it('should generate valid brake usages', () => {
    const data = generateDriveData(mockVehicle, 3600);
    expect(data.brakeUsages.length).toBeGreaterThan(0);
    data.brakeUsages.forEach(usage => {
      expect(usage.intensity).toBeGreaterThanOrEqual(0);
      expect(usage.intensity).toBeLessThanOrEqual(1);
      expect(typeof usage.isEmergency).toBe('boolean');
    });
  });

  it('should generate valid clutch usages', () => {
    const data = generateDriveData(mockVehicle, 3600);
    expect(data.clutchUsages.length).toBeGreaterThan(0);
    data.clutchUsages.forEach(usage => {
      expect(usage.duration).toBeGreaterThan(0);
      expect(usage.duration).toBeLessThan(5);
      expect(typeof usage.isHardRelease).toBe('boolean');
    });
  });

  it('should generate consistent vehicle data', () => {
    const data = generateDriveData(mockVehicle, 3600);
    expect(data.vehicleId).toBe(mockVehicle.id);
    expect(data.averageSpeed).toBeDefined();
    expect(data.maxSpeed).toBeGreaterThanOrEqual(data.averageSpeed);
    expect(data.totalDistance).toBeGreaterThan(0);
    expect(data.fuelConsumption).toBeGreaterThan(0);
    expect(data.clutchHealth).toBeGreaterThanOrEqual(0);
    expect(data.clutchHealth).toBeLessThanOrEqual(100);
  });

  it('should handle different durations correctly', () => {
    const shortDuration = 1800; // 30 dakika
    const longDuration = 7200; // 2 saat

    const shortData = generateDriveData(mockVehicle, shortDuration);
    const longData = generateDriveData(mockVehicle, longDuration);

    expect(longData.gearShifts.length).toBeGreaterThan(shortData.gearShifts.length);
    expect(longData.speedChanges.length).toBeGreaterThan(shortData.speedChanges.length);
    expect(longData.totalDistance).toBeGreaterThan(shortData.totalDistance);
  });
});