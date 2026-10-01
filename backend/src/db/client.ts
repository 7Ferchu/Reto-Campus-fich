import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '@/config/env.js';
import * as schema from './schema.js';

function normalizeDatabaseUrl(rawUrl: string) {
  try {
    // Las URLs con credenciales percent-encoded pasan directamente.
    new URL(rawUrl);
    return rawUrl;
  } catch {
    // Permite recuperar una URL antigua cuyo usuario o contraseña contiene
    // caracteres reservados sin codificar, como "+", "/" o "#".
    const match = rawUrl.match(/^(postgres(?:ql)?:\/\/)([^:]*):([^@]*)@(.+)$/);
    if (!match) throw new Error('DATABASE_URL no tiene un formato PostgreSQL válido');
    const [, protocol, username, password, hostAndPath] = match;
    return `${protocol}${encodeURIComponent(username)}:${encodeURIComponent(password)}@${hostAndPath}`;
  }
}

// La conexión se crea una vez por instancia de la función serverless.
// prepare:false mejora la compatibilidad con proveedores PostgreSQL serverless.
export const client = postgres(normalizeDatabaseUrl(env.DATABASE_URL), { prepare: false, ssl: 'require' });
export const db = drizzle(client, { schema });
