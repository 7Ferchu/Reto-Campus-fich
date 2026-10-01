import { getSession, clearSession } from '@/lib/session';
import type { ApiResponse } from '@/types/api';
const configuredUrl = import.meta.env.PUBLIC_API_URL;
const BASE_URL = (configuredUrl || (typeof window !== 'undefined' ? `${window.location.origin}/api` : '/api')).replace(/\/$/, '');
export class ApiError extends Error { constructor(public status: number, message: string, public details?: unknown) { super(message); } }
export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers); headers.set('Content-Type', 'application/json');
  const session = getSession(); if (session?.token) headers.set('Authorization', `Bearer ${session.token}`);
  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const body = await response.json().catch(() => ({})) as ApiResponse<T>;
  if (response.status === 401) clearSession();
  if (!response.ok || body.success === false) throw new ApiError(response.status, body.message || 'No fue posible completar la solicitud', body.errors);
  return body.data;
}
export const get = <T>(path: string) => request<T>(path);
export const post = <T>(path: string, data: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(data) });
export const patch = <T>(path: string, data?: unknown) => request<T>(path, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined });
export const remove = <T>(path: string) => request<T>(path, { method: 'DELETE' });
