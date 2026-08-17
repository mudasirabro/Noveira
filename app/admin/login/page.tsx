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
      setError('We could not reach the server. Please try again.');
      setLoading(false);
    }
  };

  const inputClass =
    'w-full border border-gold/20 bg-surface px-4 py-3 text-xs text-ivory placeholder:text-stone/60 focus:border-gold focus:outline-none transition-colors rounded-sm';

  return (
    <main className="flex min-h-screen items-center justify-center bg-obsidian text-ivory px-6 py-14">
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="font-heading text-3xl tracking-[0.3em] text-gold">NOVEIRA</p>
          <h1 className="mt-4 font-heading text-3xl text-ivory">Atelier Dashboard</h1>
          <p className="mt-2 text-xs text-stone">
            Sign in to access order management and catalog controls.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="mt-8 border border-gold/15 bg-surface p-7 md:p-8 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        >
          {error && (
            <p
              role="alert"
              className="mb-6 border border-gold/40 bg-gold/10 px-4 py-3 text-xs text-gold"
            >
              {error}
            </p>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-gold font-semibold"
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
              className={inputClass}
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="password"
              className="mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-gold font-semibold"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full btn-primary justify-center disabled:opacity-60"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In To Dashboard'}</span>
          </button>

          <Link
            href="/"
            className="mt-5 block text-center text-[10px] uppercase tracking-[0.18em] text-stone hover:text-gold transition-colors"
          >
            Return to Store
          </Link>
        </form>
      </div>
    </main>
  );
}
