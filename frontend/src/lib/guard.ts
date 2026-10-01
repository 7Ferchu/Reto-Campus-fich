import { getSession } from '@/lib/session';
import type { Role } from '@/types/api';
export function requireSession(role?: Role) { const session = getSession(); if (!session) { location.href = '/login'; return null; } if (role && session.user.rol !== role) { location.href = '/'; return null; } return session; }
