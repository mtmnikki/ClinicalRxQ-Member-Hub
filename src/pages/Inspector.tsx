/**
 * Inspector page
 * - Purpose: Immediate verification that Airtable REST (official, table-name style) works in this browser.
 * - Uses table names exactly per Airtable curl examples ("Members", "Resources", etc.).
 * - Fetches and displays live JSON; shows attachments when present.
 */

import { useEffect, useMemo, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  AlertCircle,
  Database,
  Download,
  File as FileIcon,
  ImageIcon,
  Link as LinkIcon,
  Loader2,
} from 'lucide-react';
import { getAirtableBaseId, getAirtableToken } from '../config/airtableConfig';
import {
  listRecordsByTableName,
  buildCurlListCommand,
  AirtableNameRecord,
} from '../lib/airtableOfficial';

/** Simple attachment type for display */
interface Attachment {
  /** Attachment id */
  id: string;
  /** Direct file URL from Airtable */
  url: string;
  /** Server-provided filename */
  filename: string;
  /** Mime type if present */
  type?: string;
}

/**
 * Extract attachments from any field that looks like an attachment array
 * - Scans field values for arrays of objects with id/url/filename
 */
function extractAttachments(fields: Record<string, unknown>): Attachment[] {
  const out: Attachment[] = [];
  for (const [, v] of Object.entries(fields)) {
    if (Array.isArray(v)) {
      for (const item of v) {
        if (item && typeof item === 'object') {
          const obj = item as Record<string, unknown>;
          const id = typeof obj['id'] === 'string' ? obj['id'] : undefined;
          const url = typeof obj['url'] === 'string' ? obj['url'] : undefined;
          const filename = typeof obj['filename'] === 'string' ? obj['filename'] : undefined;
          const type = typeof obj['type'] === 'string' ? obj['type'] : undefined;
          if (id && url && filename) out.push({ id, url, filename, type });
        }
      }
    }
  }
  return out;
}

/** Input state for inspector */
interface InspectorState {
  /** Airtable table display name (e.g., "Members", "Resources") */
  tableName: string;
  /** Page size for listing */
  limit: number;
  /** Optional view name */
  view?: string;
  /** Optional filter formula */
  filterByFormula?: string;
}

/**
 * Inspector page component (official REST via table names)
 */
export default function Inspector() {
  const [state, setState] = useState<InspectorState>({
    tableName: 'Members', // default to your curl example
    limit: 5,
    view: undefined,
    filterByFormula: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [records, setRecords] = useState<AirtableNameRecord[]>([]);

  const pat = useMemo(() => getAirtableToken() ?? '', []);
  const baseId = useMemo(() => getAirtableBaseId(), []);

  /**
   * Fetch records via official REST by table name
   */
  async function fetchNow() {
    setLoading(true);
    setErrorMsg(null);
    setRecords([]);
    try {
      const params: Record<string, string | number | boolean | undefined> = {};
      if (state.limit) params.pageSize = state.limit;
      if (state.view) params.view = state.view;
      if (state.filterByFormula) params.filterByFormula = state.filterByFormula;

      const res = await listRecordsByTableName({
        tableName: state.tableName,
        params,
      });
      setRecords(res.records);
    } catch (e: any) {
      setErrorMsg(e?.message || 'Fetch failed.');
    } finally {
      setLoading(false);
    }
  }

  // Auto-fetch on first mount so you get immediate confirmation
  useEffect(() => {
    fetchNow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build a docs-style curl with masked PAT for reference
  const curlCmd = useMemo(
    () => buildCurlListCommand(state.tableName),
    [state.tableName, pat]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-slate-800 shadow-sm ring-1 ring-slate-200">
            <Database className="h-4 w-4 text-slate-600" />
            <span>Airtable Inspector (official REST via table names)</span>
          </div>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Fetch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-800">Table Name</label>
                <input
                  value={state.tableName}
                  onChange={(e) => setState((s) => ({ ...s, tableName: e.target.value }))}
                  placeholder="Members"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
                <p className="mt-1 text-xs text-slate-500">Examples: Members, Clinical Programs, Resources</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-800">Limit</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={state.limit}
                  onChange={(e) =>
                    setState((s) => ({ ...s, limit: Math.min(100, Math.max(1, Number(e.target.value || 5))) }))
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-800">View (optional)</label>
                <input
                  value={state.view || ''}
                  onChange={(e) => setState((s) => ({ ...s, view: e.target.value || undefined }))}
                  placeholder="Grid view"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <div className="md:col-span-3">
                <label className="mb-1 block text-sm font-medium text-slate-800">filterByFormula (optional)</label>
                <input
                  value={state.filterByFormula || ''}
                  onChange={(e) => setState((s) => ({ ...s, filterByFormula: e.target.value || undefined }))}
                  placeholder="LOWER({Email Address}) = 'demo@site.com'"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={fetchNow} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {loading ? 'Fetching…' : 'Fetch'}
                </Button>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-700 ring-1 ring-slate-200">
              <div className="mb-1 font-semibold">Docs-style curl (masked PAT):</div>
              <pre className="overflow-x-auto whitespace-pre-wrap break-all">{curlCmd}</pre>
            </div>

            {!pat ? (
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                <AlertCircle className="mt-0.5 h-4 w-4" />
                <div>
                  Airtable PAT not set in this browser. Go to
                  {' '}
                  <a href="#/dev-config" className="inline-flex items-center gap-1 underline underline-offset-4">
                    <LinkIcon className="h-4 w-4" /> Dev Config
                  </a>
                  , paste your PAT, and Save &amp; Test.
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Results */}
        {errorMsg ? (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorMsg}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4">
          <div className="text-sm text-slate-600">
            Base: <span className="font-mono">{baseId}</span> · Table: <span className="font-mono">{state.tableName}</span> ·
            {' '}
            Records: <span className="font-mono">{records.length}</span>
          </div>

          {records.map((rec) => {
            const attachments = extractAttachments(rec.fields || {});
            return (
              <Card key={rec.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-base">Record {rec.id}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Attachments preview (if any) */}
                  {attachments.length ? (
                    <div>
                      <div className="mb-2 text-sm font-medium text-slate-800">Attachments</div>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        {attachments.map((a) => {
                          const isImage = (a.type || '').startsWith('image/');
                          return (
                            <div key={a.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-2">
                              <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-slate-100 flex items-center justify-center">
                                {isImage ? (
                                  <img src={a.url} alt={a.filename} className="h-full w-full object-cover" />
                                ) : (
                                  <FileIcon className="h-5 w-5 text-slate-500" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-medium text-slate-800">{a.filename}</div>
                                <div className="truncate text-xs text-slate-500">{a.type || 'file'}</div>
                              </div>
                              <div className="shrink-0">
                                <a href={a.url} target="_blank" rel="noreferrer">
                                  <Button size="sm" variant="outline" className="bg-transparent">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                  </Button>
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {/* Raw JSON */}
                  <div>
                    <div className="mb-2 text-sm font-medium text-slate-800">Raw JSON</div>
                    <pre className="max-h-80 overflow-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-800 ring-1 ring-slate-200">
                      {JSON.stringify(rec, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
