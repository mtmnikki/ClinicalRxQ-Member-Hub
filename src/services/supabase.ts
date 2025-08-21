/**
 * Supabase data service via REST (no SDK)
 * - Provides typed helpers for Programs, Program Detail, Resource Library, etc.
 * - Keeps exports compatible with existing pages (programService, resourceLibraryService, authService stubs).
 *
 * IMPORTANT:
 * - Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to be set, OR a localStorage override.
 * - RLS must allow read access with the anon key for relevant tables.
 */

import { getSupabaseAnonKey, getSupabaseUrl } from '../config/supabaseConfig';

/** Program entity */
export interface Program {
  id: string;
  slug: string;
  name: string;
  description?: string;
  overview?: string;
  experience_level?: string;
  created_at: string;
  updated_at: string;
}

/** Training module entity */
export interface TrainingModule {
  id: string;
  program_id: string;
  name: string;
  length?: string;
  link?: string;
  file_path?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** Protocol manual entity */
export interface ProtocolManual {
  id: string;
  program_id: string;
  name: string;
  file_path?: string;
  link?: string;
  created_at: string;
  updated_at: string;
}

/** Documentation form entity */
export interface DocumentationForm {
  id: string;
  program_id: string;
  name: string;
  category?: string;
  file_path?: string;
  link?: string;
  created_at: string;
  updated_at: string;
}

/** Additional resource entity */
export interface AdditionalResource {
  id: string;
  program_id: string;
  name: string;
  file_path?: string;
  link?: string;
  created_at: string;
  updated_at: string;
}

/** Resource library entities */
export interface PatientHandout {
  id: string;
  name: string;
  file_path?: string;
  created_at: string;
  updated_at: string;
}
export interface ClinicalGuideline {
  id: string;
  name: string;
  file_path?: string;
  link?: string;
  created_at: string;
  updated_at: string;
}
export interface MedicalBillingResource {
  id: string;
  name: string;
  file_path?: string;
  created_at: string;
  updated_at: string;
}

/** Profile/auth-related entities (stub for now) */
export interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  pharmacy_name?: string;
  subscription_status?: string;
  created_at: string;
  updated_at: string;
}
export interface Bookmark {
  id: string;
  user_id: string;
  resource_type: string;
  resource_id: string;
  created_at: string;
}
export interface RecentActivity {
  id: string;
  user_id: string;
  resource_name: string;
  resource_type: string;
  accessed_at: string;
}

/**
 * Internal fetch helper with auth headers for Supabase REST.
 * - Uses centralized config helpers with env/localStorage/fallback support.
 */
async function sbFetch<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
  const base = getSupabaseUrl();
  const anon = getSupabaseAnonKey();

  if (!base) {
    throw new Error('Supabase URL is not configured. Set VITE_SUPABASE_URL or localStorage SUPABASE_URL.');
  }

  const url = `${base}/rest/v1${endpoint}`;
  const headers: HeadersInit = {
    Authorization: `Bearer ${anon}`,
    apikey: anon,
    'Content-Type': 'application/json',
    ...(init.headers || {}),
  };

  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Supabase error: ${res.status}`);
  }
  // Some Supabase endpoints return no body (204)
  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

/**
 * Storage helper to construct public URLs (for public buckets only).
 */
export function getStorageUrl(bucket: string, path: string): string {
  const base = getSupabaseUrl();
  if (!base) return '';
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

/**
 * Program services
 */
export const programService = {
  /** Get all programs ordered by name */
  async getAll(): Promise<Program[]> {
    return sbFetch<Program[]>('/programs?select=*&order=name.asc');
  },

  /** Get program by slug */
  async getBySlug(slug: string): Promise<Program | null> {
    const rows = await sbFetch<Program[]>(`/programs?slug=eq.${encodeURIComponent(slug)}&limit=1`);
    return rows?.[0] || null;
  },

  /** Get program with all related rows */
  async getProgramDetail(slug: string): Promise<{
    program: Program;
    modules: TrainingModule[];
    manuals: ProtocolManual[];
    forms: DocumentationForm[];
    resources: AdditionalResource[];
  } | null> {
    const program = await this.getBySlug(slug);
    if (!program) return null;

    const [modules, manuals, forms, resources] = await Promise.all([
      sbFetch<TrainingModule[]>(
        `/training_modules?program_id=eq.${encodeURIComponent(program.id)}&order=sort_order.asc`
      ),
      sbFetch<ProtocolManual[]>(
        `/protocol_manuals?program_id=eq.${encodeURIComponent(program.id)}`
      ),
      sbFetch<DocumentationForm[]>(
        `/documentation_forms?program_id=eq.${encodeURIComponent(program.id)}`
      ),
      sbFetch<AdditionalResource[]>(
        `/additional_resources?program_id=eq.${encodeURIComponent(program.id)}`
      ),
    ]);

    return { program, modules, manuals, forms, resources };
  },
};

/**
 * Resource library services
 */
export const resourceLibraryService = {
  /** Get patient handouts */
  async getPatientHandouts(): Promise<PatientHandout[]> {
    return sbFetch<PatientHandout[]>('/patient_handouts?select=*&order=name.asc');
  },

  /** Get clinical guidelines */
  async getClinicalGuidelines(): Promise<ClinicalGuideline[]> {
    return sbFetch<ClinicalGuideline[]>('/clinical_guidelines?select=*&order=name.asc');
  },

  /** Get medical billing resources */
  async getMedicalBillingResources(): Promise<MedicalBillingResource[]> {
    return sbFetch<MedicalBillingResource[]>('/medical_billing_resources?select=*&order=name.asc');
  },

  /** Merge all resources with category label (optional filter) */
  async getAllResources(category?: string): Promise<
    Array<{
      id: string;
      name: string;
      file_path?: string;
      category: 'handouts' | 'clinical' | 'billing';
    }>
  > {
    const [handouts, guidelines, billing] = await Promise.all([
      !category || category === 'handouts' ? this.getPatientHandouts() : [],
      !category || category === 'clinical' ? this.getClinicalGuidelines() : [],
      !category || category === 'billing' ? this.getMedicalBillingResources() : [],
    ]);

    return [
      ...handouts.map((h) => ({ ...h, category: 'handouts' as const })),
      ...guidelines.map((g) => ({ ...g, category: 'clinical' as const })),
      ...billing.map((b) => ({ ...b, category: 'billing' as const })),
    ];
  },
};

/**
 * Auth/profile/bookmark/activity stubs (no SDK). We'll wire real auth next.
 */
export const authService = {
  /** Return a temporary mock profile so ProtectedRoute can pass during development */
  async getCurrentProfile(): Promise<Profile | null> {
    // TODO: Implement real GoTrue endpoints (auth/v1) for full auth
    return {
      id: 'mock-user',
      email: 'member@example.com',
      first_name: 'Clinical',
      last_name: 'Member',
      pharmacy_name: 'Demo Pharmacy',
      subscription_status: 'Active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  /** No-op update (mock) */
  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    const current = await this.getCurrentProfile();
    return { ...current!, ...updates };
  },

  /** Mock sign-up */
  async signUp(email: string, _password: string, _metadata: Record<string, any>) {
    return { user: { id: 'mock-user' }, session: null };
  },

  /** Mock sign-in */
  async signIn(email: string, _password: string) {
    return { user: { id: 'mock-user' }, session: null };
  },

  /** Mock sign-out */
  async signOut() {
    // no-op
  },

  /** Mock session getter */
  async getSession() {
    return null;
  },
};

/** Bookmark services (stubs) */
export const bookmarkService = {
  async getUserBookmarks(): Promise<Bookmark[]> {
    return [];
  },
  async addBookmark(resourceType: string, resourceId: string) {
    return {
      id: crypto.randomUUID(),
      user_id: 'mock-user',
      resource_type: resourceType,
      resource_id: resourceId,
      created_at: new Date().toISOString(),
    } as Bookmark;
  },
  async removeBookmark(_resourceType: string, _resourceId: string) {
    // no-op
  },
};

/** Activity services (stubs) */
export const activityService = {
  async logActivity(_resourceName: string, _resourceType: string) {
    // no-op
  },
  async getRecentActivity(_limit = 10): Promise<RecentActivity[]> {
    return [];
  },
};
