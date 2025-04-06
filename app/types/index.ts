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
  driverSeatTime: {
    start: number;    // Sürücü koltuğuna oturma zamanı
    end: number;      // Sürücü koltuğundan kalkma zamanı
  };
  engineTime: {
    start: number;    // Motor çalıştırma zamanı
    end: number;      // Motor kapatma zamanı
  };
  gearTimes: {
    first: number;
    second: number;
    third: number;
    fourth: number;
    fifth: number;
  };
  stops: {
    count: number;
    totalDuration: number;  // dakika cinsinden
    stallCount: number;     // istop sayısı
  };
  averageSpeed: number;
  maxSpeed: number;
  distance: number;
  fuelUsed: number;
  weatherConditions: {
    temperature: number;
    weather: 'sunny' | 'rainy' | 'snowy' | 'cloudy';
    roadCondition: 'dry' | 'wet' | 'icy' | 'snowy';
  };
  gearShifts: {
    fromGear: number;
    toGear: number;
    speed: number;
    rpm: number;
    timestamp: number;
    clutchUsage: number;
    revMatching: boolean;
    clutchDuration: number;
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
  stopEvents: StopEvent[];
  stallEvents: StallEvent[];
  drivingStyle: 'economic' | 'normal' | 'sporty';
  clutchHealth: number;
}

export interface StopEvent {
  duration: number;  // Duraksama süresi (ms)
  location: {
    latitude: number;
    longitude: number;
  };
  reason?: string;  // Duraksama nedeni (opsiyonel)
}

export interface StallEvent {
  timestamp: number;
  engineRpm: number;
  gear: number;
  clutchPosition: number;  // 0-1 arası (0: tamamen basılı, 1: tamamen bırakılmış)
}

// DriveData interface is now imported from './drive'
export type { DriveData } from './drive';
