/**
 * ResourceCard
 * - Purpose: Minimal, high-clarity file card for resources.
 * - Shows ONLY: icon, filename (extension removed), bookmark toggle, Download button.
 * - If item is a video, shows a Play button as well.
 */

import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Bookmark, BookmarkCheck, Download, File, FileSpreadsheet, FileText, Play } from 'lucide-react';
import { useBookmarkStore } from '../../stores/bookmarkStore';
import type { StorageFileItem } from '../../services/supabaseStorage';
import { isDoc, isPdf, isSpreadsheet, isVideo } from '../../services/supabaseStorage';
import React from 'react';

export interface ResourceCardProps {
  /** File to render */
  item: StorageFileItem;
}

/**
 * Pick an icon based on file type.
 */
function FileIconFor(item: StorageFileItem) {
  if (isVideo(item)) return <Play className="h-5 w-5 text-blue-600" />;
  if (isSpreadsheet(item)) return <FileSpreadsheet className="h-5 w-5 text-emerald-600" />;
  if (isPdf(item) || isDoc(item)) return <FileText className="h-5 w-5 text-slate-700" />;
  return <File className="h-5 w-5 text-slate-700" />;
}

/**
 * ResourceCard component
 */
export default function ResourceCard({ item }: ResourceCardProps) {
  const isSaved = useBookmarkStore((s) => s.isBookmarked(item.path));
  const toggle = useBookmarkStore((s) => s.toggle);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {FileIconFor(item)}
          <CardTitle className="text-sm font-medium text-slate-900">{item.title}</CardTitle>
        </div>
        <button
          aria-label={isSaved ? 'Remove bookmark' : 'Add bookmark'}
          onClick={() => toggle(item.path)}
          className="rounded-md p-2 hover:bg-slate-100"
          title={isSaved ? 'Unbookmark' : 'Bookmark'}
        >
          {isSaved ? <BookmarkCheck className="h-5 w-5 text-blue-600" /> : <Bookmark className="h-5 w-5 text-slate-500" />}
        </button>
      </CardHeader>
      <CardContent className="flex items-center justify-end gap-2">
        {isVideo(item) ? (
          <a href={item.url} target="_blank" rel="noreferrer">
            <Button variant="outline" className="bg-white">
              <Play className="mr-2 h-4 w-4" />
              Play
            </Button>
          </a>
        ) : null}
        <a href={item.url} target="_blank" rel="noreferrer">
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </a>
      </CardContent>
    </Card>
  );
}
