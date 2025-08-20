/**
 * Storage catalog (domain-specific helpers)
 * - Primary source: Supabase PostgREST table "storage_files_catalog" (bucket_name === "clinicalrxqfiles").
 * - Fallback: Supabase Storage REST recursive listing (unchanged).
 * - Purpose: Provide high-level queries aligned with your exact folder structure.
 * - Includes the full, fixed program slug list including "timemymeds".
 * - UI constraint: Titles remove only the last extension; preserve original name/casing.
 */

import {
  listAllForProgram,
  listGlobalBilling,
  listGlobalGuidelines,
  listGlobalHandouts,
  StorageFileItem,
  stripOneExtension,
  buildPublicUrl,
} from './supabaseStorage';
import { getSupabaseAnonKey, getSupabaseUrl } from '../config/supabaseConfig';

/** Fixed program slugs present in the bucket (must match folder names exactly) */
export const ProgramSlugs = [
  'mtmthefuturetoday',
  'timemymeds',
  'testandtreat',
  'hba1c',
  'oralcontraceptives',
] as const;

export type ProgramSlug = typeof ProgramSlugs[number];

/**
 * Internal: POSTGREST GET wrapper for /rest/v1
 * - Uses centralized Supabase URL + anon key.
 */
async function pgSelect<T>(pathAndQuery: string): Promise<T> {
  const base = getSupabaseUrl();
  const anon = getSupabaseAnonKey();
  if (!base) {
    throw new Error('Supabase URL is not configured. Set VITE_SUPABASE_URL or localStorage SUPABASE_URL.');
  }
  const url = `${base}/rest/v1${pathAndQuery}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`,
      Accept: 'application/json',
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `PostgREST error: ${res.status}`);
  }
  // Some 204 responses may occur, but selects should generally return JSON
  if (res.status === 204) return [] as unknown as T;
  return (await res.json()) as T;
}

/**
 * Row shape from storage_files_catalog
 */
interface StorageCatalogRow {
  id: string;
  bucket_name: string;
  file_name: string;
  file_path: string;
  file_url?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
  last_modified?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/**
 * Map DB row → UI StorageFileItem
 * - Title is filename without only the last extension.
 * - URL uses file_url if present; otherwise constructs from bucket + path.
 */
function mapRowToItem(row: StorageCatalogRow): StorageFileItem {
  const filename = row.file_name;
  const title = stripOneExtension(filename);
  const path = row.file_path.replace(/^\/+/, ''); // normalize
  const url = row.file_url && row.file_url.trim().length > 0 ? row.file_url : buildPublicUrl(path);
  return {
    path,
    url,
    filename,
    title,
    mimeType: row.mime_type || undefined,
    size: typeof row.file_size === 'number' ? row.file_size : undefined,
  };
}

/**
 * Query helper: list files whose file_path starts with any of the given prefixes (case-insensitive).
 * - Performs multiple ilike queries (one per prefix) and merges results uniquely by file_path.
 */
async function listCatalogByPrefixes(prefixes: string[]): Promise<StorageFileItem[]> {
  if (!prefixes.length) return [];
  const bucket = 'clinicalrxqfiles';
  const results: Record<string, StorageFileItem> = {};

  for (const p of prefixes) {
    const encoded = encodeURIComponent(`${p}%`);
    // Build query: select * where bucket_name=eq.clinicalrxqfiles and file_path ilike prefix%
    const path = `/storage_files_catalog?select=*&bucket_name=eq.${encodeURIComponent(
      bucket
    )}&file_path=ilike.${encoded}&order=file_path.asc`;
    const rows = await pgSelect<StorageCatalogRow[]>(path);
    for (const r of rows) {
      const item = mapRowToItem(r);
      results[item.path] = item;
    }
  }

  return Object.values(results);
}

/**
 * Catalog-backed category lists (prefer DB, fall back to Storage listing)
 */
async function catalogGlobalHandouts(): Promise<StorageFileItem[]> {
  return listCatalogByPrefixes(['patienthandouts/']);
}
async function catalogGlobalGuidelines(): Promise<StorageFileItem[]> {
  return listCatalogByPrefixes(['clinicalguidelines/']);
}
async function catalogGlobalBilling(): Promise<StorageFileItem[]> {
  return listCatalogByPrefixes(['medicalbilling/']);
}

/**
 * Catalog-backed program category
 * - Handles case variants for "forms" ("forms" and "Forms").
 */
async function catalogProgramCategory(
  programSlug: string,
  category: 'forms' | 'protocols' | 'resources' | 'training'
): Promise<StorageFileItem[]> {
  const candidates = category === 'forms' ? ['forms', 'Forms'] : [category];
  const prefixes = candidates.map((c) => `${programSlug}/${c}/`);
  return listCatalogByPrefixes(prefixes);
}

/**
 * Aggregate set for "All resources"
 * - Lightweight union of global sets + optionally a single selected program to keep things performant.
 * - Prefers DB catalog; falls back to storage listing if DB unavailable.
 */
export async function getAllResources(params?: { includeProgram?: ProgramSlug }): Promise<StorageFileItem[]> {
  try {
    const [handouts, guidelines, billing] = await Promise.all([
      catalogGlobalHandouts(),
      catalogGlobalGuidelines(),
      catalogGlobalBilling(),
    ]);
    const base = [...handouts, ...guidelines, ...billing];

    if (!params?.includeProgram) return base;

    const [forms, protocols, resources, training] = await Promise.all([
      catalogProgramCategory(params.includeProgram, 'forms'),
      catalogProgramCategory(params.includeProgram, 'protocols'),
      catalogProgramCategory(params.includeProgram, 'resources'),
      catalogProgramCategory(params.includeProgram, 'training'),
    ]);
    return [...base, ...forms, ...protocols, ...resources, ...training];
  } catch {
    // Fallback: storage recursive listing
    const [handouts, guidelines, billing] = await Promise.all([
      listGlobalHandouts(),
      listGlobalGuidelines(),
      listGlobalBilling(),
    ]);
    const base = [...handouts, ...guidelines, ...billing];
    if (!params?.includeProgram) return base;

    const { forms, protocols, resources, training } = await listAllForProgram(params.includeProgram);
    return [...base, ...forms, ...protocols, ...resources, ...training];
  }
}

/**
 * Get resources for a single global category.
 * - Prefers DB catalog; falls back to storage listing.
 */
export async function getGlobalCategory(cat: 'handouts' | 'guidelines' | 'billing'): Promise<StorageFileItem[]> {
  try {
    switch (cat) {
      case 'handouts':
        return catalogGlobalHandouts();
      case 'guidelines':
        return catalogGlobalGuidelines();
      case 'billing':
        return catalogGlobalBilling();
      default:
        return [];
    }
  } catch {
    switch (cat) {
      case 'handouts':
        return listGlobalHandouts();
      case 'guidelines':
        return listGlobalGuidelines();
      case 'billing':
        return listGlobalBilling();
      default:
        return [];
    }
  }
}

/**
 * Get all resources for a program, grouped.
 * - Prefers DB catalog; falls back to storage listing.
 */
export async function getProgramResourcesGrouped(slug: ProgramSlug): Promise<{
  forms: StorageFileItem[];
  protocols: StorageFileItem[];
  resources: StorageFileItem[];
  training: StorageFileItem[];
}> {
  try {
    const [forms, protocols, resources, training] = await Promise.all([
      catalogProgramCategory(slug, 'forms'),
      catalogProgramCategory(slug, 'protocols'),
      catalogProgramCategory(slug, 'resources'),
      catalogProgramCategory(slug, 'training'),
    ]);
    return { forms, protocols, resources, training };
  } catch {
    return listAllForProgram(slug);
  }
}

/**
 * Program list items for the Programs page.
 * - Purpose: Provide a friendly list of available programs with stable slugs used by ProgramDetail.
 * - Implementation: Derived from ProgramSlugs (no network call). Friendly names/descriptions are curated.
 */
export interface ProgramListItem {
  /** Folder slug that matches Supabase Storage and ProgramDetail route */
  slug: ProgramSlug;
  /** Human-readable program name */
  name: string;
  /** Optional short description */
  description?: string | null;
}

/** Friendly metadata for each program slug */
const ProgramMeta: Record<
  ProgramSlug,
  { name: string; description?: string }
> = {
  mtmthefuturetoday: {
    name: 'MTM The Future Today',
    description:
      'Team-based Medication Therapy Management program with proven protocols and scalable results.',
  },
  timemymeds: {
    name: 'TimeMyMeds',
    description: 'Appointment-based synchronization to enable consistent clinical service delivery.',
  },
  testandtreat: {
    name: 'Test & Treat Services',
    description: 'Patient assessments, CLIA-waived testing, and treatment guidance for flu, strep, and COVID-19.',
  },
  hba1c: {
    name: 'HbA1c Testing',
    description: 'Training and resources for A1c point-of-care testing and quality metrics.',
  },
  oralcontraceptives: {
    name: 'Pharmacist-Initiated Oral Contraceptives',
    description:
      'From patient intake to billing and documentation—simplified, step-by-step service workflows.',
  },
};

/**
 * List available programs.
 * - Returns friendly name + description with correct slug used by ProgramDetail and Storage.
 */
export async function listProgramsFromStorage(): Promise<ProgramListItem[]> {
  // Static list for now; replace with Supabase query if you add a "programs" table later.
  return ProgramSlugs.map((slug) => {
    const meta = ProgramMeta[slug];
    return {
      slug,
      name: meta?.name ?? slug,
      description: meta?.description ?? 'Open to view training modules and resources.',
    };
  });
}
