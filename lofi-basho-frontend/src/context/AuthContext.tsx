'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser, fetchUserData } from '@/app/lib/api';
import { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<{
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;

  }>({
    
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});



export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const userData = await fetchUserData();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: any, password: any) => {
    try {
      const data = await loginUser(email, password);
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
      const userData = await fetchUserData();
      setUser(userData);
      router.push('/profile');
    } catch (error) {
      throw new Error((error as any).response?.data?.detail || 'Login failed');
    }
  };

  const register = async (username: any, email: any, password: any) => {
    try {
      const data = await registerUser(username, email, password);
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
      const userData = await fetchUserData();
      setUser(userData);
      router.push('/profile');
    } catch (error) {
      throw new Error((error as any).response?.data?.detail || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    router.push('/login');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};