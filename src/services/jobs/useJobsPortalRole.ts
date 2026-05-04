import { useCallback, useSyncExternalStore } from 'react';
import type { JobsPortalRole } from './types';

const STORAGE_KEY = 'jobs-portal-dev-role';

const defaultRole = (): JobsPortalRole => {
  if (typeof window === 'undefined') return 'individual';
  const v = window.localStorage.getItem(STORAGE_KEY) as JobsPortalRole | null;
  if (v === 'individual' || v === 'corporate' || v === 'admin') return v;
  return 'individual';
};

let currentRole: JobsPortalRole = defaultRole();

const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((l) => l());
}

export function getJobsPortalRole(): JobsPortalRole {
  return currentRole;
}

export function setJobsPortalRole(role: JobsPortalRole): void {
  currentRole = role;
  try {
    window.localStorage.setItem(STORAGE_KEY, role);
  } catch {
    /* ignore */
  }
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): JobsPortalRole {
  return currentRole;
}

function getServerSnapshot(): JobsPortalRole {
  return 'individual';
}

export function useJobsPortalRole(): {
  role: JobsPortalRole;
  setRole: (r: JobsPortalRole) => void;
} {
  const role = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setRole = useCallback((r: JobsPortalRole) => setJobsPortalRole(r), []);
  return { role, setRole };
}
