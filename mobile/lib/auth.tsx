import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { api, getToken, setTokens, removeTokens, isTokenExpired } from './api';
import { parseJwt } from './jwt';

interface User {
  id: string;
  email: string;
  name?: string | null;
  packId: string;
  isAdmin: boolean;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
});

function userFromPayload(payload: Record<string, unknown>): User {
  return {
    id: payload.sub as string,
    email: payload.email as string,
    name: (payload.name as string) || (payload.email as string),
    packId: (payload.pack_id as string) || 'free',
    isAdmin: (payload.is_admin as boolean) || false,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  // Load existing session on mount
  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token && !isTokenExpired(token)) {
        const payload = parseJwt(token);
        if (payload) setUser(userFromPayload(payload));
      } else if (token) {
        await removeTokens();
      }
      setLoading(false);
    })();
  }, []);

  // Redirect based on auth state
  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === '(auth)';
    if (!user && !inAuth) {
      router.replace('/(auth)/login');
    } else if (user && inAuth) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const data = await api.post<{ token: string; refreshToken?: string }>('/api/auth/login', {
        email,
        password,
      });
      await setTokens(data.token, data.refreshToken);
      const payload = parseJwt(data.token);
      if (payload) setUser(userFromPayload(payload));
      return {};
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      return { error: message };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    try {
      const data = await api.post<{ token: string; refreshToken?: string }>('/api/auth/register', {
        email,
        password,
        fullName,
      });
      await setTokens(data.token, data.refreshToken);
      const payload = parseJwt(data.token);
      if (payload) setUser(userFromPayload(payload));
      return {};
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      return { error: message };
    }
  }, []);

  const signOut = useCallback(async () => {
    await removeTokens();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
