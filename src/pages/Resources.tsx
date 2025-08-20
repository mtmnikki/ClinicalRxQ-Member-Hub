/**
 * Resource Library page
 * - Restored inside AppShell + MemberSidebar.
 * - Filters sync with URL query (?cat=handouts|clinical|billing) so sidebar links work.
 * - Minimal results list (icon + name + one action).
 * - Data source: Supabase storage-backed helpers (storageCatalog). No serverless dependency.
 */

import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Grid2x2,
  FileText,
  BookText,
  FileSpreadsheet,
  LibraryBig,
  Play,
  Download,
  Search,
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import MemberSidebar from '../components/layout/MemberSidebar';
import {
  ProgramSlugs,
  getProgramResourcesGrouped,
  type ProgramSlug,
  getGlobalCategory,
} from '../services/storageCatalog';

/** Unified shape for items rendered in results */
interface ResultItem {
  id: string;
  name: string;
  url?: string;
  mimeType?: string;
  source: 'global' | 'program';
}

/** Supported filters */
type FilterKey = 'all' | 'handouts' | 'clinical' | 'billing' | 'program' | 'videos';

/** Determine if a URL or mime represents a video. */
function isVideo({ url, mimeType }: { url?: string; mimeType?: string }): boolean {
  const mime = (mimeType || '').toLowerCase();
  if (mime.startsWith('video/')) return true;
  const u = (url || '').toLowerCase();
  return ['.mp4', '.mov', '.m4v', '.webm', '.avi', '.mkv'].some((ext) => u.endsWith(ext));
}

/** Build a minimal icon block based on whether the item is a video or a document. */
function FileKindIcon({ isVid }: { isVid: boolean }) {
  return isVid ? (
    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-300">
      <Play className="h-4 w-4 text-white" />
    </div>
  ) : (
    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-300">
      <FileText className="h-4 w-4 text-white" />
    </div>
  );
}

/**
 * SidebarCheckboxFilters
 * - Purpose: Compact, grouped checkbox filters shown in the sidebar.
 * - Behavior: Single-select model mapped to the page's FilterKey (clicking any checkbox sets that filter).
 * - Groups:
 *   - Global categories: Patient handouts, Clinical guidelines, Medical billing
 *   - Content types: Program files, Videos
 * - Change: Adds "Clear Filters" action and removes "All resources" row (reset only via the action).
 */
function SidebarCheckboxFilters({
  value,
  onChange,
}: {
  value: FilterKey;
  onChange: (next: FilterKey) => void;
}) {
  /** Render one checkbox row */
  function Row({
    label,
    checked,
    onClick,
  }: {
    label: string;
    checked: boolean;
    onClick: () => void;
  }) {
    return (
      <label className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 hover:bg-slate-50">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-blue-600"
          checked={checked}
          onChange={onClick}
          aria-checked={checked}
        />
        <span className="text-sm text-slate-700">{label}</span>
      </label>
    );
  }

  return (
    <div className="space-y-4" aria-label="Content filters">
      {/* Top action bar with Clear Filters */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Filters</div>
        <button
          type="button"
          onClick={() => onChange('all')}
          className="rounded px-2 py-1 text-xs text-blue-700 hover:bg-blue-50"
          aria-label="Clear all filters"
        >
          Clear Filters
        </button>
      </div>

      <div>
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Global categories
        </div>
        <div className="space-y-1">
          {/* Removed "All resources" row per request */}
          <Row
            label="Patient handouts"
            checked={value === 'handouts'}
            onClick={() => onChange('handouts')}
          />
          <Row
            label="Clinical guidelines"
            checked={value === 'clinical'}
            onClick={() => onChange('clinical')}
          />
          <Row
            label="Medical billing"
            checked={value === 'billing'}
            onClick={() => onChange('billing')}
          />
        </div>
      </div>

      <div>
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Content types
        </div>
        <div className="space-y-1">
          <Row
            label="Program files"
            checked={value === 'program'}
            onClick={() => onChange('program')}
          />
          <Row
            label="Videos"
            checked={value === 'videos'}
            onClick={() => onChange('videos')}
          />
        </div>
      </div>
    </div>
  );
}

/** Square quick filter card */
function QuickFilterCard({
  title,
  subtitle,
  Icon,
  active,
  onClick,
}: {
  title: string;
  subtitle: string;
  Icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'aspect-square w-full rounded-xl border transition-shadow hover:shadow-md',
        active ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white',
      ].join(' ')}
    >
      <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-300">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="mt-1 text-xs text-slate-600">{subtitle}</div>
      </div>
    </button>
  );
}

/**
 * Sync filter with URL query (?cat=handouts|clinical|billing)
 */
function useFilterFromQuery(): [FilterKey, (next: FilterKey, nav?: (url: string) => void) => void] {
  const location = useLocation();

  const current: FilterKey = (() => {
    const cat = new URLSearchParams(location.search).get('cat')?.toLowerCase();
    if (cat === 'handouts' || cat === 'clinical' || cat === 'billing') return cat;
    return 'all';
  })() as FilterKey;

  function set(next: FilterKey, nav?: (url: string) => void) {
    if (next === 'handouts' || next === 'clinical' || next === 'billing') {
      nav?.(`/resources?cat=${next}`);
    } else {
      nav?.('/resources');
    }
  }

  return [current, set];
}

/**
 * Resource Library page component
 */
export default function Resources() {
  const navigate = useNavigate();
  const [filterFromQuery, setFilterFromQuery] = useFilterFromQuery();

  // Local UI state for filter (includes 'program' and 'videos' which are not part of ?cat)
  const [filter, setFilter] = useState<FilterKey>(filterFromQuery);

  // Sync local filter when URL query changes
  useEffect(() => {
    if (filter === 'program' || filter === 'videos') return;
    setFilter(filterFromQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterFromQuery]);

  // Search term
  const [q, setQ] = useState('');

  // Loading/error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data caches
  const [globalHandouts, setGlobalHandouts] = useState<ResultItem[]>([]);
  const [globalClinical, setGlobalClinical] = useState<ResultItem[]>([]);
  const [globalBilling, setGlobalBilling] = useState<ResultItem[]>([]);
  const [programFiles, setProgramFiles] = useState<ResultItem[]>([]);
  const [programLoaded, setProgramLoaded] = useState(false);

  /** Map storage item to ResultItem */
  function mapGlobal(items: { path: string; title: string; url: string; mimeType?: string }[]): ResultItem[] {
    return items.map((i) => ({
      id: i.path,
      name: i.title,
      url: i.url,
      mimeType: i.mimeType,
      source: 'global' as const,
    }));
  }

  /** Lazy-load global categories on demand */
  useEffect(() => {
    let cancelled = false;

    async function ensure(cat: 'handouts' | 'clinical' | 'billing') {
      try {
        setLoading(true);
        setError(null);
        if (cat === 'handouts' && globalHandouts.length === 0) {
          const items = await getGlobalCategory('handouts');
          if (!cancelled) setGlobalHandouts(mapGlobal(items));
        }
        if (cat === 'clinical' && globalClinical.length === 0) {
          const items = await getGlobalCategory('guidelines');
          if (!cancelled) setGlobalClinical(mapGlobal(items));
        }
        if (cat === 'billing' && globalBilling.length === 0) {
          const items = await getGlobalCategory('billing');
          if (!cancelled) setGlobalBilling(mapGlobal(items));
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load resources');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (filter === 'handouts') ensure('handouts');
    if (filter === 'clinical') ensure('clinical');
    if (filter === 'billing') ensure('billing');

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  /** Lazy load program files aggregated across all ProgramSlugs */
  useEffect(() => {
    let cancelled = false;
    async function loadAllProgramFiles() {
      try {
        setLoading(true);
        setError(null);
        const all: ResultItem[] = [];
        await Promise.all((ProgramSlugs as readonly ProgramSlug[]).map(async (slug) => {
          const grouped = await getProgramResourcesGrouped(slug);
          const append = (items: { path: string; title: string; url: string; mimeType?: string }[]) => {
            for (const it of items) {
              all.push({
                id: it.path,
                name: it.title,
                url: it.url,
                mimeType: it.mimeType,
                source: 'program',
              });
            }
          };
          append(grouped.forms);
          append(grouped.protocols);
          append(grouped.resources);
          append(grouped.training);
        }));
        if (cancelled) return;
        const map = new Map<string, ResultItem>();
        all.forEach((r) => map.set(r.id, r));
        setProgramFiles(Array.from(map.values()));
        setProgramLoaded(true);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load program files');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if ((filter === 'program' || filter === 'videos') && !programLoaded) {
      loadAllProgramFiles();
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, programLoaded]);

  /** Build display list based on active filter */
  const items: ResultItem[] = useMemo(() => {
    if (filter === 'handouts') return globalHandouts;
    if (filter === 'clinical') return globalClinical;
    if (filter === 'billing') return globalBilling;
    if (filter === 'program') return programFiles;

    // videos: merge all known sets and filter by video
    if (filter === 'videos') {
      const merged = [...globalHandouts, ...globalClinical, ...globalBilling, ...programFiles];
      const seen = new Set<string>();
      const deduped = merged.filter((r) => {
        const k = `${r.id}::${r.url || ''}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
      return deduped.filter((r) => isVideo({ url: r.url, mimeType: r.mimeType }));
    }

    // all: union of any already-loaded global sets
    const base = [...globalHandouts, ...globalClinical, ...globalBilling];
    const seen = new Set<string>();
    return base.filter((r) => {
      const k = r.id;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, [filter, globalBilling, globalClinical, globalHandouts, programFiles]);

  /** Apply search by name */
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter((r) => r.name.toLowerCase().includes(term));
  }, [items, q]);

  /** Handlers: update both state and URL where applicable */
  function go(next: FilterKey) {
    setFilter(next);
    // sync URL for the three global categories; clear for others
    if (next === 'handouts' || next === 'clinical' || next === 'billing') {
      setFilterFromQuery(next, (url) => navigate(url));
    } else {
      setFilterFromQuery('all', (url) => navigate(url));
    }
  }

  return (
    <AppShell sidebar={<MemberSidebar />}>
      <div className="mx-auto w-full max-w-[1200px] px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Resource Library</h1>
          <p className="mt-1 text-sm text-slate-600">
            Search and filter patient handouts, guidelines, billing tools, and program files.
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search resources by name…"
              className="pl-9"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>

        {/* Quick filter cards */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          <QuickFilterCard
            title="All Resources"
            subtitle="Browse everything"
            Icon={Grid2x2}
            active={filter === 'all'}
            onClick={() => go('all')}
          />
          <QuickFilterCard
            title="Patient Handouts"
            subtitle="Patient-facing PDFs"
            Icon={FileText}
            active={filter === 'handouts'}
            onClick={() => go('handouts')}
          />
          <QuickFilterCard
            title="Clinical Guidelines"
            subtitle="Reference docs"
            Icon={BookText}
            active={filter === 'clinical'}
            onClick={() => go('clinical')}
          />
          <QuickFilterCard
            title="Medical Billing"
            subtitle="Codes &amp; forms"
            Icon={FileSpreadsheet}
            active={filter === 'billing'}
            onClick={() => go('billing')}
          />
          <QuickFilterCard
            title="Program Files"
            subtitle="All training assets"
            Icon={LibraryBig}
            active={filter === 'program'}
            onClick={() => go('program')}
          />
          <QuickFilterCard
            title="Videos"
            subtitle="Watch training"
            Icon={Play}
            active={filter === 'videos'}
            onClick={() => go('videos')}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Sidebar filters */}
          <aside className="md:col-span-1">
            <SidebarCheckboxFilters value={filter} onChange={go} />
          </aside>

          {/* Results */}
          <section className="md:col-span-3">
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-6 text-sm text-slate-600">Loading…</div>
                ) : error ? (
                  <div className="p-6 text-sm text-red-600">{error}</div>
                ) : filtered.length === 0 ? (
                  <div className="p-6 text-sm text-slate-600">No results.</div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {filtered.map((item) => {
                      const isVid = isVideo({ url: item.url, mimeType: item.mimeType });
                      return (
                        <div key={`${item.source}:${item.id}`} className="flex items-center justify-between px-4 py-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <FileKindIcon isVid={isVid} />
                            <div className="truncate text-sm font-medium text-slate-800">{item.name}</div>
                          </div>
                          <div className="shrink-0">
                            {item.url ? (
                              <a href={item.url} target="_blank" rel="noreferrer">
                                <Button size="sm" variant="outline" className="bg-transparent">
                                  {isVid ? (
                                    <>
                                      <Play className="mr-2 h-4 w-4" />
                                      Play
                                    </>
                                  ) : (
                                    <>
                                      <Download className="mr-2 h-4 w-4" />
                                      Download
                                    </>
                                  )}
                                </Button>
                              </a>
                            ) : (
                              <Button size="sm" variant="outline" disabled className="bg-transparent">
                                Unavailable
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
