import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { env } from '@/config/env.js';
import { AppError } from '@/shared/errors.js';
import { fail, ok } from '@/shared/response.js';
import { authRoutes } from '@/modules/auth/routes.js';
import { solicitantesRoutes } from '@/modules/solicitantes/routes.js';
import { canchasRoutes } from '@/modules/canchas/routes.js';
import { horariosRoutes } from '@/modules/horarios/routes.js';
import { reservasRoutes } from '@/modules/reservas/routes.js';

export const app = new Hono();
app.use('*', logger());
const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim().toLowerCase()).filter(Boolean);
app.use('*', cors({
  origin: (origin) => {
    if (!origin) return allowedOrigins[0] ?? '';
    return allowedOrigins.includes(origin.toLowerCase()) ? origin : '';
  },
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 86400
}));
app.get('/health', (c) => ok(c, { service: 'campusfich-backend', status: 'ok' }));
app.route('/api/auth', authRoutes);
app.route('/api/solicitantes', solicitantesRoutes);
app.route('/api/canchas', canchasRoutes);
app.route('/api/horarios', horariosRoutes);
app.route('/api/reservas', reservasRoutes);
app.notFound((c) => fail(c, 'Ruta no encontrada', 404));
app.onError((error, c) => error instanceof AppError ? fail(c, error.message, error.status, error.details) : fail(c, 'Error interno del servidor', 500));

// Vercel importa este archivo como una función Node.js serverless.
export default app;
