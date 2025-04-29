import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const handler = NextAuth({
  ...authOptions,
  pages: {
    signIn: '/auth',
    error: '/auth/error',
  },
});

export { handler as GET, handler as POST }; 