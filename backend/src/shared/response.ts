import type { Context } from 'hono';

export function ok<T>(c: Context, data: T, message?: string, status = 200) {
  return c.json({ success: true, data, ...(message ? { message } : {}) }, status as 200);
}

export function fail(c: Context, message: string, status = 400, errors?: unknown) {
  return c.json({ success: false, message, ...(errors ? { errors } : {}) }, status as 400);
}
