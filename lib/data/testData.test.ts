import { generateTestData } from './testData';
import { DriveData, GearShift, BrakeUsage } from '../../app/types/drive';

describe('Test Data Generation Tests', () => {
  it('should generate valid test data', () => {
    const data: DriveData = generateTestData();
    expect(data).toBeDefined();
  });

  it('should generate data with required properties', () => {
    const data: DriveData = generateTestData();
    
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('vehicleId');
    expect(data).toHaveProperty('driverSeatTime');
    expect(data).toHaveProperty('engineTime');
    expect(data).toHaveProperty('gearShifts');
    expect(data).toHaveProperty('speedChanges');
    expect(data).toHaveProperty('brakeUsages');
    expect(data).toHaveProperty('clutchUsages');
  });

  it('should generate valid time ranges', () => {
    const data: DriveData = generateTestData();
    expect(data.driverSeatTime.end).toBeGreaterThan(data.driverSeatTime.start);
    expect(data.engineTime.end).toBeGreaterThan(data.engineTime.start);
  });

  it('should generate valid speed data', () => {
    const data: DriveData = generateTestData();
    expect(data.averageSpeed).toBeGreaterThanOrEqual(0);
    expect(data.maxSpeed).toBeGreaterThanOrEqual(data.averageSpeed);
    expect(data.maxSpeed).toBeLessThanOrEqual(200);
  });

  it('should generate valid fuel consumption data', () => {
    const data: DriveData = generateTestData();
    expect(data.fuelConsumption).toBeGreaterThan(0);
    expect(data.fuelConsumption).toBeLessThan(20); // Litre/100km
  });

  it('should generate valid clutch health data', () => {
    const data: DriveData = generateTestData();
    expect(data.clutchHealth).toBeGreaterThanOrEqual(0);
    expect(data.clutchHealth).toBeLessThanOrEqual(100);
  });

  it('should generate valid gear shifts data', () => {
    const data: DriveData = generateTestData();
    data.gearShifts.forEach((shift: GearShift) => {
      expect(shift.clutchDuration).toBeDefined();
      expect(shift.fromGear).toBeGreaterThanOrEqual(0);
      expect(shift.toGear).toBeGreaterThanOrEqual(0);
      expect(shift.revMatching).toBeDefined();
    });
  });

  it('should generate valid brake usage data', () => {
    const data: DriveData = generateTestData();
    data.brakeUsages.forEach((usage: BrakeUsage) => {
      expect(usage.intensity).toBeDefined();
      expect(usage.intensity).toBeGreaterThanOrEqual(0);
      expect(usage.intensity).toBeLessThanOrEqual(100);
      expect(usage.isEmergency).toBeDefined();
    });
  });
});