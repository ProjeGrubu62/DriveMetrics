'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FaGoogle, FaGithub } from 'react-icons/fa';

export default function AuthPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/'); // Giriş yaptıysa ana sayfaya yönlendir
    }
  }, [status, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          DriveMetrics
        </h1>
        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="flex items-center gap-2 bg-white text-black hover:bg-gray-200"
          >
            <FaGoogle className="h-5 w-5" />
            Google ile Giriş Yap
          </Button>
          <Button
            onClick={() => signIn('github', { callbackUrl: '/' })}
            className="flex items-center gap-2 bg-[#24292F] text-white hover:bg-[#24292F]/90"
          >
            <FaGithub className="h-5 w-5" />
            GitHub ile Giriş Yap
          </Button>
        </div>
      </div>
    </div>
  );
} 