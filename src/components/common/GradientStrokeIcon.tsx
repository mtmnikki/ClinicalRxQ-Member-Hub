/**
 * GradientStrokeIcon
 * - Purpose: Render lightweight inline SVG icons with a blue→cyan→teal gradient stroke.
 * - Used for: file, video, chevron indicators (accordion).
 */

import { useId } from 'react';

export type GradientIconName = 'file' | 'video' | 'chevron';

interface GradientStrokeIconProps {
  /** Which icon to render */
  name: GradientIconName;
  /** Pixel size of the square SVG */
  size?: number;
  /** CSS className to pass through (e.g., for transforms) */
  className?: string;
  /** Stroke width */
  strokeWidth?: number;
}

/**
 * Internal: Shared linear gradient definition in local SVG scope
 */
function GradientDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2563eb" /> {/* blue-600 */}
        <stop offset="50%" stopColor="#06b6d4" /> {/* cyan-500 */}
        <stop offset="100%" stopColor="#2dd4bf" /> {/* teal-400 */}
      </linearGradient>
    </defs>
  );
}

/**
 * GradientStrokeIcon
 * - Renders minimal paths with stroke=url(#gradient)
 */
export default function GradientStrokeIcon({
  name,
  size = 20,
  className = '',
  strokeWidth = 2,
}: GradientStrokeIconProps) {
  const gradId = useId().replace(/:/g, '_');

  if (name === 'file') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden
      >
        <GradientDefs id={gradId} />
        <g stroke={`url(#${gradId})`} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="M10 9H8" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
        </g>
      </svg>
    );
  }

  if (name === 'video') {
    // Simple video frame + play triangle
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden
      >
        <GradientDefs id={gradId} />
        <g stroke={`url(#${gradId})`} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="6" width="14" height="12" rx="2" ry="2" />
          <path d="M20 8v8l-3-2v-4z" />
          <path d="M10 9.5l4 2.5-4 2.5z" />
        </g>
      </svg>
    );
  }

  // Chevron (right)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <GradientDefs id={gradId} />
      <path
        d="m9 18 6-6-6-6"
        stroke={`url(#${gradId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
