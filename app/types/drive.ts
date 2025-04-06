import { StopEvent, StallEvent } from './index';

export interface DriveData {
  id: string;
  vehicleId: string;
  vehicleType: string;
  date: string;
  duration: number;  // minutes
  distance: number;  // kilometers
  driverSeatTime: {
    start: number;  // Unix timestamp
    end: number;    // Unix timestamp
  };
  engineTime: {
    start: number;  // Unix timestamp
    end: number;    // Unix timestamp
  };
  gearTimes: {
    first: number;
    second: number;
    third: number;
    fourth: number;
    fifth: number;
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
  averageSpeed: number;
  maxSpeed: number;
  totalDistance: number;
  fuelConsumption: number;
  drivingStyle: 'economic' | 'normal' | 'sporty';
  clutchHealth: number;
  weatherConditions: {
    temperature: number;
    weather: 'sunny' | 'rainy' | 'snowy' | 'cloudy';
    roadCondition: 'dry' | 'wet' | 'icy' | 'snowy';
  };
}