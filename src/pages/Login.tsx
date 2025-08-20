/** 
 * Member Login page (Airtable-free)
 * - Calls the zustand auth store's login(email, password) correctly.
 * - Navigates to /dashboard only on successful authentication.
 * - Shows an inline error message on invalid credentials.
 * - Enhancement: Adds an invisible alt+click bypass area below the login card for quick access in demos.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

/** Simple form state for email/password */
interface LoginForm {
  /** User email */
  email: string;
  /** User password */
  password: string;
}

/**
 * Login page component
 */
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle sign-in by calling the auth store's login(email, password).
   * On success, redirect to /dashboard; on failure, show an error.
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const ok = await login(form.email.trim(), form.password);
      if (ok) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Use demo@clinicalrxq.com and password.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  /**
   * Secret bypass: Invisible alt+click area below the card.
   * - Only triggers when the Alt key is pressed during the click.
   * - Uses the same login flow with demo credentials for consistency.
   */
  async function handleSecretBypass(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (!e.altKey || submitting) return;
    try {
      setSubmitting(true);
      const ok = await login('demo@clinicalrxq.com', 'password');
      if (ok) navigate('/dashboard');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Member Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Email address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                  required
                />
              </div>

              {error ? (
                <div className="text-xs text-red-600">{error}</div>
              ) : (
                <p className="text-xs text-slate-500">
                  Demo credentials: demo@clinicalrxq.com / password
                </p>
              )}

              <Button type="submit" disabled={submitting}>
                {submitting ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Invisible alt+click link area (demo bypass).
           - It's visually hidden (opacity-0) but clickable.
           - Place cursor below the login card and Alt+click to bypass. */}
        <a
          href="#"
          aria-hidden="true"
          onClick={handleSecretBypass}
          className="block mt-2 h-5 w-full opacity-0 pointer-events-auto select-none"
        >
          bypass
        </a>
      </div>
    </div>
  );
}
