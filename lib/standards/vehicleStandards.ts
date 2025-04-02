export interface VehicleStandard {
  baseWeight: number;
  grossWeight: number; // Added gross weight
  fuelEfficiency: {
    city: number;
    highway: number;
  };
  gearRatios: number[];
  clutchLifespan: number;
  brakeLifespan: {
    pads: number;
    discs: number;
  };
}

const vehicleStandards: Record<string, Record<string, VehicleStandard>> = {
  Toyota: {
    Corolla: {
      baseWeight: 1300,
      grossWeight: 1795, // Actual gross weight for validation
      fuelEfficiency: {
        city: 8.4,
        highway: 6.2
      },
      gearRatios: [3.545, 1.904, 1.310, 0.969, 0.815],
      clutchLifespan: 1500,
      brakeLifespan: {
        pads: 50000,
        discs: 100000
      }
    }
  }
};

export function getVehicleStandard(brand: string, model: string): VehicleStandard | null {
  return vehicleStandards[brand]?.[model] || null;
}

export function calculateIdealGearForSpeed(speed: number, gearRatios: number[]): number {
  // Simple gear recommendation based on speed
  if (speed < 20) return 1;
  if (speed < 40) return 2;
  if (speed < 60) return 3;
  if (speed < 80) return 4;
  return 5;
}