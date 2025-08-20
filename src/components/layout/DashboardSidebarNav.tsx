/**
 * DashboardSidebarNav
 * - Purpose: Sidebar (vertical) and mobile (horizontal) navigation for in-page Dashboard sections.
 * - Features: Smooth scroll to sections, active section highlighting via IntersectionObserver.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';

/**
 * A single navigable section descriptor
 */
export interface NavSection {
  /** DOM id of the target section */
  id: string;
  /** Text label for the section */
  label: string;
  /** Optional lucide icon component */
  icon?: LucideIcon;
}

/**
 * Props for DashboardSidebarNav
 */
interface DashboardSidebarNavProps {
  /** Sections displayed in the nav */
  sections: NavSection[];
  /** Layout variant: vertical sidebar (default) or horizontal pills (mobile) */
  variant?: 'vertical' | 'horizontal';
  /** Optional className for container */
  className?: string;
}

/**
 * Helper: Smoothly scroll to a section by id
 */
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * DashboardSidebarNav component
 */
export default function DashboardSidebarNav({
  sections,
  variant = 'vertical',
  className = '',
}: DashboardSidebarNavProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Observe the sections in view to update active highlight.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the largest intersection ratio
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) {
          setActiveId(visible.target.id);
        }
      },
      {
        // Trigger when ~25% of the section is visible
        threshold: [0.25, 0.5, 0.75, 1],
        rootMargin: '-10% 0px -65% 0px',
      }
    );

    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as Element[];

    targets.forEach((t) => observer.observe(t));

    return () => observer.disconnect();
  }, [sections]);

  const handleClick = useCallback((id: string) => {
    scrollToSection(id);
  }, []);

  const items = useMemo(
    () =>
      sections.map((s) => {
        const isActive = activeId === s.id;
        const Icon = s.icon;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => handleClick(s.id)}
            aria-current={isActive ? 'page' : undefined}
            className={
              variant === 'vertical'
                ? [
                    'w-full group flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'border-blue-200 bg-blue-50 text-blue-700'
                      : 'border-transparent hover:border-slate-200 hover:bg-slate-50 text-slate-700',
                  ].join(' ')
                : [
                    'whitespace-nowrap group inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-colors',
                    isActive
                      ? 'border-blue-300 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
                  ].join(' ')
            }
          >
            {Icon ? <Icon className="h-4 w-4 opacity-80" /> : null}
            <span>{s.label}</span>
          </button>
        );
      }),
    [sections, activeId, handleClick, variant]
  );

  if (variant === 'horizontal') {
    return (
      <nav
        aria-label="Dashboard sections"
        className={`-mx-1 overflow-x-auto no-scrollbar pb-2 ${className}`}
      >
        <div className="flex gap-2 px-1">{items}</div>
      </nav>
    );
  }

  return (
    <nav aria-label="Dashboard sections" className={`space-y-1 ${className}`}>
      {items}
    </nav>
  );
}
