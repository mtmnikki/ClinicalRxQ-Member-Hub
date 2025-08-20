/**
 * Supabase config helpers
 * - Purpose: Centralize access to environment variables for Supabase.
 * - Reads from Vite env first, then optional browser localStorage overrides, then baked-in defaults.
 *
 * Notes:
 * - The anon key is a publishable, client-side key. Baking it in is acceptable for browser apps.
 * - You can still override values at runtime via localStorage for testing without rebuilding:
 *   localStorage.setItem('SUPABASE_URL', 'https://your-ref.supabase.co')
 *   localStorage.setItem('SUPABASE_ANON_KEY', '...anon key...')
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

 /** Default Supabase URL baked in per user request */
const DEFAULT_SUPABASE_URL = 'https://xeyfhlmflsibxzjsirav.supabase.co';

/** Default publishable anon key baked in per user request */
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhleWZobG1mbHNpYnh6anNpcmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5Mjg5ODQsImV4cCI6MjA2OTUwNDk4NH0._wwYVbBmqX26WpbBnPMuuSmUTGG-XhxDwg8vkUS_n8Y';

/**
 * Safely read a value from localStorage (browser only).
 * @param key localStorage key
 * @returns string value or '' if unavailable
 */
function readLocalStorage(key: string): string | '' {
  try {
    if (typeof window === 'undefined') return '';
    const v = window.localStorage.getItem(key);
    return v ? v : '';
  } catch {
    return '';
  }
}

/**
 * Get Supabase URL
 * - Order: VITE_SUPABASE_URL env -> localStorage SUPABASE_URL -> DEFAULT_SUPABASE_URL
 * @returns normalized base URL without trailing slash
 */
export function getSupabaseUrl(): string {
  const envUrl = (import.meta as any)?.env?.VITE_SUPABASE_URL as string | undefined;
  const lsUrl = readLocalStorage('SUPABASE_URL');
  const url = (envUrl && envUrl.trim()) || (lsUrl && lsUrl.trim()) || DEFAULT_SUPABASE_URL;
  return url.replace(/\/*$/, ''); // strip trailing slashes
}

/**
 * Get Supabase anon key
 * - Order: VITE_SUPABASE_ANON_KEY env -> localStorage SUPABASE_ANON_KEY -> DEFAULT_SUPABASE_ANON_KEY
 */
export function getSupabaseAnonKey(): string {
  const envKey = (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY as string | undefined;
  const lsKey = readLocalStorage('SUPABASE_ANON_KEY');
  return (envKey && envKey.trim()) || (lsKey && lsKey.trim()) || DEFAULT_SUPABASE_ANON_KEY;
}

let supabaseClient: SupabaseClient | null = null;

/**
 * Get or create the Supabase client instance
 * - Singleton pattern to ensure one client instance throughout the app
 * - Uses the centralized config helpers for URL and key
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    const url = getSupabaseUrl();
    const key = getSupabaseAnonKey();
    
    if (!url || !key) {
      throw new Error('Supabase URL and anon key are required');
    }
    
    supabaseClient = createClient(url, key, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
  }
  
  return supabaseClient;
}
