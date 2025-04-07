import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/firebase/auth';
import { auth } from '@/lib/firebase/config';

export async function POST(request: Request) {
  try {
    const { email, password, name, surname } = await request.json();

    if (!email || !password || !name || !surname) {
      return NextResponse.json(
        { message: 'Tüm alanların doldurulması zorunludur' },
        { status: 400 }
      );
    }

    // Email formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Geçerli bir email adresi giriniz' },
        { status: 400 }
      );
    }

    // Şifre uzunluğunu kontrol et
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Şifre en az 6 karakter olmalıdır' },
        { status: 400 }
      );
    }

    // Kullanıcıyı Firebase'de oluştur
    const displayName = `${name} ${surname}`;
    const user = await registerUser(email, password, displayName);

    // Kullanıcı bilgilerini döndür
    return NextResponse.json(
      { 
        message: 'Kullanıcı başarıyla oluşturuldu',
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified
        }
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Register error:', error);
    
    // Firebase veya diğer servislerden gelen hata mesajlarını kontrol et
    if (error.code === 'auth/email-already-in-use') {
      return NextResponse.json(
        { message: 'Bu email adresi zaten kullanımda' },
        { status: 400 }
      );
    } else if (error.code === 'auth/invalid-email') {
      return NextResponse.json(
        { message: 'Geçersiz email formatı' },
        { status: 400 }
      );
    } else if (error.code === 'auth/weak-password') {
      return NextResponse.json(
        { message: 'Şifre çok zayıf. Lütfen daha güçlü bir şifre seçin' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Kayıt işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin' },
      { status: 500 }
    );
  }
}