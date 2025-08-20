/**
 * Bookmark store (Zustand)
 * - Purpose: Toggle and persist bookmarked resources (by storage path) in localStorage.
 * - Only stores ids (paths). No tags. Minimal shape for UI.
 */

import { create } from 'zustand';

const KEY = 'crxq_bookmarks_v1';

function loadSet(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr || []);
  } catch {
    return new Set();
  }
}

function saveSet(set: Set<string>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(Array.from(set)));
  } catch {
    // ignore
  }
}

interface BookmarkState {
  ids: Set<string>;
  isBookmarked: (id: string) => boolean;
  toggle: (id: string) => void;
  clear: () => void;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  ids: loadSet(),
  isBookmarked: (id: string) => get().ids.has(id),
  toggle: (id: string) => {
    const next = new Set(get().ids);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    saveSet(next);
    set({ ids: next });
  },
  clear: () => {
    const empty = new Set<string>();
    saveSet(empty);
    set({ ids: empty });
  },
}));
