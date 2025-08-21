/** 
 * ProgramDetail page (Supabase-only, storage_files_catalog backed)
 * - Purpose: Display a single clinical program by slug with grouped resources:
 *   Overview, Training Modules, Protocol Manuals, Documentation Forms, Additional Resources.
 * - Data: Supabase Storage via storageCatalog.getProgramResourcesGrouped (no Airtable).
 * - Layout: Blue→cyan gradient hero with glassmorphism container, then a horizontal Tabs nav.
 * - UX: Dense, full-width rows using ProgramResourceRow inside each tab; URL sync via ?tab=.
 */

import { useEffect, useMemo, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Link } from 'react-router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import Breadcrumbs from '../components/common/Breadcrumbs';
import SafeText from '../components/common/SafeText';
import AppShell from '../components/layout/AppShell';
import MemberSidebar from '../components/layout/MemberSidebar';
import ProgramResourceRow from '../components/resources/ProgramResourceRow';
import {
  getProgramResourcesGrouped,
  ProgramSlugs,
  listProgramsFromStorage,
  type ProgramSlug,
} from '../services/storageCatalog';
import type { StorageFileItem } from '../services/supabaseStorage';

/**
 * Tab identifiers for the ProgramDetail page
 */
type ProgramTab = 'overview' | 'training' | 'protocols' | 'forms' | 'resources';

/**
 * Normalize a query param value to a valid ProgramTab, or fallback to 'overview'.
 */
function normalizeTab(tab: string): ProgramTab {
  if (['overview', 'training', 'protocols', 'forms', 'resources'].includes(tab)) {
    return tab as ProgramTab;
  }
  return 'overview';
}

/**
 * ProgramDetail page component
 */
export default function ProgramDetail() {
  const { programSlug } = useParams<{ programSlug: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [training, setTraining] = useState<StorageFileItem[]>([]);
  const [protocols, setProtocols] = useState<StorageFileItem[]>([]);
  const [forms, setForms] = useState<StorageFileItem[]>([]);
  const [resources, setResources] = useState<StorageFileItem[]>([]);

  /** Current tab from URL query param */
  const currentTab = useMemo(() => {
    const qs = new URLSearchParams(location.search);
    return normalizeTab(qs.get('tab') || 'overview');
  }, [location.search]);

  /** Resource counts for display */
  const counts = useMemo(
    () => ({
      training: training.length,
      protocols: protocols.length,
      forms: forms.length,
      resources: resources.length,
    }),
    [training, protocols, forms, resources]
  );

  /**
   * Load program data on mount
   */
  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!programSlug) return;

      try {
        setLoading(true);
        setErr(null);

        // Check if this is a valid slug
        if (!ProgramSlugs.includes(programSlug as ProgramSlug)) {
          throw new Error(`Unknown program: ${programSlug}`);
        }

        // Load resources
        const grouped = await getProgramResourcesGrouped(programSlug as ProgramSlug);

        // Derive program name from storage (first protocol or resource, fallback to slug)
        let programName = programSlug.replace(/[_-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

        // Try to get a better name from actual files
        if (grouped.protocols.length > 0 || grouped.training.length > 0) {
          const firstFile = grouped.protocols[0] || grouped.training[0];
          if (firstFile && firstFile.title) {
            // Extract program name from file title (heuristic)
            const parts = firstFile.title.split(/[:-]/);
            if (parts.length > 1) {
              programName = parts[0].trim();
            }
          }
        }

        if (mounted) {
          setName(programName);
          setDescription(''); // Storage doesn't have descriptions per se
          setTraining(grouped.training);
          setProtocols(grouped.protocols);
          setForms(grouped.forms);
          setResources(grouped.resources);
        }
      } catch (e: any) {
        if (mounted) setErr(e?.message || 'Failed to load program.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [programSlug]);

  /**
   * Handle tab change by writing it into the URL (?tab=...)
   */
  function handleTabChange(next: string) {
    const tab = normalizeTab(next);
    const qs = new URLSearchParams(location.search);
    qs.set('tab', tab);
    navigate({ pathname: location.pathname, search: qs.toString() }, { replace: false });
  }

  /**
   * Render list rows for a group, or an empty state (dense style)
   */
  function renderRows(items: StorageFileItem[], emptyHint: string) {
    if (items.length === 0) {
      return (
        <div className="rounded-md border border-dashed bg-white p-6 text-center text-sm text-slate-600">
          {emptyHint}
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {items.map((i) => (
          <ProgramResourceRow key={i.path} item={i} />
        ))}
      </div>
    );
  }

  return (
    <AppShell sidebar={<MemberSidebar />}>
      {/* Full-width gradient hero with glass container */}
      <section className="relative -mx-3 bg-gradient-to-br from-blue-700 via-cyan-500 to-teal-300 px-3 py-10 text-white">
        {/* Remove max-width constraint to achieve full width between sidebar and viewport edge */}
        <div className="w-full">
            <Breadcrumbs
              variant="light"
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Clinical Programs', to: '/member-content' },
                { label: name || 'Program' },
              ]}
              className="mb-4"
            />

            {/* Glassmorphism container */}
            <div className="rounded-xl border border-white/25 bg-white/10 p-10 shadow-lg backdrop-blur-md align-center">
              <h1 className="text-3xl font-bold leading-tight">
                <SafeText value={name} />
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                  Supabase Storage • storage_files_catalog
                </Badge>
                {!loading ? (
                  <span className="text-xs text-white/80">
                    {counts.training} training • {counts.protocols} protocols • {counts.forms} forms • {counts.resources}{' '}
                    resources
                  </span>
                ) : null}
              </div>
              {description ? (
                <p className="mt-3 max-w-3xl text-sm text-white/90">
                  <SafeText value={description} />
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Loading or error */}
      <section className="py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
            <span className="ml-3 text-slate-600">Loading program...</span>
          </div>
        ) : err ? (
          <div className="py-12 text-center">
            <div className="mb-4 text-lg text-red-600">Failed to load program</div>
            <div className="mb-6 text-slate-600">{err}</div>
            <Link to="/member-content">
              <Button variant="outline" className="bg-transparent">
                ← Back to Programs
              </Button>
            </Link>
          </div>
        ) : (
          <div className="max-w-6xl">
            <Card className="border border-slate-300 bg-white shadow-sm">
              <CardContent className="p-0">
                <Tabs value={currentTab} onValueChange={handleTabChange}>
                  {/* Horizontal navigation */}
                  <TabsList className="grid w-full grid-cols-5 rounded-none border-b bg-slate-50">
                    <TabsTrigger value="overview" className="rounded-none">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="training" className="rounded-none">
                      Training ({counts.training})
                    </TabsTrigger>
                    <TabsTrigger value="protocols" className="rounded-none">
                      Protocols ({counts.protocols})
                    </TabsTrigger>
                    <TabsTrigger value="forms" className="rounded-none">
                      Forms ({counts.forms})
                    </TabsTrigger>
                    <TabsTrigger value="resources" className="rounded-none">
                      Resources ({counts.resources})
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview */}
                  <TabsContent value="overview" className="px-4 py-4">
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold text-slate-900">
                        <SafeText value={name} />
                      </h2>
                      {description ? (
                        <p className="text-sm text-slate-700">
                          <SafeText value={description} />
                        </p>
                      ) : (
                        <p className="text-sm text-slate-600">
                          This program includes training modules, protocols, documentation forms, and additional
                          resources.
                        </p>
                      )}

                      {/* Compact summary blocks */}
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        <div className="rounded-md border bg-white p-3 text-center text-sm">
                          <div className="text-2xl font-semibold text-slate-900">{counts.training}</div>
                          <div className="text-slate-600">Training</div>
                        </div>
                        <div className="rounded-md border bg-white p-3 text-center text-sm">
                          <div className="text-2xl font-semibold text-slate-900">{counts.protocols}</div>
                          <div className="text-slate-600">Protocols</div>
                        </div>
                        <div className="rounded-md border bg-white p-3 text-center text-sm">
                          <div className="text-2xl font-semibold text-slate-900">{counts.forms}</div>
                          <div className="text-slate-600">Forms</div>
                        </div>
                        <div className="rounded-md border bg-white p-3 text-center text-sm">
                          <div className="text-2xl font-semibold text-slate-900">{counts.resources}</div>
                          <div className="text-slate-600">Resources</div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Training */}
                  <TabsContent value="training" className="px-4 py-4">
                    {renderRows(training, 'No training modules available yet.')}
                  </TabsContent>

                  {/* Protocols */}
                  <TabsContent value="protocols" className="px-4 py-4">
                    {renderRows(protocols, 'No protocol manuals available yet.')}
                  </TabsContent>

                  {/* Forms */}
                  <TabsContent value="forms" className="px-4 py-4">
                    {renderRows(forms, 'No documentation forms available yet.')}
                  </TabsContent>

                  {/* Additional Resources */}
                  <TabsContent value="resources" className="px-4 py-4">
                    {renderRows(resources, 'No additional resources available yet.')}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </section>
    </AppShell>
  );
}
