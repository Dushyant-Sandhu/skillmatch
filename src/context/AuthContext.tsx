import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: Profile | null;
  role: UserRole;
  loading: boolean;
  unreadCount: number;
  login: (email: string, role: UserRole) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  switchPersona: (userId: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUserAndNotifs = async () => {
    try {
      setLoading(true);
      const res = await api.getMe();
      setUser(res.user);
      const notifs = await api.getNotifications().catch(() => ({ unreadCount: 0 }));
      setUnreadCount(notifs.unreadCount || 0);
    } catch (err) {
      console.warn('[Auth] Failed to load current user, defaulting to demo Alex:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndNotifs();
  }, []);

  const switchPersona = async (userId: string) => {
    try {
      const res = await api.switchPersona(userId);
      setUser(res.user);
      const notifs = await api.getNotifications().catch(() => ({ unreadCount: 0 }));
      setUnreadCount(notifs.unreadCount || 0);
    } catch (err) {
      console.error('Failed to switch persona:', err);
    }
  };

  const login = async (email: string, role: UserRole) => {
    const res = await api.login(email, role);
    setUser(res.user);
    const notifs = await api.getNotifications().catch(() => ({ unreadCount: 0 }));
    setUnreadCount(notifs.unreadCount || 0);
  };

  const signup = async (data: any) => {
    const res = await api.signup(data);
    setUser(res.user);
  };

  const logout = () => {
    setUser(null);
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const res = await api.getMe();
      setUser(res.user);
    } catch (e) {
      console.error('Failed to refresh user:', e);
    }
  };

  const refreshNotifications = async () => {
    try {
      const notifs = await api.getNotifications();
      setUnreadCount(notifs.unreadCount || 0);
    } catch (e) {
      console.error('Failed to refresh notifications:', e);
    }
  };

  const role: UserRole = user?.role || 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        unreadCount,
        login,
        signup,
        logout,
        switchPersona,
        refreshUser,
        refreshNotifications
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
