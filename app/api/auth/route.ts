import { NextResponse } from 'next/server';
import type { User, UserProfile, AuthResponse } from '@/app/types/auth';

// Simüle edilmiş kullanıcı veritabanı
let users: User[] = [];
let profiles: UserProfile[] = [];

export async function POST(request: Request) {
  const data = await request.json();
  const { email, password, name, action } = data;

  if (action === 'register') {
    // Kullanıcı zaten var mı kontrol et
    if (users.find(u => u.email === email)) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kayıtlı' },
        { status: 400 }
      );
    }

    // Yeni kullanıcı oluştur
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
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

    // Gerçek uygulamada şifre kontrolü yapılacak
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