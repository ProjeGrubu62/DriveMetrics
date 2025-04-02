import { generateTestData } from './testData';

describe('Test Data Generation Tests', () => {
  it('should generate valid test data', () => {
    const data = generateTestData();
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });

  it('should generate data with required properties', () => {
    const data = generateTestData();
    const firstItem = data[0];
    
    expect(firstItem).toHaveProperty('id');
    expect(firstItem).toHaveProperty('vehicleId');
    expect(firstItem).toHaveProperty('startTime');
    expect(firstItem).toHaveProperty('endTime');
    expect(firstItem).toHaveProperty('gearShifts');
    expect(firstItem).toHaveProperty('speedChanges');
    expect(firstItem).toHaveProperty('brakeUsages');
    expect(firstItem).toHaveProperty('clutchUsages');
  });

  it('should generate valid time ranges', () => {
    const data = generateTestData();
    data.forEach(item => {
      expect(item.startTime).toBeLessThan(item.endTime);
      expect(item.endTime - item.startTime).toBeLessThanOrEqual(24 * 60 * 60 * 1000); // 24 saat
    });
  });

  it('should generate valid speed data', () => {
    const data = generateTestData();
    data.forEach(item => {
      expect(item.averageSpeed).toBeGreaterThanOrEqual(0);
      expect(item.maxSpeed).toBeGreaterThanOrEqual(item.averageSpeed);
      expect(item.maxSpeed).toBeLessThanOrEqual(200);
    });
  });

  it('should generate valid fuel consumption data', () => {
    const data = generateTestData();
    data.forEach(item => {
      expect(item.fuelConsumption).toBeGreaterThan(0);
      expect(item.fuelConsumption).toBeLessThan(20); // Litre/100km
    });
  });

  it('should generate valid clutch health data', () => {
    const data = generateTestData();
    data.forEach(item => {
      expect(item.clutchHealth).toBeGreaterThanOrEqual(0);
      expect(item.clutchHealth).toBeLessThanOrEqual(100);
    });
  });

  it('should generate valid gear shifts data', () => {
    const data = generateTestData();
    data.forEach(item => {
      item.gearShifts.forEach(shift => {
        expect(shift.time).toBeDefined();
        expect(shift.fromGear).toBeGreaterThanOrEqual(0);
        expect(shift.toGear).toBeGreaterThanOrEqual(0);
        expect(shift.isSmooth).toBeDefined();
      });
    });
  });

  it('should generate valid brake usage data', () => {
    const data = generateTestData();
    data.forEach(item => {
      item.brakeUsages.forEach(usage => {
        expect(usage.time).toBeDefined();
        expect(usage.intensity).toBeGreaterThanOrEqual(0);
        expect(usage.intensity).toBeLessThanOrEqual(1);
        expect(usage.isEmergency).toBeDefined();
      });
    });
  });
});