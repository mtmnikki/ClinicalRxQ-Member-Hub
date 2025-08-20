/**
 * SafeText component
 * - Purpose: Safely render any unknown value as readable text in JSX without crashing React.
 * - Avoids "Objects are not valid as a React child" by coercing non-primitive values to strings.
 */
import { toReadableString } from '../../lib/cellValue';

/**
 * Props for SafeText
 */
interface SafeTextProps {
  /** The value to render safely */
  value: unknown;
  /** Fallback text if no readable string can be derived */
  fallback?: string;
}

/**
 * Safely render any value as text, preventing objects from being passed as React children.
 */
export default function SafeText({ value, fallback = '—' }: SafeTextProps) {
  const text = toReadableString(value);
  return <>{text ?? fallback}</>;
}
