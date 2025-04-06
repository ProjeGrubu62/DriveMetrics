import { NextResponse } from 'next/server';
import type { User, UserProfile, AuthResponse, LoginCredentials, RegisterData } from '@/app/types/auth';
import bcrypt from 'bcryptjs';

// Simüle edilmiş kullanıcı veritabanı
let users: User[] = [
  {
    id: '1',
    email: 'test@test.com',
    password: '$2a$10$8DXwGrnbzf6Cg/R.HH8zqOQq4QQ.WRNG3ZKBnrW0jUwX1RyPQhxgG', // şifre: test123
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

export async function POST(request: Request) {
  const data = await request.json();
  const { email, password, name, surname, confirmPassword, action } = data;

  if (action === 'register') {
    // Kullanıcı zaten var mı kontrol et
    if (users.find(u => u.email === email)) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kayıtlı' },
        { status: 400 }
      );
    }

    // Şifre kontrolü
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Şifreler eşleşmiyor' },
        { status: 400 }
      );
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

    const response: AuthResponse = {
      user: newUser,
      token: `token_${newUser.id}`, // Gerçek uygulamada JWT kullanılacak
      profile: newProfile,
    };

    return NextResponse.json(response);
  }

  if (action === 'login') {
    const user = users.find(u => u.email === email);
    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Şifre kontrolü
    try {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Geçersiz şifre' },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error('Şifre doğrulama hatası:', error);
      return NextResponse.json(
        { error: 'Şifre doğrulama işlemi başarısız oldu' },
        { status: 500 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Hesabınız aktif değil' },
        { status: 403 }
      );
    }

    user.lastLoginAt = Date.now();
    const profile = profiles.find(p => p.userId === user.id);

    const response: AuthResponse = {
      user,
      token: `token_${user.id}`, // Gerçek uygulamada JWT kullanılacak
      profile: profile!,
    };

    return NextResponse.json(response);
  }

  return NextResponse.json(
    { error: 'Geçersiz işlem' },
    { status: 400 }
  );
}