/**
 * ScrollToTop component
 * - Purpose: Ensure the viewport scrolls to top on route (pathname) changes.
 * - Fix: Ignore search/hash changes so in-page state changes (like accordions/tabs that update query)
 *   do not jump the user to the top.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * Scroll to top when the pathname changes.
 * Querystring/hash updates are ignored to prevent disruptive jumps during in-page interactions.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Always jump to top on actual route (pathname) navigation
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
