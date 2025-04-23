import { createContext, useContext } from 'react';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

type AuthContextType = {
  session: Session | null;
  status: "authenticated" | "loading" | "unauthenticated";
};

export const AuthContext = createContext<AuthContextType>({
  session: null,
  status: "unauthenticated"
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  return (
    <AuthContext.Provider value={{ session, status }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 