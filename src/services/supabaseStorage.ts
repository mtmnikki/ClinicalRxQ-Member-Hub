/**
 * Supabase Storage service (REST-based)
 * - Purpose: List and resolve public URLs for files in the single bucket "clinicalrxqfiles".
 * - Honors your exact folder structure from file_list.md (no extra roots).
 * - Provides safe, flattened file items usable directly in UI (no objects rendered by mistake).
 */

import { getSupabaseUrl, getSupabaseAnonKey } from '../config/supabaseConfig';

/** Fixed bucket name per user requirement (case-sensitive) */
export const SUPABASE_BUCKET = 'clinicalrxqfiles';

/** Minimal file object returned by REST list */
interface SupaListObject {
  name: string;
  id?: string | null;
  updated_at?: string;
  created_at?: string;
  last_accessed_at?: string;
  // For files, metadata contains mimetype, size, etc. For folders, typically null/undefined.
  metadata?: {
    size?: number;
    mimetype?: string;
    cacheControl?: string;
    lastModified?: string;
    contentLength?: number;
  } | null;
}

/** UI-facing file item shape */
export interface StorageFileItem {
  /** Full storage path relative to bucket, e.g., "mtmthefuturetoday/Forms/Adherence.pdf" */
  path: string;
  /** Filename only (no extension), preserving original name and casing except extension removed */
  title: string;
  /** Direct public URL */
  url: string;
  /** Raw filename including extension */
  filename: string;
  /** Optional mime type if known */
  mimeType?: string;
  /** Optional size if known */
  size?: number;
}

/**
 * Remove only the last extension from a filename (preserve original name/casing).
 */
export function stripOneExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot <= 0) return filename;
  return filename.slice(0, lastDot);
}

/**
 * Build a public URL for a stored object.
 */
export function buildPublicUrl(path: string): string {
  const base = getSupabaseUrl();
  if (!base) return '';
  // Ensure no leading slashes in path
  const cleanPath = path.replace(/^\/+/, '');
  return `${base}/storage/v1/object/public/${SUPABASE_BUCKET}/${encodeURI(cleanPath)}`;
}

/**
 * Low-level REST list call to Supabase Storage
 * - Non-recursive: returns direct contents under the given prefix.
 */
export async function listPrefix(prefix: string, opts?: { limit?: number; offset?: number }): Promise<SupaListObject[]> {
  const base = getSupabaseUrl();
  const anon = getSupabaseAnonKey();
  if (!base || !anon) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  const url = `${base}/storage/v1/object/list/${encodeURIComponent(SUPABASE_BUCKET)}`;
  const body = {
    prefix: prefix.replace(/^\/+/, '').replace(/\/+$/, ''), // no leading/trailing slash
    limit: opts?.limit ?? 100,
    offset: opts?.offset ?? 0,
    sortBy: { column: 'name', order: 'asc' as const },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Supabase list failed (${res.status}): ${text || res.statusText}`);
  }
  const data = (await res.json()) as SupaListObject[] | { message: string };
  if (!Array.isArray(data)) {
    throw new Error('Unexpected Supabase list response.');
  }
  return data;
}

/**
 * Recursively list files under a prefix.
 * - Detects subfolders via metadata === null (heuristic used by Supabase list).
 * - Guards against infinite loops by tracking visited prefixes.
 */
export async function listFilesDeep(prefix: string): Promise<StorageFileItem[]> {
  const visited = new Set<string>();
  const results: StorageFileItem[] = [];

  async function walk(pfx: string) {
    const key = pfx.replace(/\/+$/, '');
    if (visited.has(key)) return;
    visited.add(key);

    const rows = await listPrefix(key);
    for (const row of rows) {
      const name = row.name;
      const isFolder = !row.metadata || typeof row.metadata?.size !== 'number';
      if (isFolder) {
        // Descend into subfolder
        await walk(`${key}/${name}`);
      } else {
        const path = `${key}/${name}`;
        results.push({
          path,
          url: buildPublicUrl(path),
          filename: name,
          title: stripOneExtension(name),
          mimeType: row.metadata?.mimetype || undefined,
          size: typeof row.metadata?.size === 'number' ? row.metadata?.size : undefined,
        });
      }
    }
  }

  const clean = prefix.replace(/^\/+/, '').replace(/\/+$/, '');
  await walk(clean);
  return results;
}

/**
 * Try multiple candidate folder casings for a program category (e.g., "forms" and "Forms").
 */
export async function listProgramCategory(programSlug: string, category: 'forms' | 'protocols' | 'resources' | 'training'): Promise<StorageFileItem[]> {
  const candidates = category === 'forms' ? ['forms', 'Forms'] : [category];
  const out: StorageFileItem[] = [];
  for (const c of candidates) {
    try {
      const prefix = `${programSlug}/${c}`;
      const items = await listFilesDeep(prefix);
      out.push(...items);
    } catch {
      // Ignore missing prefixes; continue
    }
  }
  return out;
}

/**
 * Global categories (top-level, per your structure).
 */
export async function listGlobalHandouts(): Promise<StorageFileItem[]> {
  return listFilesDeep('patienthandouts');
}

export async function listGlobalGuidelines(): Promise<StorageFileItem[]> {
  return listFilesDeep('clinicalguidelines');
}

export async function listGlobalBilling(): Promise<StorageFileItem[]> {
  return listFilesDeep('medicalbilling');
}

/**
 * List all resources for a given program across its 4 categories.
 */
export async function listAllForProgram(programSlug: string): Promise<{
  forms: StorageFileItem[];
  protocols: StorageFileItem[];
  resources: StorageFileItem[];
  training: StorageFileItem[];
}> {
  const [forms, protocols, resources, training] = await Promise.all([
    listProgramCategory(programSlug, 'forms'),
    listProgramCategory(programSlug, 'protocols'),
    listProgramCategory(programSlug, 'resources'),
    listProgramCategory(programSlug, 'training'),
  ]);
  return { forms, protocols, resources, training };
}

/**
 * Simple mime/type guard helpers
 */
export function isVideo(item: StorageFileItem): boolean {
  if (item.mimeType && item.mimeType.startsWith('video/')) return true;
  const lower = item.filename.toLowerCase();
  return lower.endsWith('.mp4') || lower.endsWith('.mov') || lower.endsWith('.m4v') || lower.endsWith('.webm');
}

export function isPdf(item: StorageFileItem): boolean {
  return item.filename.toLowerCase().endsWith('.pdf');
}

export function isSpreadsheet(item: StorageFileItem): boolean {
  const lower = item.filename.toLowerCase();
  return lower.endsWith('.xls') || lower.endsWith('.xlsx') || lower.endsWith('.csv');
}

export function isDoc(item: StorageFileItem): boolean {
  const lower = item.filename.toLowerCase();
  return lower.endsWith('.doc') || lower.endsWith('.docx');
}
