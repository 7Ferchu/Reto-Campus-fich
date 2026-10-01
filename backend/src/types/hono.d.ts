import type { AuthUser } from '@/shared/auth.js';

declare module 'hono' {
  interface ContextVariableMap { authUser: AuthUser; }
}
