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
function normalizeTab(v: string | null | undefined): ProgramTab {
  const val = (v || '').toLowerCase();
  if (val === 'training' || val === 'protocols' || val === 'forms' || val === 'resources') return val;
  return 'overview';
}

/**
 * ProgramDetail page component (tabbed, dense layout)
 */
export default function ProgramDetail() {
  const { programSlug = '' } = useParams();
  const [name, setName] = useState<string>(programSlug);
  const [description, setDescription] = useState<string | undefined>(undefined);

  const [training, setTraining] = useState<StorageFileItem[]>([]);
  const [protocols, setProtocols] = useState<StorageFileItem[]>([]);
  const [forms, setForms] = useState<StorageFileItem[]>([]);
  const [resources, setResources] = useState<StorageFileItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // URL tab sync
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab: ProgramTab = useMemo(() => {
    const qs = new URLSearchParams(location.search);
    return normalizeTab(qs.get('tab'));
  }, [location.search]);

  /**
   * Count helpers for quick labels
   */
  const counts = {
    training: training.length,
    protocols: protocols.length,
    forms: forms.length,
    resources: resources.length,
  };

  /**
   * Load metadata + grouped files from Supabase storage_files_catalog
   */
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setErr(null);

        // Friendly name/description from curated list
        try {
          const list = await listProgramsFromStorage();
          const meta = list.find((p) => p.slug === programSlug);
          if (mounted) {
            setName(meta?.name || programSlug);
            setDescription(meta?.description || undefined);
          }
        } catch {
          if (mounted) {
            setName(programSlug);
            setDescription(undefined);
          }
        }

        // Only load grouped files if slug is recognized
        if ((ProgramSlugs as readonly string[]).includes(programSlug)) {
          const grouped = await getProgramResourcesGrouped(programSlug as ProgramSlug);
          if (!mounted) return;
          setTraining(grouped.training || []);
          setProtocols(grouped.protocols || []);
          setForms(grouped.forms || []);
          setResources(grouped.resources || []);
        } else {
          throw new Error('Program not found.');
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
      {/* Gradient hero with glass container */}
      <section className="relative -mx-3 bg-gradient-to-br from-blue-700 via-cyan-500 to-teal-400 px-3 py-10 text-white">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="max-w-4xl">
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
            <div className="rounded-xl border border-white/25 bg-white/10 p-8 shadow-lg backdrop-blur-md align-center">
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
          <div className="rounded-md border p-6 text-sm text-slate-600">Loading program…</div>
        ) : err ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-6 text-sm text-red-700">{err}</div>
        ) : (
          <div className="space-y-6">
            {/* Tabs nav */}
            <Card className="overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-300" />
              <CardContent className="p-0">
                <Tabs value={currentTab} onValueChange={handleTabChange}>
                  <div className="sticky top-0 z-20 border-b bg-white/80 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                    <TabsList className="h-9">
                      <TabsTrigger value="overview" className="text-sm">
                        Overview
                      </TabsTrigger>
                      <TabsTrigger value="training" className="text-sm">
                        Training {counts.training ? `(${counts.training})` : ''}
                      </TabsTrigger>
                      <TabsTrigger value="protocols" className="text-sm">
                        Protocols {counts.protocols ? `(${counts.protocols})` : ''}
                      </TabsTrigger>
                      <TabsTrigger value="forms" className="text-sm">
                        Forms {counts.forms ? `(${counts.forms})` : ''}
                      </TabsTrigger>
                      <TabsTrigger value="resources" className="text-sm">
                        Additional Resources {counts.resources ? `(${counts.resources})` : ''}
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Overview */}
                  <TabsContent value="overview" className="px-4 py-4">
                    <div className="space-y-4">
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
