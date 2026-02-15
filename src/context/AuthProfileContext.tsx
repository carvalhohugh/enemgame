/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { ClanId } from '@/services/ClanService';

export interface AuthProfile {
  userId: string | null;
  displayName: string;
  email: string | null;
  avatarUrl: string;
  clanId: ClanId | null; // Added ClanId
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

interface AuthProfileContextValue {
  profile: AuthProfile;
  updateClan: (clanId: ClanId) => Promise<void>;
}

const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Estudante&backgroundColor=7c3aed';

const initialProfile: AuthProfile = {
  userId: null,
  displayName: 'Estudante',
  email: null,
  avatarUrl: defaultAvatar,
  clanId: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
};

const ADMIN_EMAILS = new Set([
  'hugocamposdecarvalho@gmail.com',
  'roosevelt.miranda@gmail.com',
]);

function toTitleCase(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((chunk) => chunk[0].toUpperCase() + chunk.slice(1))
    .join(' ');
}

function resolveDisplayName(user: User): string {
  const metadata = user.user_metadata ?? {};
  const metadataName =
    (typeof metadata.full_name === 'string' && metadata.full_name) ||
    (typeof metadata.name === 'string' && metadata.name) ||
    (typeof metadata.display_name === 'string' && metadata.display_name) ||
    (typeof metadata.username === 'string' && metadata.username) ||
    null;

  if (metadataName && metadataName.trim().length > 0) {
    return toTitleCase(metadataName);
  }

  const emailPrefix = user.email?.split('@')[0] ?? 'Estudante';
  return toTitleCase(emailPrefix.replace(/[._-]+/g, ' '));
}

function resolveAvatar(user: User, displayName: string): string {
  const metadata = user.user_metadata ?? {};
  const metadataAvatar =
    (typeof metadata.avatar_url === 'string' && metadata.avatar_url) ||
    (typeof metadata.picture === 'string' && metadata.picture) ||
    null;

  if (metadataAvatar && metadataAvatar.trim().length > 0) {
    return metadataAvatar;
  }

  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=7c3aed`;
}

function mapUserToProfile(user: User | null): AuthProfile {
  if (!user) {
    // Fallback to localStorage for dev/demo if Supabase is offline/not logged in
    const localClan = localStorage.getItem('enemgame_clan') as ClanId | null;
    const localAdmin = localStorage.getItem('enemgame_admin') === 'true';
    return {
      ...initialProfile,
      clanId: localClan,
      isAdmin: localAdmin,
      isLoading: false,
    };
  }

  const displayName = resolveDisplayName(user);
  const resolvedEmail = user.email?.toLowerCase().trim() ?? null;
  const isAdmin = resolvedEmail ? ADMIN_EMAILS.has(resolvedEmail) : false;
  const clanId = (user.user_metadata?.clanId as ClanId) || (localStorage.getItem('enemgame_clan') as ClanId) || null;

  return {
    userId: user.id,
    displayName,
    email: resolvedEmail,
    avatarUrl: resolveAvatar(user, displayName),
    clanId,
    isAuthenticated: true,
    isAdmin,
    isLoading: false,
  };
}

const AuthProfileContext = createContext<AuthProfileContextValue | null>(null);

export function AuthProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<AuthProfile>(() =>
    supabase
      ? initialProfile
      : {
        ...initialProfile,
        isLoading: false,
      },
  );

  useEffect(() => {
    let isMounted = true;
    const supabaseClient = supabase;

    // Load initial state from localStorage if needed (for immediate feedback)
    const localClan = localStorage.getItem('enemgame_clan') as ClanId | null;
    if (localClan && !profile.clanId) {
      setProfile(prev => ({ ...prev, clanId: localClan }));
    }

    if (!supabaseClient) {
      return undefined;
    }

    const loadUser = async () => {
      const { data } = await supabaseClient.auth.getUser();

      if (!isMounted) {
        return;
      }

      setProfile(mapUserToProfile(data.user ?? null));
    };

    void loadUser();

    const { data: authSubscription } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return;
      }

      setProfile(mapUserToProfile(session?.user ?? null));
    });

    return () => {
      isMounted = false;
      authSubscription.subscription.unsubscribe();
    };
  }, []);

  const updateClan = async (clanId: ClanId) => {
    // 1. Update Local State
    setProfile(prev => ({ ...prev, clanId }));
    localStorage.setItem('enemgame_clan', clanId);

    // 2. Update Supabase if logged in
    if (profile.userId && supabase) {
      try {
        await supabase.auth.updateUser({
          data: { clanId }
        });
      } catch (error) {
        console.error("Error updating clan in Supabase:", error);
      }
    }
  };

  const value = useMemo<AuthProfileContextValue>(
    () => ({
      profile,
      updateClan,
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
