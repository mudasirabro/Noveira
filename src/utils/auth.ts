// src/utils/auth.ts
// Client-side admin session. This gates the login form and the dashboard UI,
// not the /admin route itself — see README for the limitation.

import { STORAGE_KEYS, readStorage, removeStorage, writeStorage } from "@/src/lib/storage";

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface AdminSession {
  email: string;
  loggedIn: boolean;
  timestamp: string;
}

function readSession(): AdminSession | null {
  const session = readStorage<AdminSession | null>(STORAGE_KEYS.adminAuth, null);
  if (!session || session.loggedIn !== true || typeof session.email !== "string") {
    return null;
  }

  const loginTime = new Date(session.timestamp).getTime();
  if (Number.isNaN(loginTime) || Date.now() - loginTime >= SESSION_TTL_MS) {
    return null;
  }

  return session;
}

export function isAdminAuthenticated(): boolean {
  return readSession() !== null;
}

export function getAdminEmail(): string | null {
  return readSession()?.email ?? null;
}

export function loginAdmin(email: string): void {
  writeStorage(STORAGE_KEYS.adminAuth, {
    email,
    loggedIn: true,
    timestamp: new Date().toISOString(),
  });
}

export function logoutAdmin(): void {
  removeStorage(STORAGE_KEYS.adminAuth);
}
