import prisma from '../prisma';
import type { DriveData } from '@/app/types/drive';
import { generateTestData } from './testData';

export async function getDrives(userId: string): Promise<DriveData[]> {
  // Şimdilik test verisi döndürelim
  return [generateTestData(), generateTestData(), generateTestData()];
}

export async function getUserDriveHistory(userId: string): Promise<DriveData[]> {
  return getDrives(userId);
} 