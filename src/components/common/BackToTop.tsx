/**
 * BackToTop component
 * - Purpose: Floating button to quickly return to top of page.
 * - Behavior: Appears after user scrolls down a bit; smooth-scrolls to top on click.
 */
import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * Floating "Back to top" button
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    /** Toggle visibility based on scroll position */
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /** Smooth scroll to top */
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      aria-label="Back to top"
      onClick={scrollTop}
      className="fixed bottom-6 right-6 z-[60] h-10 w-10 rounded-full bg-white text-gray-800 shadow-lg border border-gray-200 hover:border-cyan-400 hover:text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
    >
      <ArrowUp className="h-5 w-5 mx-auto" />
    </button>
  );
}
