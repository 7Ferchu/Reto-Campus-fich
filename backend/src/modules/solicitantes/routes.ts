import { Hono } from 'hono';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db/client.js';
import { solicitantes } from '@/db/schema.js';
import { requireAuth } from '@/shared/auth.js';
import { fail, ok } from '@/shared/response.js';

const createSchema = z.object({
  nombres: z.string().min(2).max(100), apellidos: z.string().min(2).max(100),
  correo: z.string().email(), contrasena: z.string().min(8),
  tipo_usuario: z.enum(['estudiante', 'docente', 'administrativo', 'externo']),
  codigo_fich: z.string().max(30).nullable().optional()
}).superRefine((value, ctx) => {
  if (['estudiante', 'docente'].includes(value.tipo_usuario) && !value.codigo_fich) ctx.addIssue({ code: 'custom', path: ['codigo_fich'], message: 'CodigoFICH es obligatorio para estudiantes y docentes' });
  if (['administrativo', 'externo'].includes(value.tipo_usuario) && value.codigo_fich) ctx.addIssue({ code: 'custom', path: ['codigo_fich'], message: 'CodigoFICH debe ser nulo para este tipo de usuario' });
});

export const solicitantesRoutes = new Hono();
solicitantesRoutes.post('/', async (c) => {
  const parsed = createSchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) return fail(c, 'Datos de registro inválidos', 422, parsed.error.flatten().fieldErrors);
  const input = parsed.data;
  const existing = await db.select({ id: solicitantes.id }).from(solicitantes).where(eq(solicitantes.correo, input.correo)).limit(1);
  if (existing.length) return fail(c, 'El correo ya está registrado', 409);
  const [created] = await db.insert(solicitantes).values({ nombres: input.nombres, apellidos: input.apellidos, correo: input.correo, contrasena: await bcrypt.hash(input.contrasena, 8), tipoUsuario: input.tipo_usuario, codigoFich: input.codigo_fich ?? null }).returning({ id: solicitantes.id, nombres: solicitantes.nombres, apellidos: solicitantes.apellidos, correo: solicitantes.correo, tipoUsuario: solicitantes.tipoUsuario, codigoFich: solicitantes.codigoFich });
  return ok(c, { id_solicitante: created.id, nombres: created.nombres, apellidos: created.apellidos, correo: created.correo, tipo_usuario: created.tipoUsuario, codigo_fich: created.codigoFich }, 'Solicitante registrado', 201);
});

solicitantesRoutes.get('/me', requireAuth, async (c) => {
  const auth = c.get('authUser');
  if (auth.role !== 'solicitante') return fail(c, 'Esta información corresponde a solicitantes', 403);
  const [user] = await db.select({ id: solicitantes.id, nombres: solicitantes.nombres, apellidos: solicitantes.apellidos, correo: solicitantes.correo, tipoUsuario: solicitantes.tipoUsuario, codigoFich: solicitantes.codigoFich }).from(solicitantes).where(eq(solicitantes.id, auth.id)).limit(1);
  return user ? ok(c, user) : fail(c, 'Solicitante no encontrado', 404);
});
