// ... imports
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { ClanId } from '@/services/ClanService';

export interface AuthProfile {
  userId: string | null;
  displayName: string;
  email: string | null;
  avatarUrl: string;
  clanId: ClanId | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

interface AuthProfileContextValue {
  profile: AuthProfile;
  updateClan: (clanId: ClanId) => Promise<void>;
  login: (email: string) => Promise<void>;
  logout: () => void;
}

const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Estudante&backgroundColor=7c3aed';

const initialProfile: AuthProfile = {
  userId: null,
  displayName: '',
  email: null,
  avatarUrl: defaultAvatar,
  clanId: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
};

// ... helpers (toTitleCase, resolveDisplayName, etc.) - keeping them implicitly or I need to rewrite the file to ensure they exist.
// To be safe, I will rewrite the file partially or carefully replace blocks.

const AuthProfileContext = createContext<AuthProfileContextValue | null>(null);

export function AuthProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<AuthProfile>(initialProfile);

  useEffect(() => {
    // Check localStorage for "mock session"
    const storedUser = localStorage.getItem('enemgame_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setProfile({
          ...initialProfile,
          ...parsed,
          isAuthenticated: true,
          isLoading: false
        });
        return;
      } catch (e) {
        localStorage.removeItem('enemgame_user');
      }
    }

    setProfile(p => ({ ...p, isLoading: false }));
  }, []);

  const login = async (email: string) => {
    // Mock Login
    const isAdmin = email.includes('admin');
    const mockProfile = {
      userId: 'mock-user-id',
      displayName: email.split('@')[0],
      email,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}&backgroundColor=7c3aed`,
      clanId: localStorage.getItem('enemgame_clan') as ClanId | null,
      isAuthenticated: true,
      isAdmin,
      isLoading: false
    };

    setProfile(mockProfile);
    localStorage.setItem('enemgame_user', JSON.stringify(mockProfile));
  };

  const logout = () => {
    setProfile({ ...initialProfile, isLoading: false });
    localStorage.removeItem('enemgame_user');
    localStorage.removeItem('enemgame_clan'); // Optional: clear clan on logout? Maybe keep it for UX.
  };

  const updateClan = async (clanId: ClanId) => {
    setProfile(prev => ({ ...prev, clanId }));
    localStorage.setItem('enemgame_clan', clanId);
    // Sync with users mock in localStorage
    const stored = localStorage.getItem('enemgame_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      parsed.clanId = clanId;
      localStorage.setItem('enemgame_user', JSON.stringify(parsed));
    }
  };

  const value = useMemo<AuthProfileContextValue>(
    () => ({
      profile,
      updateClan,
      login,
      logout
    }),
    [profile],
  );

  return <AuthProfileContext.Provider value={value}>{children}</AuthProfileContext.Provider>;
}

export function useAuthProfile(): AuthProfileContextValue {
  const context = useContext(AuthProfileContext);
  if (!context) {
    throw new Error('useAuthProfile deve ser usado dentro de AuthProfileProvider');
  }
  return context;
}
