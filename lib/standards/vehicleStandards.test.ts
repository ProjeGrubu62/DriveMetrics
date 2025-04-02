import { getVehicleStandard } from './vehicleStandards';

describe('Vehicle Standards Tests', () => {
  it('should return correct standards for Toyota Corolla', () => {
    const standard = getVehicleStandard('Toyota', 'Corolla');
    expect(standard).toBeDefined();
    expect(standard.fuelEfficiency).toBeDefined();
    expect(standard.fuelEfficiency.city).toBeGreaterThan(0);
    expect(standard.fuelEfficiency.highway).toBeGreaterThan(0);
    expect(standard.brakeLifespan).toBeDefined();
  });

  it('should handle unknown vehicle models gracefully', () => {
    const standard = getVehicleStandard('Unknown', 'Model');
    expect(standard).toBeNull();
  });

  it('should validate fuel efficiency ranges', () => {
    const standard = getVehicleStandard('Toyota', 'Corolla');
    expect(standard?.fuelEfficiency.city).toBeLessThan(15);
    expect(standard?.fuelEfficiency.highway).toBeLessThan(10);
  });

  it('should validate brake lifespan values', () => {
    const standard = getVehicleStandard('Toyota', 'Corolla');
    expect(standard?.brakeLifespan.pads).toBeGreaterThan(20000);
    expect(standard?.brakeLifespan.discs).toBeGreaterThan(40000);
  });

  it('should handle case-insensitive brand and model names', () => {
    const standard1 = getVehicleStandard('TOYOTA', 'COROLLA');
    const standard2 = getVehicleStandard('toyota', 'corolla');
    expect(standard1).toEqual(standard2);
  });

  it('should include all required standard properties', () => {
    const standard = getVehicleStandard('Toyota', 'Corolla');
    expect(standard).toMatchObject({
      fuelEfficiency: {
        city: expect.any(Number),
        highway: expect.any(Number)
      },
      brakeLifespan: {
        pads: expect.any(Number),
        discs: expect.any(Number)
      },
      clutchLifespan: expect.any(Number),
      serviceIntervals: expect.any(Object)
    });
  });
});