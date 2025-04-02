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
    
    return {
      averageSpeed: 45 + Math.random() * 20,
      maxSpeed: 85 + Math.random() * 30,
      totalDistance: (45 * duration) / 3600, // km
      fuelConsumption: 7 + Math.random() * 3,
      clutchHealth: Math.max(60, 100 - Math.random() * 40),
      drivingStyle: ['economic', 'normal', 'sporty'][Math.floor(Math.random() * 3)],
      
      speedChanges: generateSpeedChanges(duration, startTime),
      brakeUsages: generateBrakeUsages(duration, startTime),
      clutchUsages: generateClutchUsages(duration, startTime),
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