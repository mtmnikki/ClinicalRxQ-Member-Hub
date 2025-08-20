/**
 * Setup page
 * - One-click local setup via URL param ?c=BASE64(JSON({ baseId, pat }))
 * - Decodes payload, saves to localStorage, tests connectivity, reports result, and redirects to /login.
 * - Intended for private, internal use only. Do not share links publicly.
 */

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useLocation, useNavigate } from 'react-router';
import { testAirtableConnectivity } from '../services/airtable/testConnection';
import { toast } from 'sonner';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

/** Decoded config payload shape */
interface Payload {
  /** Airtable Base ID */
  baseId: string;
  /** Airtable Personal Access Token */
  pat: string;
}

/**
 * Decode ?c= base64 payload into a Payload object.
 */
function decodePayload(encoded: string | null): Payload | null {
  if (!encoded) return null;
  try {
    const json = atob(encoded);
    const obj = JSON.parse(json) as Partial<Payload>;
    if (typeof obj.baseId === 'string' && typeof obj.pat === 'string') {
      return { baseId: obj.baseId, pat: obj.pat };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Setup page component
 */
export default function Setup() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const payload = useMemo(() => decodePayload(params.get('c')), [params]);

  const [status, setStatus] = useState<'idle' | 'saving' | 'testing' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    async function run() {
      if (!payload) {
        setStatus('error');
        setMessage('Missing or invalid setup payload.');
        return;
      }

      setStatus('saving');
      try {
        localStorage.setItem('AIRTABLE_BASE_ID', payload.baseId.trim());
        localStorage.setItem('AIRTABLE_PAT', payload.pat.trim());
      } catch {
        setStatus('error');
        setMessage('Failed to save to localStorage in this browser.');
        return;
      }

      setStatus('testing');
      const res = await testAirtableConnectivity();
      if (res.ok) {
        setStatus('ok');
        setMessage('Airtable configured. Redirecting to Login…');
        toast.success('Airtable configured for this browser.');
        setTimeout(() => navigate('/login', { replace: true }), 1000);
      } else {
        setStatus('error');
        setMessage(res.message || 'Connectivity failed. Please verify Base ID and PAT.');
      }
    }

    void run();
  }, [navigate, payload]);

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Browser Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 text-amber-900 bg-amber-50 border border-amber-200 rounded-md p-3">
              {status === 'ok' ? (
                <ShieldCheck className="h-5 w-5 mt-0.5" />
              ) : (
                <ShieldAlert className="h-5 w-5 mt-0.5" />
              )}
              <div className="text-sm">
                This link saves your Airtable Base ID and PAT in this browser only. Do not share setup links publicly.
              </div>
            </div>

            <div className="text-sm">
              Status:{' '}
              <span className="font-medium">
                {status === 'idle' && 'Waiting…'}
                {status === 'saving' && 'Saving…'}
                {status === 'testing' && 'Testing…'}
                {status === 'ok' && 'OK'}
                {status === 'error' && 'Error'}
              </span>
            </div>

            {message && <div className="text-sm opacity-80">{message}</div>}

            {status === 'error' && (
              <div className="flex gap-2">
                <Button variant="outline" className="bg-transparent" onClick={() => navigate('/dev-config')}>
                  Open Dev Config
                </Button>
                <Button onClick={() => navigate('/login')}>Go to Login</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
