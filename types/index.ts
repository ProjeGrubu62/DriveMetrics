// Araç bilgileri
export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  fuelType: 'diesel' | 'petrol';
  transmission: 'manual' | 'automatic';
  weight: number; // kg
}

// Debriyaj kullanım bilgisi
export interface ClutchUsage {
  timestamp: number;
  duration: number;      // ms cinsinden
  pressure: number;      // 0-1 arası
  isSlipping: boolean;
  isHardRelease: boolean;
  gearAtUse: number;
}

// Vites geçiş bilgisi
export interface GearShift {
  fromGear: number;
  toGear: number;
  speed: number;
  rpm: number;
  timestamp: number;
  clutchUsage: number;  // 0-1 arası
  revMatching: boolean;
  clutchDuration: number; // ms cinsinden
}

// Fren kullanım bilgisi
export interface BrakeUsage {
  timestamp: number;
  intensity: number; // 0-1 arası
  isEmergency: boolean;
  handbrakeUsed: boolean;
}

// Hız değişimi
export interface SpeedChange {
  timestamp: number;
  fromSpeed: number;
  toSpeed: number;
  acceleration: number;
  isSudden: boolean;
}

// Sürüş verisi
export interface DriveData {
  id: string;
  vehicleId: string;
  startTime: number;
  endTime: number;
  totalDistance: number;
  gearShifts: GearShift[];
  brakeUsages: BrakeUsage[];
  speedChanges: SpeedChange[];
  clutchUsages: ClutchUsage[];  // New field
  fuelConsumption: number;
  averageSpeed: number;
  maxSpeed: number;
  drivingStyle: 'economic' | 'normal' | 'sporty';
  clutchHealth: number;  // 0-100 arası
}

// Analiz sonuçları
export interface AnalysisResults {
  driveId: string;
  transmissionHealth: number; // 0-100
  brakeSystemHealth: number; // 0-100
  fuelEfficiency: number; // 0-100
  drivingScore: number; // 0-100
  recommendations: string[];
}