import { create } from 'zustand';
import { User } from '../types';
import { getSupabaseClient } from '../config/supabaseConfig';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<boolean>;
}

const supabase = getSupabaseClient();

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      console.error('Error logging in:', error?.message);
      return false;
    }

    const user: User = {
      id: data.user.id,
      email: data.user.email ?? '',
      name: data.user.user_metadata.name ?? 'Member',
      role: 'member',
      createdAt: new Date(data.user.created_at),
    };

    set({ user, isAuthenticated: true });
    return true;
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },

  register: async (userData) => {
    // This is a placeholder for a registration function.
    // You would typically call supabase.auth.signUp here.
    console.log('Registering user:', userData);
    return true;
  },
}));
