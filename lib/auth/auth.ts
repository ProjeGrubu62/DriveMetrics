import bcrypt from 'bcryptjs';
import type { User, UserProfile } from '@/app/types/auth';

// Simüle edilmiş veritabanı
let users: User[] = [
  {
    id: '1',
    email: 'test@test.com',
    password: '$2a$10$YQvJzWfQGNBPLXYFN9EFPOYpBmm0.Ue/DzZQJaLEHWOJNJ3lPEQOi', // şifre: test123
    name: 'Test',
    surname: 'User',
    role: 'user',
    isActive: true,
    createdAt: Date.now(),
    lastLoginAt: Date.now(),
  }
];

let profiles: UserProfile[] = [
  {
    userId: '1',
    driveHistory: [],
    statistics: {
      totalDrives: 0,
      totalDistance: 0,
      averageScore: 0,
      skillProgress: {
        clutchControl: 0,
        gearTransitions: 0,
        braking: 0,
        fuelEfficiency: 0,
      },
    },
  }
];

export async function createUser({
  email,
  password,
  name,
  surname,
}: {
  email: string;
  password: string;
  name: string;
  surname: string;
}) {
  // Email kontrolü
  if (users.find((u) => u.email === email)) {
    throw new Error('Bu email adresi zaten kayıtlı');
  }

  // Şifreyi hashle
  const hashedPassword = await bcrypt.hash(password, 10);

  // Yeni kullanıcı oluştur
  const newUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    password: hashedPassword,
    name,
    surname,
    role: 'user',
    isActive: true,
    createdAt: Date.now(),
    lastLoginAt: Date.now(),
  };

  // Yeni profil oluştur
  const newProfile: UserProfile = {
    userId: newUser.id,
    driveHistory: [],
    statistics: {
      totalDrives: 0,
      totalDistance: 0,
      averageScore: 0,
      skillProgress: {
        clutchControl: 0,
        gearTransitions: 0,
        braking: 0,
        fuelEfficiency: 0,
      },
    },
  };

  users.push(newUser);
  profiles.push(newProfile);

  return { user: newUser, profile: newProfile };
}

export async function validateUser(email: string, password: string) {
  const user = users.find((u) => u.email === email);
  if (!user) {
    throw new Error('Kullanıcı bulunamadı');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Geçersiz şifre');
  }

  if (!user.isActive) {
    throw new Error('Hesabınız aktif değil');
  }

  user.lastLoginAt = Date.now();
  const profile = profiles.find((p) => p.userId === user.id);

  return { user, profile };
}