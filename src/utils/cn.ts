/**
 * cn utility
 * - Minimal className joiner with conditional support.
 */
export function cn(...args: Array<string | false | null | undefined>) {
  return args.filter(Boolean).join(' ');
}
