export interface SpeedChange {
    fromSpeed: number;
    toSpeed: number;
    acceleration: number;
    isSudden: boolean;
    timestamp: number;
  }
  
  export interface BrakeUsage {
    intensity: number;
    duration: number;
    isEmergency: boolean;
    handbrakeUsed: boolean;
    timestamp: number;
  }
  
  export interface ClutchUsage {
    duration: number;
    gearAtUse: number;
    isHardRelease: boolean;
    isSlipping: boolean;
    timestamp: number;
  }
  
  export function generateTestData(duration: number = 3600) { // duration in seconds
    const startTime = Date.now() - (duration * 1000);
    const endTime = Date.now();
    
    return {
      id: Math.random().toString(36).substring(7),
      vehicleId: Math.random().toString(36).substring(7),
      driverSeatTime: {
        start: startTime,
        end: endTime
      },
      engineTime: {
        start: startTime + 5000, // 5 seconds after sitting
        end: endTime - 3000 // 3 seconds before leaving
      },
      gearShifts: generateGearShifts(duration, startTime),
      speedChanges: generateSpeedChanges(duration, startTime),
      brakeUsages: generateBrakeUsages(duration, startTime),
      clutchUsages: generateClutchUsages(duration, startTime),
      stopEvents: generateStopEvents(duration, startTime),
      stallEvents: generateStallEvents(duration, startTime),
      averageSpeed: 45 + Math.random() * 20,
      maxSpeed: 85 + Math.random() * 30,
      totalDistance: (45 * duration) / 3600, // km
      fuelConsumption: 7 + Math.random() * 3,
      drivingStyle: ['economic', 'normal', 'sporty'][Math.floor(Math.random() * 3)] as 'economic' | 'normal' | 'sporty',
      clutchHealth: Math.max(60, 100 - Math.random() * 40),
      weatherConditions: {
        temperature: 20 + Math.random() * 10,
        weather: ['sunny', 'rainy', 'snowy', 'cloudy'][Math.floor(Math.random() * 4)] as 'sunny' | 'rainy' | 'snowy' | 'cloudy',
        roadCondition: ['dry', 'wet', 'icy', 'snowy'][Math.floor(Math.random() * 4)] as 'dry' | 'wet' | 'icy' | 'snowy'
      }
    };
  }
  
  function generateSpeedChanges(duration: number, startTime: number): SpeedChange[] {
    const changes: SpeedChange[] = [];
    let currentSpeed = 0;
    
    for (let i = 0; i < duration / 10; i++) {
      const speedDiff = (Math.random() - 0.5) * 15;
      const newSpeed = Math.max(0, Math.min(120, currentSpeed + speedDiff));
      
      changes.push({
        fromSpeed: currentSpeed,
        toSpeed: newSpeed,
        acceleration: speedDiff / 10,
        isSudden: Math.abs(speedDiff) > 10,
        timestamp: startTime + (i * 10000)
      });
      
      currentSpeed = newSpeed;
    }
    
    return changes;
  }
  
  function generateBrakeUsages(duration: number, startTime: number): BrakeUsage[] {
    const usages: BrakeUsage[] = [];
    
    for (let i = 0; i < duration / 30; i++) {
      if (Math.random() > 0.7) {
        usages.push({
          intensity: Math.random() * 100,
          duration: 500 + Math.random() * 2000,
          isEmergency: Math.random() > 0.9,
          handbrakeUsed: Math.random() > 0.95,
          timestamp: startTime + (i * 30000)
        });
      }
    }
    
    return usages;
  }
  
  function generateClutchUsages(duration: number, startTime: number): ClutchUsage[] {
    const usages: ClutchUsage[] = [];
    
    for (let i = 0; i < duration / 20; i++) {
      if (Math.random() > 0.6) {
        usages.push({
          duration: 1000 + Math.random() * 3000,
          gearAtUse: Math.floor(Math.random() * 5) + 1,
          isHardRelease: Math.random() > 0.8,
          isSlipping: Math.random() > 0.9,
          timestamp: startTime + (i * 20000)
        });
      }
    }
    
    return usages;
  }

  function generateGearShifts(duration: number, startTime: number) {
    const shifts = [];
    let currentGear = 1;
    
    for (let i = 0; i < duration / 15; i++) {
      if (Math.random() > 0.7) {
        const fromGear = currentGear;
        const toGear = Math.min(5, Math.max(1, currentGear + (Math.random() > 0.5 ? 1 : -1)));
        
        shifts.push({
          fromGear,
          toGear,
          speed: 20 + Math.random() * 60,
          rpm: 1500 + Math.random() * 2000,
          timestamp: startTime + (i * 15000),
          clutchUsage: Math.random(),
          revMatching: Math.random() > 0.7,
          clutchDuration: 800 + Math.random() * 1200
        });
        
        currentGear = toGear;
      }
    }
    
    return shifts;
  }

  function generateStopEvents(duration: number, startTime: number) {
    const events = [];
    
    for (let i = 0; i < duration / 300; i++) { // Average one stop every 5 minutes
      if (Math.random() > 0.7) {
        events.push({
          duration: 30000 + Math.random() * 120000, // 30s to 2m
          location: {
            latitude: 41 + Math.random(),
            longitude: 29 + Math.random()
          },
          reason: ['traffic_light', 'traffic_jam', 'pedestrian', 'parking'][Math.floor(Math.random() * 4)]
        });
      }
    }
    
    return events;
  }

  function generateStallEvents(duration: number, startTime: number) {
    const events = [];
    
    for (let i = 0; i < duration / 600; i++) { // Average one stall every 10 minutes
      if (Math.random() > 0.8) {
        events.push({
          timestamp: startTime + (i * 600000),
          engineRpm: 500 + Math.random() * 500,
          gear: Math.floor(Math.random() * 3) + 1,
          clutchPosition: Math.random() * 0.3 // More likely to stall when clutch is mostly released
        });
      }
    }
    
    return events;
  }