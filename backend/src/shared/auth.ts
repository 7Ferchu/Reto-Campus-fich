import type { Context, Next } from 'hono';
import { jwtVerify, SignJWT } from 'jose';
import { env } from '@/config/env.js';
import { AppError } from './errors.js';

export type Role = 'administrador' | 'solicitante';
export type AuthUser = { id: number; role: Role; name: string; email?: string };
const secret = new TextEncoder().encode(env.JWT_SECRET);

export async function createToken(user: AuthUser) {
  return new SignJWT({ role: user.role, name: user.name, email: user.email })
    .setProtectedHeader({ alg: 'HS256' }).setSubject(String(user.id)).setIssuedAt().setExpirationTime(env.JWT_EXPIRES_IN).sign(secret);
}

export async function requireAuth(c: Context, next: Next) {
  const token = c.req.header('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return c.json({ success: false, message: 'Token requerido' }, 401);
  try {
    const verified = await jwtVerify(token, secret);
    const payload = verified.payload;
    if (payload.role !== 'administrador' && payload.role !== 'solicitante') throw new Error('Rol inválido');
    c.set('authUser', { id: Number(payload.sub), role: payload.role, name: String(payload.name ?? ''), email: payload.email ? String(payload.email) : undefined } satisfies AuthUser);
    await next();
  } catch { return c.json({ success: false, message: 'Token inválido o expirado' }, 401); }
}

export function requireRole(role: Role) {
  return async (c: Context, next: Next) => {
    const user = c.get('authUser') as AuthUser | undefined;
    if (!user || user.role !== role) throw new AppError(403, 'No tienes permisos para esta operación');
    await next();
  };
}
