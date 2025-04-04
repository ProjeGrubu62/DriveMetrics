import { Vehicle, DriveData, GearShift, BrakeUsage, SpeedChange, ClutchUsage } from '../types';

// Rastgele sayı üretme fonksiyonu
const random = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

// Rastgele boolean üretme
const randomBoolean = () => Math.random() > 0.5;

// Rastgele vites geçişi üretme
// Add new clutch usage generator
const generateClutchUsage = (timestamp: number, currentGear: number): ClutchUsage => {
  return {
    timestamp,
    duration: random(500, 2000),    // 500ms to 2s
    pressure: random(0, 1),
    isSlipping: randomBoolean(),
    isHardRelease: randomBoolean(),
    gearAtUse: currentGear
  };
};

// Update generateGearShift to include clutchDuration
const generateGearShift = (timestamp: number): GearShift => {
  const fromGear = Math.floor(random(1, 6));
  const toGear = Math.floor(random(1, 6));
  
  return {
    fromGear,
    toGear,
    speed: random(0, 120),
    rpm: random(1000, 4000),
    timestamp,
    clutchUsage: random(0, 1),
    revMatching: randomBoolean(),
    clutchDuration: random(500, 2000)  // 500ms to 2s
  };
};

// Rastgele fren kullanımı üretme
const generateBrakeUsage = (timestamp: number): BrakeUsage => {
  return {
    timestamp,
    intensity: random(0, 1),
    isEmergency: randomBoolean(),
    handbrakeUsed: randomBoolean()
  };
};

// Rastgele hız değişimi üretme
const generateSpeedChange = (timestamp: number): SpeedChange => {
  const fromSpeed = random(0, 120);
  const toSpeed = random(0, 120);
  
  return {
    timestamp,
    fromSpeed,
    toSpeed,
    acceleration: (toSpeed - fromSpeed) / 10, // 10 saniyelik değişim
    isSudden: Math.abs(toSpeed - fromSpeed) > 30
  };
};

// Tam bir sürüş verisi üretme
export const generateDriveData = (vehicle: Vehicle, duration: number = 3600): DriveData => {
  const startTime = Date.now();
  const endTime = startTime + (duration * 1000);
  const gearShifts: GearShift[] = [];
  const brakeUsages: BrakeUsage[] = [];
  const speedChanges: SpeedChange[] = [];
  const clutchUsages: ClutchUsage[] = [];
  const stopEvents = [];
  const stallEvents = [];
  
  // Her 5 dakikada bir veri üret
  for (let i = 0; i < duration; i += 300) {
    const currentGear = Math.floor(random(1, 6));
    if (randomBoolean()) {
      gearShifts.push(generateGearShift(startTime + i));
      clutchUsages.push(generateClutchUsage(startTime + i, currentGear));
    }
    if (randomBoolean()) brakeUsages.push(generateBrakeUsage(startTime + i));
    if (randomBoolean()) speedChanges.push(generateSpeedChange(startTime + i));
  }
  
  const drivingStyle = random(0, 1) < 0.3 ? 'sporty' : 
                      random(0, 1) < 0.5 ? 'normal' : 'economic';
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    vehicleId: vehicle.id,
    driverSeatTime: {
      start: startTime,
      end: endTime
    },
    engineTime: {
      start: startTime + 5000,
      end: endTime - 3000
    },
    totalDistance: random(10, 100),
    gearShifts,
    brakeUsages,
    speedChanges,
    clutchUsages,
    stopEvents,
    stallEvents,
    fuelConsumption: random(5, 15),
    averageSpeed: random(30, 90),
    maxSpeed: random(90, 150),
    drivingStyle,
    clutchHealth: random(70, 100),
    weatherConditions: {
      temperature: 20 + random(0, 10),
      weather: ['sunny', 'rainy', 'snowy', 'cloudy'][Math.floor(random(0, 4))] as 'sunny' | 'rainy' | 'snowy' | 'cloudy',
      roadCondition: ['dry', 'wet', 'icy', 'snowy'][Math.floor(random(0, 4))] as 'dry' | 'wet' | 'icy' | 'snowy'
    }
  };
};