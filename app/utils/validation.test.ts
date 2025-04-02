import { validateDriveData, validateManualData } from './validation';

describe('Validation Tests', () => {
  describe('Drive Data Validation', () => {
    it('validates complete drive data correctly', () => {
      const validData = {
        averageSpeed: 60,
        maxSpeed: 120,
        distance: 100,
        fuelUsed: 8.5
      };
      expect(validateDriveData(validData)).toBeTruthy();
    });

    it('rejects invalid speed values', () => {
      const invalidData = {
        averageSpeed: -10,
        maxSpeed: 250,
        distance: 100,
        fuelUsed: 8.5
      };
      expect(() => validateDriveData(invalidData)).toThrow(/hız değeri/i);
    });

    it('validates speed relationship', () => {
      const invalidData = {
        averageSpeed: 100,
        maxSpeed: 80,
        distance: 100,
        fuelUsed: 8.5
      };
      expect(() => validateDriveData(invalidData)).toThrow(/ortalama hız/i);
    });

    it('validates fuel consumption', () => {
      const invalidData = {
        averageSpeed: 60,
        maxSpeed: 120,
        distance: 100,
        fuelUsed: -5
      };
      expect(() => validateDriveData(invalidData)).toThrow(/yakıt tüketimi/i);
    });
  });

  describe('Manual Data Validation', () => {
    it('validates complete manual data correctly', () => {
      const validData = {
        gearShiftCount: 50,
        clutchUsageCount: 75,
        brakeUsageCount: 30,
        emergencyBrakeCount: 5
      };
      expect(validateManualData(validData)).toBeTruthy();
    });

    it('validates gear shift count range', () => {
      const invalidData = {
        gearShiftCount: 250,
        clutchUsageCount: 75,
        brakeUsageCount: 30,
        emergencyBrakeCount: 5
      };
      expect(() => validateManualData(invalidData)).toThrow(/vites sayısı/i);
    });

    it('validates clutch usage count range', () => {
      const invalidData = {
        gearShiftCount: 50,
        clutchUsageCount: 250,
        brakeUsageCount: 30,
        emergencyBrakeCount: 5
      };
      expect(() => validateManualData(invalidData)).toThrow(/debriyaj kullanım/i);
    });

    it('validates brake usage relationships', () => {
      const invalidData = {
        gearShiftCount: 50,
        clutchUsageCount: 75,
        brakeUsageCount: 20,
        emergencyBrakeCount: 30
      };
      expect(() => validateManualData(invalidData)).toThrow(/ani fren sayısı/i);
    });

    it('validates non-negative values', () => {
      const invalidData = {
        gearShiftCount: -10,
        clutchUsageCount: 75,
        brakeUsageCount: 30,
        emergencyBrakeCount: 5
      };
      expect(() => validateManualData(invalidData)).toThrow(/negatif/i);
    });
  });
});