import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** true cuando las variables de entorno de Supabase están configuradas */
export const supabaseConfigured = Boolean(url && anonKey);

/** Cliente de Supabase; null hasta que se configuren las variables de entorno */
export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(url!, anonKey!)
  : null;
