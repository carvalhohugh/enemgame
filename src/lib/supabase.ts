import { createClient } from '@supabase/supabase-js';

const fallbackSupabaseUrl = 'https://mopqocgkbzfvucoqjhmk.supabase.co';
const fallbackSupabaseAnonKey = 'sb_publishable_q_Ro4j6S22lTkyIiqN0pFw_UznEI7_k';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || fallbackSupabaseUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || fallbackSupabaseAnonKey;

export const supabaseConfigError = !supabaseUrl
  ? 'Variavel VITE_SUPABASE_URL nao configurada.'
  : !supabaseAnonKey
    ? 'Variavel VITE_SUPABASE_ANON_KEY nao configurada.'
    : '';

export const supabase = supabaseConfigError
  ? null
  : createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
