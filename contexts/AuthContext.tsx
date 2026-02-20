import { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import * as storage from '@/services/storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      await storage.initializeStorage();
      const currentUser = await storage.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to check user:', error);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const loggedInUser = await storage.login(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  async function logout(): Promise<void> {
    try {
      await storage.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async function refreshUser(): Promise<void> {
    const currentUser = await storage.getCurrentUser();
    setUser(currentUser);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
