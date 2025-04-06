import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
  }

  interface Profile {
    email_verified?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}