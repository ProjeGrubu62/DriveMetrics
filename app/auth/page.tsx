'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const error = searchParams?.get('error');
    if (error) {
      setError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  }, [searchParams]);

  if (!isClient) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Yükleniyor...</div>;
  }

  const handleSignIn = async (provider: string) => {
    try {
      setError(null);
      const callbackUrl = searchParams?.get('callbackUrl') || '/vehicle-setup';
      await signIn(provider, {
        callbackUrl: decodeURIComponent(callbackUrl),
        redirect: true,
      });
    } catch (error) {
      console.error('Giriş hatası:', error);
      setError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            DriveMetrics Sürüş Analiz Sistemine Hoş Geldiniz
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hesabınıza giriş yapın
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                Şununla devam et
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <button
              onClick={() => handleSignIn('google')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Image
                width={20}
                height={20}
                className="h-5 w-5"
                src="/google.svg"
                alt="Google logo"
                priority
              />
              <span className="ml-2">Google ile Giriş Yap</span>
            </button>

            <button
              onClick={() => handleSignIn('github')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Image
                width={20}
                height={20}
                className="h-5 w-5"
                src="/github.svg"
                alt="GitHub logo"
                priority
              />
              <span className="ml-2">GitHub ile Giriş Yap</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 