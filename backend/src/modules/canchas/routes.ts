import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db/client.js';
import { canchas } from '@/db/schema.js';
import { requireAuth, requireRole } from '@/shared/auth.js';
import { fail, ok } from '@/shared/response.js';

const courtSchema = z.object({ nombre: z.string().min(2).max(100), tipo_superficie: z.string().min(2).max(50), descripcion: z.string().max(255).optional() });
const courtDto = (court: typeof canchas.$inferSelect) => ({ id_cancha: court.id, nombre: court.nombre, tipo_superficie: court.tipoSuperficie, descripcion: court.descripcion });
export const canchasRoutes = new Hono();
canchasRoutes.get('/', async (c) => ok(c, await db.select().from(canchas)));
canchasRoutes.post('/', requireAuth, requireRole('administrador'), async (c) => {
  const parsed = courtSchema.safeParse(await c.req.json().catch(() => null)); if (!parsed.success) return fail(c, 'Datos de cancha inválidos', 422, parsed.error.flatten().fieldErrors);
  const [created] = await db.insert(canchas).values({ nombre: parsed.data.nombre, tipoSuperficie: parsed.data.tipo_superficie, descripcion: parsed.data.descripcion }).returning(); return ok(c, courtDto(created), 'Cancha creada', 201);
});
canchasRoutes.patch('/:id', requireAuth, requireRole('administrador'), async (c) => {
  const id = Number(c.req.param('id')); const parsed = courtSchema.partial().safeParse(await c.req.json().catch(() => null)); if (!Number.isInteger(id) || !parsed.success) return fail(c, 'Datos de cancha inválidos', 422);
  const [updated] = await db.update(canchas).set({ ...(parsed.data.nombre ? { nombre: parsed.data.nombre } : {}), ...(parsed.data.tipo_superficie ? { tipoSuperficie: parsed.data.tipo_superficie } : {}), ...(parsed.data.descripcion !== undefined ? { descripcion: parsed.data.descripcion } : {}) }).where(eq(canchas.id, id)).returning(); return updated ? ok(c, courtDto(updated), 'Cancha actualizada') : fail(c, 'Cancha no encontrada', 404);
});
canchasRoutes.delete('/:id', requireAuth, requireRole('administrador'), async (c) => { const [deleted] = await db.delete(canchas).where(eq(canchas.id, Number(c.req.param('id')))).returning({ id: canchas.id }); return deleted ? ok(c, deleted, 'Cancha eliminada') : fail(c, 'Cancha no encontrada', 404); });
