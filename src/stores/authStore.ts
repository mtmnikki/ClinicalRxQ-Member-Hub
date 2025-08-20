// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      session: null,
      isLoading: true,
      isAuthenticated: false,

      initialize: async () => {
        try {
          set({ isLoading: true });

          // Check for existing session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('Session error:', sessionError);
            set({ isLoading: false });
            return;
          }

          if (session?.user) {
            set({ 
              session, 
              user: session.user, 
              isAuthenticated: true 
            });
            
            // Fetch user profile
            await get().fetchProfile();
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.email);
            
            if (event === 'SIGNED_IN' && session) {
              set({ 
                session, 
                user: session.user, 
                isAuthenticated: true 
              });
              await get().fetchProfile();
            } else if (event === 'SIGNED_OUT') {
              set({ 
                session: null, 
                user: null, 
                profile: null, 
                isAuthenticated: false 
              });
            }
          });
        } catch (error) {
          console.error('Auth initialization error:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password
          });

          if (error) {
            return { success: false, error: error.message };
          }

          if (data.user && data.session) {
            set({ 
              user: data.user, 
              session: data.session, 
              isAuthenticated: true 
            });
            
            await get().fetchProfile();
            return { success: true };
          }

          return { success: false, error: 'Login failed' };
        } catch (error) {
          console.error('Login error:', error);
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          await supabase.auth.signOut();
          
          set({ 
            user: null, 
            profile: null, 
            session: null, 
            isAuthenticated: false 
          });
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (email: string, password: string, userData: Partial<Profile>) => {
        try {
          set({ isLoading: true });
          
          const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: {
                first_name: userData.first_name,
                last_name: userData.last_name,
                pharmacy_name: userData.pharmacy_name,
              }
            }
          });

          if (error) {
            return { success: false, error: error.message };
          }

          if (data.user) {
            // Create profile record
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                email: data.user.email!,
                ...userData
              });

            if (profileError) {
              console.error('Profile creation error:', profileError);
            }

            return { success: true };
          }

          return { success: false, error: 'Registration failed' };
        } catch (error) {
          console.error('Registration error:', error);
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        } finally {
          set({ isLoading: false });
        }
      },

      fetchProfile: async () => {
        const { user } = get();
        if (!user) return;

        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Profile fetch error:', error);
            return;
          }

          if (data) {
            set({ profile: data });
          } else {
            // Create profile if it doesn't exist
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                email: user.email!,
                first_name: user.user_metadata?.first_name || null,
                last_name: user.user_metadata?.last_name || null,
                pharmacy_name: user.user_metadata?.pharmacy_name || null,
              });

            if (insertError) {
              console.error('Profile creation error:', insertError);
            } else {
              // Fetch the newly created profile
              await get().fetchProfile();
            }
          }
        } catch (error) {
          console.error('Profile fetch error:', error);
        }
      },

      updateProfile: async (updates: Partial<Profile>) => {
        const { user } = get();
        if (!user) return { success: false, error: 'Not authenticated' };

        try {
          const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single();

          if (error) {
            return { success: false, error: error.message };
          }

          if (data) {
            set({ profile: data });
          }

          return { success: true };
        } catch (error) {
          console.error('Profile update error:', error);
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        profile: state.profile,
        session: state.session,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
