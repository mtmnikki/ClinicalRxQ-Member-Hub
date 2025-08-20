/**
 * AppShell
 * - Purpose: Provide a fixed left sidebar layout for gated/member pages.
 * - Desktop-dense pass:
 *   - Sidebar remains fixed.
 *   - Main content uses a compact, desktop-first scale (smaller font + paddings).
 *   - Wider container to use horizontal space on large screens.
 */

import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseClient } from '../../config/supabaseConfig'; // Assuming you have a supabaseClient.ts

interface AppShellProps {
  /** Left sidebar content (e.g., MemberSidebar) */
  sidebar?: React.ReactNode;
  /** Optional top header bar for the page */
  header?: React.ReactNode;
  /** Main content */
  children: React.ReactNode;
}

/**
 * Fixed-width left rail used for both the aside and main area offset.
 * Reduced slightly to increase the working canvas.
 */
const SIDEBAR_WIDTH_PX = 200;

// Supabase client initialization should be handled globally or in a dedicated service/context.
// For demonstration purposes, if you need to access it here, ensure it's imported or passed down.
// Example:
// import { supabase } from '../../services/supabaseClient'; // Assuming you have a supabaseClient.ts
// Or, if you want to initialize it here for some reason (less recommended for global use):
// const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export default function AppShell({ sidebar, header, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Fixed left sidebar */}
      {sidebar ? (
        <aside
          className="fixed inset-y-0 left-0 z-40 w-[200px] border-r border-slate-200 bg-slate-900"
          aria-label="Primary member navigation"
        >
          {/* Inner scroll area for long menus while keeping the frame static */}
          <div className="h-full overflow-y-auto">
            {sidebar}
          </div>
        </aside>
      ) : null}

      {/* Main area offset by the sidebar width */}
      <div
        className="min-h-screen"
        style={{ paddingLeft: sidebar ? `${SIDEBAR_WIDTH_PX}px` : undefined }}
      >
        {/* Optional sticky header bar (page-level) */}
        {header ? (
          <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            {header}
          </div>
        ) : null}

        {/* Page content container */}
        <main className="mx-auto w-full max-w-[1440px] px-3 py-4 text-[13px]">
          {children}
        </main>
      </div>
    </div>
  );
}
