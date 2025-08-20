/**
 * Types for the mocked Api service used by Dashboard
 */

/** Announcement item */
export interface Announcement {
  id: string;
  title: string;
  body: string;
  dateISO: string;
}

/** Clinical program item */
export interface ClinicalProgram {
  slug: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  resourceCount: number;
  lastUpdatedISO?: string;
}

/** Quick access item */
export interface QuickAccessItem {
  id: string;
  title: string;
  subtitle?: string;
  cta: 'Download' | 'Watch';
  icon: string; // lucide icon name
  /** Direct URL to open (public file or route) */
  url?: string;
  /** If true, open in a new tab (external link) */
  external?: boolean;
}

/** Resource item for bookmarks or recent activity */
export interface ResourceItem {
  id: string;
  name: string;
  program?: string; // program code/name
  url?: string;
}

/** Recent activity item */
export interface RecentActivity extends ResourceItem {
  accessedAtISO: string;
}
