export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  fuelType: 'petrol' | 'diesel';
  transmission: string;
  weight: number;    // Single weight property
}

// First, let's define the correct types
export interface ManualDriveData {
  averageSpeed: number;
  maxSpeed: number;
  distance: number;
  fuelUsed: number;
}

export interface DriveData {
  gearShifts: {
    fromGear: number;
    toGear: number;
    time: number;
  }[];
  speedChanges: {
    fromSpeed: number;
    toSpeed: number;
    acceleration: number;
    isSudden: boolean;
  }[];
  brakeUsages: {
    intensity: number;
    isEmergency: boolean;
    handbrakeUsed: boolean;
  }[];
  clutchUsages: {
    duration: number;
    gearAtUse: number;
    isHardRelease: boolean;
    isSlipping: boolean;
  }[];
  averageSpeed: number;
  maxSpeed: number;
  totalDistance: number;
  fuelConsumption: number;
  drivingStyle: 'economic' | 'normal' | 'sporty';
  clutchHealth: number;
}