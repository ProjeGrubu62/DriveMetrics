import prisma from '../prisma';
import type { DriveData } from '@/app/types/drive';

export async function getUserDriveHistory(userId: string): Promise<DriveData[]> {
  try {
    const drives = await prisma.drive.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        date: 'desc'
      }
    });

    // Convert Prisma Drive to DriveData format
    return drives.map(drive => ({
      id: drive.id,
      vehicleId: drive.userId, // Using userId as vehicleId for now
      vehicleType: drive.vehicleType,
      date: drive.date.toISOString(),
      duration: drive.duration,
      distance: drive.distance,
      driverSeatTime: {
        start: drive.date.getTime(),
        end: drive.date.getTime() + (drive.duration * 60 * 1000)
      },
      engineTime: {
        start: drive.date.getTime(),
        end: drive.date.getTime() + (drive.duration * 60 * 1000)
      },
      gearTimes: {
        first: 0,
        second: 0,
        third: 0,
        fourth: 0,
        fifth: 0
      },
      gearShifts: [],
      speedChanges: [],
      brakeUsages: [],
      clutchUsages: [],
      stopEvents: [],
      stallEvents: [],
      averageSpeed: drive.averageSpeed,
      maxSpeed: drive.averageSpeed * 1.2, // Estimating max speed
      totalDistance: drive.distance,
      fuelConsumption: drive.fuelConsumption,
      drivingStyle: 'normal',
      clutchHealth: 100,
      weatherConditions: {
        temperature: 20,
        weather: 'sunny',
        roadCondition: 'dry'
      }
    }));
  } catch (error) {
    console.error('Error fetching drive history:', error);
    return [];
  }
} 