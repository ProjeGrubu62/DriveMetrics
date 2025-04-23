import prisma from '../prisma';
import type { Drive } from '@prisma/client';

export async function getUserDriveHistory(userId: string): Promise<Drive[]> {
  try {
    const drives = await prisma.drive.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        date: 'desc'
      }
    });

    return drives;
  } catch (error) {
    console.error('Error fetching drive history:', error);
    return [];
  }
} 