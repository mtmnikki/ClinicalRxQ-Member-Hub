/**
 * AuthContext
 * - Purpose: Provide a simple auth context API compatible with the requested dashboard imports.
 * - Implementation: Bridges to the existing zustand store (useAuthStore) and adapts to expected shape.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useAuthStore } from '../../stores/authStore';

/**
 * Member information shape expected by the new dashboard UI.
 */
export interface MemberInfo {
  pharmacyName?: string;
  lastLoginISO?: string;
  subscriptionStatus?: 'Active' | 'Expired' | 'Expiring';
  email?: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Context value shape for auth.
 */
interface AuthContextValue {
  member: MemberInfo | null;
}

/**
 * Internal React context.
 */
const AuthContext = createContext<AuthContextValue>({ member: null });

/**
 * AuthProvider
 * - Wraps children and supplies member info derived from the zustand auth store.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();

  /**
   * Map existing User to MemberInfo fields used by the dashboard snippet.
   * - Fix: Avoid mixing ?? and || without parentheses in pharmacyName computation.
   */
  const member = useMemo<MemberInfo | null>(() => {
    if (!isAuthenticated || !user) return null;

    // Derive subscription status
    let subscriptionStatus: MemberInfo['subscriptionStatus'] = 'Active';
    const s = user.subscription?.status;
    if (s === 'cancelled' || s === 'inactive') subscriptionStatus = 'Expired';
    if (s === 'active') subscriptionStatus = 'Active';

    // Build a composed name safely (handles undefined pieces)
    const first = (user as any).firstName as string | undefined;
    const last = (user as any).lastName as string | undefined;
    const composedName = `${first ?? ''} ${last ?? ''}`.trim();
    // Use user.name if present, otherwise composedName, otherwise "Member"
    const pharmacyName = user.name ?? (composedName || 'Member');

    return {
      pharmacyName,
      lastLoginISO: user.createdAt ? new Date(user.createdAt).toISOString() : undefined,
      subscriptionStatus,
      email: user.email,
      firstName: (user as any).firstName,
      lastName: (user as any).lastName,
    };
  }, [isAuthenticated, user]);

  return <AuthContext.Provider value={{ member }}>{children}</AuthContext.Provider>;
}

/**
 * Hook: useAuth
 * - Return current auth context value.
 */
export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
