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
  
  // TEMPORARY DEBUG - Remove after fixing
  console.log('pgSelect debug:', { base, anon: anon ? 'PRESENT' : 'MISSING', pathAndQuery });
  
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
 * Program list item for UI display
 */
export interface ProgramListItem {
  slug: ProgramSlug;
  name: string;
  description: string;
  hasTraining: boolean;
  hasProtocols: boolean;
  hasForms: boolean;
  hasResources: boolean;
}

/** Program metadata from site mapping */
export const ProgramMetadata: Record<ProgramSlug, {
  name: string;
  description: string;
  hasTraining: boolean;
  hasProtocols: boolean;
  hasForms: boolean;
  hasResources: boolean;
}> = {
  mtmthefuturetoday: {
    name: 'MTM The Future Today',
    description: 'Comprehensive medication therapy management training with TIP protocols and CMR workflows',
    hasTraining: true,
    hasProtocols: true,
    hasForms: true,
    hasResources: true,
  },
  timemymeds: {
    name: 'TimeMyMeds (MedSync)',
    description: 'Medication synchronization program for improved patient adherence',
    hasTraining: true,
    hasProtocols: true,
    hasForms: true,
    hasResources: false,
  },
  testandtreat: {
    name: 'Test & Treat Services',
    description: 'Point-of-care testing and treatment for Strep, Flu, and COVID-19',
    hasTraining: true,
    hasProtocols: true,
    hasForms: true,
    hasResources: false,
  },
  hba1c: {
    name: 'HbA1c Testing',
    description: 'Hemoglobin A1c testing protocols and billing procedures',
    hasTraining: false,
    hasProtocols: true,
    hasForms: false,
    hasResources: true,
  },
  oralcontraceptives: {
    name: 'Oral Contraceptives',
    description: 'Comprehensive oral contraceptive prescribing and patient care program',
    hasTraining: true,
    hasProtocols: false,
    hasForms: true,
    hasResources: true,
  },
};

/**
 * List all programs with metadata
 */
export async function listProgramsFromStorage(): Promise<ProgramListItem[]> {
  return ProgramSlugs.map(slug => ({
    slug,
    ...ProgramMetadata[slug],
  }));
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
export async function getProgramResourcesGrouped(programSlug: ProgramSlug): Promise<{
  training: StorageFileItem[];
  protocols: StorageFileItem[];
  forms: StorageFileItem[];
  resources: StorageFileItem[];
}> {
  try {
    const [training, protocols, forms, resources] = await Promise.all([
      catalogProgramCategory(programSlug, 'training'),
      catalogProgramCategory(programSlug, 'protocols'),
      catalogProgramCategory(programSlug, 'forms'),
      catalogProgramCategory(programSlug, 'resources'),
    ]);
    return { training, protocols, forms, resources };
  } catch {
    const { forms, protocols, resources, training } = await listAllForProgram(programSlug);
    return { training, protocols, forms, resources };
  }
}
