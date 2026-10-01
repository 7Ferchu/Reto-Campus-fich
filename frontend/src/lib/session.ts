import type { AuthData } from '@/types/api';
const KEY = 'campusfich_session';
export const saveSession = (value: AuthData) => localStorage.setItem(KEY, JSON.stringify(value));
export const clearSession = () => localStorage.removeItem(KEY);
export function getSession(): AuthData | null { const raw = localStorage.getItem(KEY); if (!raw) return null; try { return JSON.parse(raw); } catch { clearSession(); return null; } }
