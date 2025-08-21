/**
 * Dashboard page - Supabase Storage Backend
 */

import React, { useEffect, useState } from 'react';
import AppShell from '../components/layout/AppShell';
import { useAuth } from '../components/auth/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  ArrowRight,
  Download,
  PlayCircle,
  FileText,
  BookOpen,
  Zap,
  Award,
} from 'lucide-react';
import { Link } from 'react-router';
import MemberSidebar from '../components/layout/MemberSidebar';
import { 
  listProgramsFromStorage, 
  getAllResources,
  type ProgramListItem 
} from '../services/storageCatalog';
import type { StorageFileItem } from '../services/supabaseStorage';

/**
 * Dashboard data interfaces
 */
interface DashboardProgram {
  slug: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface QuickAccessItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  type: 'video' | 'document';
}

/**
 * Helper: map program to icon
 */
function getProgramIcon(slug: string) {
  switch (slug) {
    case 'mtmthefuturetoday': return BookOpen;
    case 'timemymeds': return Zap;
    case 'testandtreat': return Award;
    case 'hba1c': return FileText;
    case 'oralcontraceptives': return ArrowRight;
    default: return FileText;
  }
}

/**
 * Quick access card component
 */
const QuickCard: React.FC<{ item: QuickAccessItem }> = ({ item }) => {
  const Icon = item.icon;
  const isVideo = item.type === 'video';

  return (
    <Card className="hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-slate-600" />
          <CardTitle className="text-sm">{item.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <a href={item.url} target="_blank" rel="noreferrer">
          <Button variant="secondary" className="h-8 w-full px-3">
            {isVideo ? (
              <>
                <PlayCircle className="mr-2 h-3.5 w-3.5" />
                Watch
              </>
            ) : (
              <>
                <Download className="mr-2 h-3.5 w-3.5" />
                Download
              </>
            )}
          </Button>
        </a>
      </CardContent>
    </Card>
  );
};

/**
 * Dashboard component
 */
export default function Dashboard() {
  const { member } = useAuth();
  const [programs, setPrograms] = useState<DashboardProgram[]>([]);
  const [quickAccess, setQuickAccess] = useState<QuickAccessItem[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Load real data from Supabase Storage
   */
  useEffect(() => {
    let mounted = true;
    
    async function load() {
      try {
        setLoading(true);
        
        // Get programs from storage catalog
        const programData = await listProgramsFromStorage();
        
        // Get some sample resources for quick access
        const resources = await getAllResources();
        
        if (!mounted) return;
        
        // Transform programs
        const dashboardPrograms = programData.map(p => ({
          slug: p.slug,
          name: p.name,
          description: p.description,
          icon: getProgramIcon(p.slug),
        }));
        
        // Create quick access from first few resources
        const quickAccessItems = resources.slice(0, 6).map(r => ({
          title: r.title,
          url: r.url,
          icon: r.filename.endsWith('.mp4') ? PlayCircle : FileText,
          type: r.filename.endsWith('.mp4') ? 'video' as const : 'document' as const,
        }));
        
        setPrograms(dashboardPrograms);
        setQuickAccess(quickAccessItems);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <AppShell sidebar={<MemberSidebar />}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading dashboard...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      header={
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-3 py-3 text-[13px]">
          <div>
            <div className="text-lg font-semibold">Welcome back, {member?.pharmacyName ?? 'Member'}</div>
            <div className="text-slate-600">
              {member?.subscriptionStatus ?? 'Active'} • Last login: {
                member?.lastLoginISO 
                  ? new Date(member.lastLoginISO).toLocaleDateString()
                  : 'Today'
              }
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] text-green-700">
              {member?.subscriptionStatus ?? 'Active'}
            </div>
          </div>
        </div>
      }
      sidebar={<MemberSidebar />}
    >
      <div className="space-y-6">
        {/* Programs Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Clinical Programs</h2>
            <Link to="/member-content">
              <Button variant="outline" size="sm">
                View All <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => {
              const Icon = program.icon;
              return (
                <Card key={program.slug} className="hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base">{program.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3 text-sm text-slate-600">{program.description}</p>
                    <Link to={`/program/${program.slug}`}>
                      <Button className="w-full" size="sm">
                        Access Program
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Quick Access Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Quick Access</h2>
            <Link to="/resources">
              <Button variant="outline" size="sm">
                View All <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickAccess.map((item, index) => (
              <QuickCard key={index} item={item} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
