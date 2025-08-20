/**
 * ProgramResourceRow
 * - Purpose: Single-column, dense row card for Program Detail sections.
 * - Contents: brand-colored file icon (left), file name, optional duration (videos), and one action button.
 *   - Video: "Play" only (no download).
 *   - Non-video: "Download" only.
 */

import React from 'react';
import { Button } from '../ui/button';
import {
  Download,
  File,
  FileSpreadsheet,
  FileText,
  Play,
} from 'lucide-react';
import type { StorageFileItem } from '../../services/supabaseStorage';
import {
  isDoc,
  isPdf,
  isSpreadsheet,
  isVideo,
} from '../../services/supabaseStorage';

/**
 * Infer a duration label from the filename or title, if present.
 * Looks for patterns like [mm:ss] or (mm:ss); otherwise returns undefined.
 */
function inferDurationLabel(name: string): string | undefined {
  const m = name.match(/[\[\(]([0-5]?\d:[0-5]\d)[\]\)]/);
  return m?.[1];
}

/**
 * Choose a brand-colored icon for a given file type
 */
function BrandFileIcon({ item }: { item: StorageFileItem }) {
  const cls = 'h-5 w-5 text-blue-600'; // Brand color
  if (isVideo(item)) return <Play className={cls} />;
  if (isSpreadsheet(item)) return <FileSpreadsheet className={cls} />;
  if (isPdf(item) || isDoc(item)) return <FileText className={cls} />;
  return <File className={cls} />;
}

/**
 * ProgramResourceRow component
 */
export default function ProgramResourceRow({ item }: { item: StorageFileItem }) {
  const video = isVideo(item);
  const duration = video ? inferDurationLabel(item.title || item.filename) : undefined;

  return (
    <div className="rounded-md border bg-white px-4 py-3 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-center justify-between gap-3">
        {/* Left: icon + filename */}
        <div className="flex min-w-0 items-center gap-3">
          <BrandFileIcon item={item} />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-slate-900">
              {item.title || item.filename}
            </div>
            <div className="text-[11px] text-slate-500">{item.filename}</div>
          </div>
        </div>

        {/* Right: optional duration + action */}
        <div className="flex shrink-0 items-center gap-3">
          {video && duration ? (
            <span className="text-xs text-slate-600" aria-label="Video duration">
              {duration}
            </span>
          ) : null}

          {video ? (
            <a href={item.url} target="_blank" rel="noreferrer">
              <Button className="h-8 px-3">
                <Play className="mr-2 h-4 w-4" />
                Play
              </Button>
            </a>
          ) : (
            <a href={item.url} target="_blank" rel="noreferrer">
              <Button className="h-8 px-3">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
