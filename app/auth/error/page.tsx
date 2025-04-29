'use client';

import { useSearchParams } from 'next/navigation';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-red-50">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Giriş Hatası</h1>
      <p className="text-red-800 mb-2">
        {error === 'OAuthAccountNotLinked'
          ? 'Bu e-posta ile daha önce farklı bir sağlayıcı ile giriş yapılmış. Lütfen aynı sağlayıcıyı kullanın.'
          : 'Bir hata oluştu. Lütfen tekrar deneyin.'}
      </p>
      <a href="/auth" className="text-blue-600 underline">Giriş sayfasına dön</a>
    </div>
  );
} 