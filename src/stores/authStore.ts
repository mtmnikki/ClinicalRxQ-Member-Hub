/**
 * Authentication state management store
 * - Fix: Align mock user with User type (name instead of firstName/lastName).
 */
import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  /**
   * User login function
   */
  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock authentication logic - check for demo credentials
    if (email === 'duanejones5@gmail.com' && password === 'Pharmacy1') {
      const mockUser: User = {
        id: '1',
        email: 'duanejones5@gmail.com',
        name: 'Duane',
        role: 'member',
        subscription: {
          id: 'sub1',
          planName: 'Premium',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          programs: ['mtm-future-today', 'timemymeds', 'test-treat'],
        },
        createdAt: new Date(),
      };

      set({ user: mockUser, isAuthenticated: true });
      return true;
    }
    return false;
  },

  /**
   * User logout function
   */
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  /**
   * User registration function
   */
  register: async (_userData: Partial<User>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    return true;
  },
}));
