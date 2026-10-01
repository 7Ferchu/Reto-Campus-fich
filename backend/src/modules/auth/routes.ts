import { Hono } from 'hono';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db/client.js';
import { administradores, solicitantes } from '@/db/schema.js';
import { createToken } from '@/shared/auth.js';
import { AppError } from '@/shared/errors.js';
import { fail, ok } from '@/shared/response.js';

const loginSchema = z.object({
  usuario: z.string().min(1).optional(),
  correo: z.string().min(1).optional(),
  contrasena: z.string().min(1)
}).refine((input) => input.usuario || input.correo, { message: 'Ingresa usuario o correo' });

export const authRoutes = new Hono();

authRoutes.post('/login', async (c) => {
  const parsed = loginSchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) return fail(c, 'Datos de inicio de sesión inválidos', 422, parsed.error.flatten().fieldErrors);
  const { usuario, correo, contrasena } = parsed.data;
  const admin = usuario ? (await db.select().from(administradores).where(eq(administradores.usuario, usuario)).limit(1))[0] : undefined;
  const requester = admin ? undefined : (await db.select().from(solicitantes).where(eq(solicitantes.correo, correo ?? usuario!)).limit(1))[0];
  const account = admin ?? requester;
  if (!account) return fail(c, 'Credenciales inválidas', 401);
  const valid = await bcrypt.compare(contrasena, account.contrasena).catch(() => false);
  const legacyValid = !valid && account.contrasena === contrasena;
  if (!valid && !legacyValid) return fail(c, 'Credenciales inválidas', 401);
  const isAdmin = Boolean(admin);
  const user = isAdmin
    ? { id: admin!.id, nombre: admin!.usuario, rol: 'administrador' as const }
    : { id: requester!.id, nombre: `${requester!.nombres} ${requester!.apellidos}`, correo: requester!.correo, rol: 'solicitante' as const, tipo_usuario: requester!.tipoUsuario };
  const token = await createToken({ id: user.id, name: user.nombre, role: user.rol, email: 'correo' in user ? user.correo : undefined });
  return ok(c, { token, user }, 'Inicio de sesión exitoso');
});

authRoutes.post('/logout', (c) => ok(c, null, 'Sesión cerrada'));
