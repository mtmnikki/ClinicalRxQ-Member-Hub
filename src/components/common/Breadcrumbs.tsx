/**
 * Breadcrumbs component
 * - Purpose: Render accessible breadcrumb navigation with Dashboard as the root anchor.
 * - Usage: Provide items in order; the last item is treated as the current page.
 */

import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';

/**
 * Single breadcrumb item definition
 */
export interface CrumbItem {
  /** Text to display for the crumb */
  label: string;
  /** Route to navigate when clicked; omit for current page */
  to?: string;
}

/**
 * Props for Breadcrumbs
 */
interface BreadcrumbsProps {
  /** Ordered list of crumbs; last one is the current page (no link) */
  items: CrumbItem[];
  /**
   * Optional appearance variant:
   * - 'light' renders white/soft text for dark hero backgrounds
   * - default renders gray/neutral suitable for light backgrounds
   */
  variant?: 'light' | 'default';
  /** Optional extra className for layout adjustments */
  className?: string;
}

/**
 * Breadcrumbs navigation with chevron separators.
 * - Uses nav[aria-label="Breadcrumb"] semantics.
 * - Adds aria-current="page" on the last crumb.
 */
export default function Breadcrumbs({ items, variant = 'default', className = '' }: BreadcrumbsProps) {
  const isLight = variant === 'light';
  const baseText = isLight ? 'text-white/80' : 'text-gray-600';
  const linkText = isLight ? 'text-white hover:text-white' : 'text-gray-700 hover:text-gray-900';
  const sepColor = isLight ? 'text-white/60' : 'text-gray-400';

  return (
    <nav aria-label="Breadcrumb" className={`w-full ${className}`}>
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="inline-flex items-center gap-2">
              {item.to && !isLast ? (
                <Link to={item.to} className={`text-sm font-medium ${linkText}`}>
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`text-sm font-medium ${baseText}`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className={`h-4 w-4 ${sepColor}`} aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
