import { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import * as storage from '@/services/storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: string, department: string) => Promise<{ success: boolean; message?: string }>;
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

  async function signup(
    email: string,
    password: string,
    name: string,
    role: string,
    department: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const { user: signedUpUser, error } = await storage.signup(email, password, name, role as any, department);
      if (signedUpUser) {
        // If we have a user but also an error message (like confirmation sent), 
        // we might still consider it "success" but with a message
        if (error && !error.includes('Confirmation')) {
           return { success: false, message: error };
        }
        
        setUser(signedUpUser);
        return { success: true, message: error };
      }
      return { success: false, message: error || 'Signup failed' };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { success: false, message: error.message || 'An unexpected error occurred' };
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
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
