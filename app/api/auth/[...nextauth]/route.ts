import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
  throw new Error('GitHub OAuth credentials are missing in environment variables');
}

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  callbacks: {
    async session({ session }) {
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
});

export { handler as GET, handler as POST };