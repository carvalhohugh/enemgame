/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthProfile {
  userId: string | null;
  displayName: string;
  email: string | null;
  avatarUrl: string;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthProfileContextValue {
  profile: AuthProfile;
}

const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Estudante&backgroundColor=7c3aed';

const initialProfile: AuthProfile = {
  userId: null,
  displayName: 'Estudante',
  email: null,
  avatarUrl: defaultAvatar,
  isAuthenticated: false,
  isLoading: true,
};

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
    return {
      ...initialProfile,
      isLoading: false,
    };
  }

  const displayName = resolveDisplayName(user);

  return {
    userId: user.id,
    displayName,
    email: user.email ?? null,
    avatarUrl: resolveAvatar(user, displayName),
    isAuthenticated: true,
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

  const value = useMemo<AuthProfileContextValue>(
    () => ({
      profile,
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
