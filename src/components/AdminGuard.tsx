// src/components/AdminGuard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdminAuthenticated } from '@/src/utils/auth';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'allowed'>('checking');

  useEffect(() => {
    // localStorage is the only source of truth. There is no server fallback:
    // the old /api/auth { action: 'check' } path returned authenticated: true
    // unconditionally, which let anyone straight into the dashboard.
    if (isAdminAuthenticated()) {
      setStatus('allowed');
    } else {
      router.replace('/admin/login');
    }
  }, [router]);

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-stone text-sm tracking-wide uppercase">Verifying session</p>
      </div>
    );
  }

  return <>{children}</>;
}
