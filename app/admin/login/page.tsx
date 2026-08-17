'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginAdmin } from '@/src/utils/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data?.success) {
        loginAdmin(data.user?.email ?? email);
        router.replace('/admin');
        return;
      }
      setError(data?.error ?? 'Invalid email or password.');
      setLoading(false);
    } catch {
      setError('Unable to reach the server. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main
      className="flex min-h-screen items-center justify-center px-5 py-16"
      style={{ background: 'var(--color-admin-bg)' }}
    >
      <div className="w-full max-w-md">

        {/* Logo block */}
        <div className="text-center mb-10">
          <p
            className="font-heading tracking-[0.35em]"
            style={{ fontSize: '1.75rem', color: 'var(--color-champagne)', fontWeight: 400 }}
          >
            NOVEIRA
          </p>
          <p
            className="mt-1 tracking-[0.45em] uppercase"
            style={{ fontSize: '0.65rem', color: 'rgba(196,163,90,0.5)', letterSpacing: '0.4em' }}
          >
            Atelier
          </p>
          <div style={{ height: '1px', background: 'var(--color-admin-border)', margin: '1.5rem auto', width: '3rem' }} />
          <h1
            className="font-heading"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: 'var(--color-text-primary)', fontWeight: 400 }}
          >
            Admin Portal
          </h1>
          <p
            className="mt-3"
            style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', lineHeight: 1.6, maxWidth: '30rem', margin: '0.75rem auto 0' }}
          >
            Sign in to manage your store, catalog, orders and customer experience.
          </p>
        </div>

        {/* Form card */}
        <div
          className="p-8 md:p-10"
          style={{
            background: 'var(--color-admin-surf)',
            border: '1px solid var(--color-admin-border)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          }}
        >
          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="mb-7 flex items-start gap-3 p-4"
              style={{
                background: 'rgba(200,80,80,0.12)',
                border: '1px solid rgba(200,80,80,0.3)',
              }}
            >
              <svg className="h-5 w-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#E07070' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p style={{ fontSize: '0.9375rem', color: '#E07070', lineHeight: 1.5 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} noValidate>
            {/* Email field */}
            <div className="mb-6">
              <label
                htmlFor="email"
                style={{ display: 'block', marginBottom: '0.625rem', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input-dark"
              />
            </div>

            {/* Password field */}
            <div className="mb-8">
              <label
                htmlFor="password"
                style={{ display: 'block', marginBottom: '0.625rem', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-dark"
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-admin-primary"
              style={{ fontSize: '0.9375rem', minHeight: '54px', letterSpacing: '0.1em' }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin-slow" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Authenticating...
                </span>
              ) : 'Sign In to Dashboard'}
            </button>
          </form>

          <div style={{ height: '1px', background: 'var(--color-admin-border)', margin: '2rem 0' }} />

          <Link
            href="/"
            className="flex items-center justify-center gap-2 transition-opacity hover:opacity-60"
            style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Store
          </Link>
        </div>

        <p
          className="text-center mt-6"
          style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', opacity: 0.5 }}
        >
          © {new Date().getFullYear()} Noveira Atelier. Restricted access.
        </p>
      </div>
    </main>
  );
}
