/**
 * MemberSidebar
 * - Purpose: App-level left sidebar for the member area (fixed inside AppShell aside).
 * - Desktop-dense pass with collapsible groups.
 * - Updated: Clinical Program labels now reflect the official names exactly.
 * - Change: Default collapsed state for "Clinical Programs" and "Resource Library".
 * - UX: Groups highlight as active when the current route matches, even if collapsed.
 * - New: Auto-expand "Clinical Programs" when on a program page; auto-expand "Resource Library" when on /resources.
 */

import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  LibraryBig,
  Settings,
  CalendarCheck,
  ClipboardCheck,
  Stethoscope,
  Activity,
  TestTubes,
  LogOut,
  FileText,
  FileSpreadsheet,
  BookText,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useAuthStore } from '../../stores/authStore';

/**
 * Sidebar item descriptor
 */
interface ProgramNavItem {
  slug: string;
  /** Display label shown in the sidebar */
  label: string;
  /** Icon component */
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

/**
 * Clinical Programs (labels updated to official names)
 */
const PROGRAM_ITEMS: ProgramNavItem[] = [
  { slug: 'timemymeds', label: 'TimeMyMeds', Icon: CalendarCheck },
  { slug: 'mtmthefuturetoday', label: 'MTM The Future Today', Icon: ClipboardCheck },
  { slug: 'testandtreat', label: 'Test and Treat: Strep, Flu, COVID', Icon: Stethoscope },
  { slug: 'hba1c', label: 'HbA1c Testing', Icon: Activity },
  { slug: 'oralcontraceptives', label: 'Oral Contraceptives', Icon: TestTubes },
];

/**
 * MemberSidebar component (compact)
 */
export default function MemberSidebar() {
  const location = useLocation();
  const { member } = useAuth();
  const { logout } = useAuthStore();

  // Collapsible groups default to collapsed
  const [openPrograms, setOpenPrograms] = useState(false);
  const [openResources, setOpenResources] = useState(false);

  /** Route active helpers */
  const isDashboard = location.pathname === '/dashboard';
  const isResources = location.pathname.startsWith('/resources');
  const isAccount = location.pathname.startsWith('/account');
  const activeProgramSlug = (location.pathname.match(/^\/program\/([^/]+)/) || [])[1];

  /** Parse current resources category from query (?cat=handouts|billing|clinical) */
  const activeResourceCat = useMemo(() => {
    const qs = new URLSearchParams(location.search);
    const cat = (qs.get('cat') || '').toLowerCase();
    return cat === 'handouts' || cat === 'billing' || cat === 'clinical' ? cat : null;
  }, [location.search]);

  /** Shared classes (compact scale) */
  const itemBase = 'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] transition-colors';
  const itemIdle = 'text-slate-300 hover:bg-slate-800 hover:text-white';
  const itemActive = 'bg-slate-800 text-white';

  /**
   * Consider the Clinical Programs group "active" if:
   * - it is expanded, or
   * - the current route is a program page (even if collapsed).
   */
  const programGroupActive = openPrograms || Boolean(activeProgramSlug);

  /**
   * Auto-expand logic:
   * - When landing on any program detail route, open Clinical Programs group.
   * - When landing on resources route, open Resource Library group.
   * This respects user toggles thereafter (no auto-close).
   */
  useEffect(() => {
    if (activeProgramSlug && !openPrograms) {
      setOpenPrograms(true);
    }
  }, [activeProgramSlug, openPrograms]);

  useEffect(() => {
    if (isResources && !openResources) {
      setOpenResources(true);
    }
  }, [isResources, openResources]);

  return (
    <nav
      aria-label="Member navigation"
      className="flex h-full flex-col p-2 text-slate-100 text-[13px]"
    >
      {/* Brand header — rounded chip "CR" */}
      <div className="mb-2 flex items-center gap-2 px-1.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-[10px] font-bold text-white shadow-inner">
          CR
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold leading-5">ClinicalRxQ</div>
          <div className="truncate text-[11px] text-slate-400">
            {member?.pharmacyName ?? 'Member'}
          </div>
        </div>
      </div>

      {/* Scrollable primary section */}
      <div className="flex-1 overflow-y-auto">
        {/* Dashboard */}
        <Link
          to="/dashboard"
          className={[itemBase, isDashboard ? itemActive : itemIdle, 'mb-1'].join(' ')}
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          <span>Dashboard</span>
        </Link>

        {/* Clinical Programs group */}
        <div className="mt-1">
          <button
            type="button"
            className={[itemBase, 'w-full justify-between', programGroupActive ? itemActive : itemIdle].join(' ')}
            onClick={() => setOpenPrograms((v) => !v)}
            aria-expanded={openPrograms}
            aria-controls="programs-group"
          >
            <span className="inline-flex items-center gap-2">
              <LibraryBig className="h-3.5 w-3.5" />
              Clinical Programs
            </span>
            {openPrograms ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>

          {/* Program list */}
          {openPrograms && (
            <div id="programs-group" className="mt-1 space-y-0.5 pl-2">
              {PROGRAM_ITEMS.map(({ slug, label, Icon }) => {
                const active = activeProgramSlug === slug;
                return (
                  <Link
                    key={slug}
                    to={`/program/${slug}`}
                    className={[itemBase, active ? itemActive : itemIdle, 'justify-between'].join(' ')}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5" />
                      <span className="truncate">{label}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Resource Library group (collapsible with sublinks) */}
        <div className="mt-2">
          <button
            type="button"
            className={[itemBase, 'w-full justify-between', isResources || openResources ? itemActive : itemIdle].join(' ')}
            onClick={() => setOpenResources((v) => !v)}
            aria-expanded={openResources}
            aria-controls="resources-group"
          >
            <span className="inline-flex items-center gap-2">
              <LibraryBig className="h-3.5 w-3.5" />
              Resource Library
            </span>
            {openResources ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>

          {openResources && (
            <div id="resources-group" className="mt-1 space-y-0.5 pl-2">
              <Link
                to="/resources?cat=handouts"
                className={[
                  itemBase,
                  activeResourceCat === 'handouts' ? itemActive : itemIdle,
                  'justify-between',
                ].join(' ')}
              >
                <span className="inline-flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5" />
                  <span className="truncate">Patient Handouts</span>
                </span>
              </Link>
              <Link
                to="/resources?cat=billing"
                className={[
                  itemBase,
                  activeResourceCat === 'billing' ? itemActive : itemIdle,
                  'justify-between',
                ].join(' ')}
              >
                <span className="inline-flex items-center gap-2">
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  <span className="truncate">Medical Billing</span>
                </span>
              </Link>
              <Link
                to="/resources?cat=clinical"
                className={[
                  itemBase,
                  activeResourceCat === 'clinical' ? itemActive : itemIdle,
                  'justify-between',
                ].join(' ')}
              >
                <span className="inline-flex items-center gap-2">
                  <BookText className="h-3.5 w-3.5" />
                  <span className="truncate">Clinical Resources</span>
                </span>
              </Link>
              {/* "All" link to clear filter */}
              <Link
                to="/resources"
                className={[
                  itemBase,
                  activeResourceCat === null ? itemActive : itemIdle,
                  'justify-between',
                ].join(' ')}
              >
                <span className="inline-flex items-center gap-2">
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="truncate">All Resources</span>
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Account Settings */}
        <Link
          to="/account"
          className={[itemBase, isAccount ? itemActive : itemIdle, 'mt-0.5'].join(' ')}
        >
          <Settings className="h-3.5 w-3.5" />
          <span>Account Settings</span>
        </Link>
      </div>

      {/* Bottom Sign out bar */}
      <div className="border-t border-slate-800 pt-2">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-slate-800/60 px-3 py-1.5 text-[12px] text-slate-200 hover:bg-slate-800"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
}
