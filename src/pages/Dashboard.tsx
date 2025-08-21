/**
 * Dashboard page (Airtable-free)
 * - Purpose: Removes AirtableStatus usage; keeps existing UI and mock data fetching via Api as-is.
 * - If Api relies on remote services, that is outside Airtable scope here.
 */

import React, { useEffect, useMemo, useState } from 'react';
import AppShell from '../components/layout/AppShell';
import { useAuth } from '../components/auth/AuthContext';
import { Api } from '../services/api';
import {
  Announcement,
  ClinicalProgram,
  QuickAccessItem,
  RecentActivity,
  ResourceItem,
} from '../services/api/types';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  ArrowRight,
  Download,
  PlayCircle,
  FileText,
} from 'lucide-react';
import { Link } from 'react-router';
import MemberSidebar from '../components/layout/MemberSidebar';

/**
 * Helper: map string icon names to lucide-react components safely.
 */
function iconByName(name?: string) {
  switch ((name || '').trim()) {
    case 'ClipboardCheck':
      return require('lucide-react').ClipboardCheck;
    case 'CalendarCheck':
      return require('lucide-react').CalendarCheck;
    case 'Stethoscope':
      return require('lucide-react').Stethoscope;
    case 'Activity':
      return require('lucide-react').Activity;
    case 'FileText':
      return require('lucide-react').FileText;
    case 'FileSpreadsheet':
      return require('lucide-react').FileSpreadsheet;
    case 'TestTubes':
      return require('lucide-react').TestTubes;
    case 'PlayCircle':
      return require('lucide-react').PlayCircle;
    case 'Star':
      return require('lucide-react').Star;
    default:
      return ArrowRight;
  }
}

/**
 * Helper UI chips (compact)
 */
const StatChip: React.FC<{ label: string }> = ({ label }) => (
  <div className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">{label}</div>
);

/**
 * Quick access card component (compact, simplified)
 * - Shows icon + title + action button only.
 * - If the item is a video and duration is available, show a small duration line.
 */
const QuickCard: React.FC<{ item: QuickAccessItem }> = ({ item }) => {
  const Icon = iconByName(item.icon);
  const isVideo = (item as any)?.mediaType === 'video' || item.cta === 'Watch';
  const duration = (item as any)?.duration as string | undefined;

  const content = isVideo ? (
    <>
      <PlayCircle className="mr-2 h-3.5 w-3.5" />
      Watch
    </>
  ) : (
    <>
      <Download className="mr-2 h-3.5 w-3.5" />
      Download
    </>
  );

  return (
    <Card className="hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-slate-600" />
          <CardTitle className="text-sm">{item.title}</CardTitle>
        </div>
        {isVideo && duration ? (
          <div className="text-[11px] text-slate-500">{duration}</div>
        ) : null}
      </CardHeader>
      <CardContent>
        {item.url ? (
          <a href={item.url} target="_blank" rel="noreferrer">
            <Button variant="secondary" className="h-8 w-full px-3">
              {content}
            </Button>
          </a>
        ) : (
          <Link to="/resources">
            <Button variant="secondary" className="h-8 w-full px-3">
              {content}
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Dashboard component (compact)
 */
export default function Dashboard() {
  const { member } = useAuth();
  const [programs, setPrograms] = useState<ClinicalProgram[]>([]);
  const [quick, setQuick] = useState<QuickAccessItem[]>([]);
  const [bookmarks, setBookmarks] = useState<ResourceItem[]>([]);
  const [activity, setActivity] = useState<RecentActivity[]>([]);
  const [ann, setAnn] = useState<Announcement[]>([]);

  /**
   * Load dashboard data in parallel.
   */
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [p, q, b, a, an] = await Promise.all([
          Api.getPrograms(),
          Api.getQuickAccess(),
          Api.getBookmarkedResources(),
          Api.getRecentActivity(),
          Api.getAnnouncements(),
        ]);
        if (!mounted) return;
        setPrograms(p);
        setQuick(q);
        setBookmarks(b);
        setActivity(a);
        setAnn(an);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error loading dashboard data:', e);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  /** Compute subscription color chip */
  const subColor = useMemo(() => {
    switch (member?.subscriptionStatus) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Expiring':
        return 'bg-amber-100 text-amber-700';
      case 'Expired':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  }, [member?.subscriptionStatus]);

  return (
    <AppShell
      header={
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-3 py-3 text-[13px]">
          <div>
            <div className="text-lg font-semibold">Welcome back, {member?.pharmacyName ?? 'Member'}</div>
            {/* Meta row: keep useful context chips */}
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-slate-600">
              <span className={`rounded-full px-2 py-0.5 text-[11px] ${subColor}`}>
                {member?.subscriptionStatus ?? 'Active'}
              </span>
            </div>
          </div>
          <Link to="/resources">
            <Button variant="outline" className="bg-transparent h-8 px-3">
              Browse Resources
            </Button>
          </Link>
        </div>
      }
      sidebar={<MemberSidebar />}
    >
      {/* Programs overview */}
      <section className="mb-6">
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold">Clinical Programs</h2>
          <div className="flex items-center gap-1.5">
            <StatChip label="49+ Active Pharmacies" />
            <StatChip label="HIPAA Compliant" />
            <StatChip label="Updated Monthly" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {programs.map((p) => {
            const Icon = iconByName(p.icon);
            return (
              <Link key={p.slug} to={`/program/${p.slug}`}>
                <Card className="group border-blue-50 hover:border-blue-200 hover:shadow-md">
                  <CardHeader className="pb-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-blue-600" />
                        <CardTitle className="text-sm">{p.name}</CardTitle>
                      </div>
                      <Badge variant="secondary" className="text-[11px]">
                        {p.resourceCount} resources
                      </Badge>
                    </div>
                    <div className="text-[12px] text-slate-500">
                      Updated {p.lastUpdatedISO ? new Date(p.lastUpdatedISO).toLocaleDateString() : '—'}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[13px] text-slate-600">{p.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick access */}
      <section className="mb-6">
        <h2 className="mb-2.5 text-base font-semibold">Quick Access</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {quick.map((q) => (
            <QuickCard key={q.id} item={q} />
          ))}
        </div>
      </section>

      {/* Bookmarked resources */}
      <section className="mb-6">
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-base font-semibold">Your Bookmarked Resources</h2>
          <Link to="/resources" className="text-[12px] text-blue-700 hover:underline">
            View All
          </Link>
        </div>
        {bookmarks.length === 0 ? (
          <div className="rounded-md border border-dashed p-4 text-[13px] text-slate-600">
            No bookmarks yet. Explore the Resource Library and add bookmarks for quick access.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {bookmarks.map((b) => {
              // Lightweight heuristics for icon + optional duration if it's a video
              const isVideo =
                (b as any)?.mediaType === 'video' ||
                typeof (b as any)?.duration === 'string' ||
                String((b as any)?.type || '').toLowerCase() === 'video' ||
                (b.url || '').toLowerCase().match(/\\.(mp4|mov|m4v|webm)$/) != null;
              const duration = (b as any)?.duration as string | undefined;

              return (
                <Card key={b.id} className="hover:shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      {isVideo ? (
                        <PlayCircle className="h-4 w-4 text-slate-600" />
                      ) : (
                        <FileText className="h-4 w-4 text-slate-600" />
                      )}
                      <CardTitle className="text-[13px]">{b.name}</CardTitle>
                    </div>
                    {isVideo && duration ? (
                      <div className="text-[11px] text-slate-500">{duration}</div>
                    ) : null}
                  </CardHeader>
                  <CardContent>
                    {b.url ? (
                      <a href={b.url} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="secondary" className="h-8 w-full px-3">
                          <Download className="mr-2 h-3.5 w-3.5" />
                          Download
                        </Button>
                      </a>
                    ) : (
                      <Link to="/resources">
                        <Button size="sm" variant="secondary" className="h-8 w-full px-3">
                          <Download className="mr-2 h-3.5 w-3.5" />
                          View in Library
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Recent activity and announcements */}
      <section className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card>
            <CardHeader className="pb-1.5">
              <CardTitle className="text-sm">Recently Accessed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {activity.map((a) => (
                  <div key={a.id} className="flex items-center justify-between py-2">
                    <div>
                      <div className="text-[13px] font-medium">{a.name}</div>
                      <div className="text-[12px] text-slate-500">
                        {a.program?.toUpperCase()} • {new Date(a.accessedAtISO).toLocaleString()}
                      </div>
                    </div>
                    {a.url ? (
                      <a href={a.url} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="outline" className="bg-transparent h-8 px-3">
                          <Download className="mr-2 h-3.5 w-3.5" />
                          Re-download
                        </Button>
                      </a>
                    ) : (
                      <Link to="/resources">
                        <Button size="sm" variant="outline" className="bg-transparent h-8 px-3">
                          <Download className="mr-2 h-3.5 w-3.5" />
                          View in Library
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="pb-1.5">
              <CardTitle className="text-sm">Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ann.map((an) => (
                  <div key={an.id} className="rounded-md border p-2.5">
                    <div className="text-[13px] font-semibold">{an.title}</div>
                    <div className="text-[12px] text-slate-500">
                      {new Date(an.dateISO).toLocaleDateString()}
                    </div>
                    <div className="mt-0.5 text-[13px] text-slate-700">{an.body}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
