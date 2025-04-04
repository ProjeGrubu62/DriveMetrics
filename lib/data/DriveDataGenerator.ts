'use client';

import { DriveData } from '@/app/types/drive';

export class DriveDataGenerator {
  private static readonly WEATHER_CONDITIONS = ['sunny', 'rainy', 'snowy', 'cloudy'] as const;
  private static readonly ROAD_CONDITIONS = ['dry', 'wet', 'icy', 'snowy'] as const;

  private static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private static generateTimeRange(durationMinutes: number): { start: number; end: number } {
    const now = Date.now();
    const start = now - (durationMinutes * 60 * 1000);
    return { start, end: now };
  }

  private static generateGearTimes(totalDuration: number): DriveData['gearTimes'] {
    const totalMinutes = totalDuration;
    const gearDistribution = {
      first: 0.1,   // 10% birinci viteste
      second: 0.15, // 15% ikinci viteste
      third: 0.3,   // 30% üçüncü viteste
      fourth: 0.3,  // 30% dördüncü viteste
      fifth: 0.15   // 15% beşinci viteste
    };

    return {
      first: Math.round(totalMinutes * gearDistribution.first),
      second: Math.round(totalMinutes * gearDistribution.second),
      third: Math.round(totalMinutes * gearDistribution.third),
      fourth: Math.round(totalMinutes * gearDistribution.fourth),
      fifth: Math.round(totalMinutes * gearDistribution.fifth)
    };
  }

  private static generateGearShifts(durationMinutes: number, averageSpeed: number): any[] {
    const shiftsCount = this.randomInt(15, 30);
    const shifts = [];
    
    for (let i = 0; i < shiftsCount; i++) {
      const fromGear = this.randomInt(1, 4);
      const toGear = fromGear + (Math.random() > 0.3 ? 1 : -1);
      if (toGear < 1 || toGear > 5) continue;
      
      shifts.push({
        fromGear,
        toGear,
        speed: this.randomInt(20, 100),
        rpm: this.randomInt(1500, 3500),
        timestamp: Date.now() - this.randomInt(0, durationMinutes * 60 * 1000),
        clutchUsage: this.randomInt(70, 100) / 100,
        revMatching: Math.random() > 0.7,
        clutchDuration: this.randomInt(800, 2000)
      });
    }
    
    return shifts;
  }

  private static generateSpeedChanges(durationMinutes: number, averageSpeed: number, maxSpeed: number): any[] {
    const changesCount = this.randomInt(30, 60);
    const changes = [];
    
    for (let i = 0; i < changesCount; i++) {
      const fromSpeed = this.randomInt(0, maxSpeed);
      const toSpeed = Math.min(maxSpeed, Math.max(0, fromSpeed + this.randomInt(-20, 20)));
      const isSudden = Math.random() > 0.8;
      
      changes.push({
        fromSpeed,
        toSpeed,
        acceleration: (toSpeed - fromSpeed) / this.randomInt(5, 15),
        isSudden
      });
    }
    
    return changes;
  }

  private static generateBrakeUsages(durationMinutes: number): any[] {
    const usagesCount = this.randomInt(20, 40);
    const usages = [];
    
    for (let i = 0; i < usagesCount; i++) {
      usages.push({
        intensity: this.randomInt(30, 100) / 100,
        isEmergency: Math.random() > 0.9,
        handbrakeUsed: Math.random() > 0.8
      });
    }
    
    return usages;
  }

  private static generateClutchUsages(durationMinutes: number): any[] {
    const usagesCount = this.randomInt(30, 50);
    const usages = [];
    
    for (let i = 0; i < usagesCount; i++) {
      usages.push({
        duration: this.randomInt(800, 3000),
        gearAtUse: this.randomInt(1, 5),
        isHardRelease: Math.random() > 0.8,
        isSlipping: Math.random() > 0.9
      });
    }
    
    return usages;
  }

  static generateDriveData(params: { [key: string]: boolean }): DriveData {
    const durationMinutes = 40; // Sabit süre
    const driverSeatTime = this.generateTimeRange(durationMinutes);
    const engineTime = {
      start: driverSeatTime.start + this.randomInt(0, 30) * 1000, // 0-30 saniye sonra motor çalıştırma
      end: driverSeatTime.end - this.randomInt(0, 30) * 1000      // 0-30 saniye önce motor kapatma
    };

    const averageSpeed = this.randomInt(30, 70);
    const maxSpeed = averageSpeed + this.randomInt(10, 30);
    const totalDistance = (averageSpeed * durationMinutes) / 60;
    const fuelConsumption = (totalDistance * this.randomInt(5, 8)) / 100; // 5-8 L/100km yakıt tüketimi

    // Analiz sayfasının beklediği veri formatına uygun olarak DriveData nesnesini oluştur
    return {
      id: Date.now().toString(),
      vehicleId: '1',
      startTime: driverSeatTime.start,
      endTime: driverSeatTime.end,
      driverSeatTime,
      engineTime,
      gearTimes: this.generateGearTimes(durationMinutes),
      gearShifts: this.generateGearShifts(durationMinutes, averageSpeed),
      speedChanges: this.generateSpeedChanges(durationMinutes, averageSpeed, maxSpeed),
      brakeUsages: this.generateBrakeUsages(durationMinutes),
      clutchUsages: this.generateClutchUsages(durationMinutes),
      stopEvents: [],
      stallEvents: [],
      averageSpeed,
      maxSpeed,
      totalDistance,
      fuelConsumption,
      drivingStyle: Math.random() > 0.6 ? 'normal' : (Math.random() > 0.5 ? 'economic' : 'sporty'),
      clutchHealth: this.randomInt(70, 100),
      weatherConditions: {
        temperature: this.randomInt(0, 35),
        weather: this.WEATHER_CONDITIONS[this.randomInt(0, this.WEATHER_CONDITIONS.length - 1)],
        roadCondition: this.ROAD_CONDITIONS[this.randomInt(0, this.ROAD_CONDITIONS.length - 1)]
      }
    };
  }
}