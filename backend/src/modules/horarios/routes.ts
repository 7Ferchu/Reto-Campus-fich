import { Hono } from 'hono';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db/client.js';
import { canchas, horarios } from '@/db/schema.js';
import { requireAuth, requireRole } from '@/shared/auth.js';
import { fail, ok } from '@/shared/response.js';

const days = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'] as const;
const scheduleFields = { id_cancha: z.coerce.number().int().positive(), dia_semana: z.enum(days), hora_inicio: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/), hora_fin: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/), estado: z.string().optional() };
const scheduleSchema = z.object(scheduleFields).superRefine((value, ctx) => { if (value.hora_inicio < '07:00' || value.hora_fin > '22:00' || value.hora_inicio >= value.hora_fin) ctx.addIssue({ code: 'custom', path: ['hora_inicio'], message: 'El horario debe estar entre 07:00 y 22:00' }); });
const schedulePatchSchema = z.object(scheduleFields).partial();
const scheduleDto = (schedule: typeof horarios.$inferSelect) => ({ id_horario: schedule.id, id_cancha: schedule.idCancha, dia_semana: schedule.diaSemana, hora_inicio: schedule.horaInicio, hora_fin: schedule.horaFin, estado: schedule.estado });
export const horariosRoutes = new Hono();
horariosRoutes.get('/', async (c) => ok(c, await db.select({ id_horario: horarios.id, id_cancha: horarios.idCancha, dia_semana: horarios.diaSemana, hora_inicio: horarios.horaInicio, hora_fin: horarios.horaFin, estado: horarios.estado, cancha: { id: canchas.id, nombre: canchas.nombre } }).from(horarios).leftJoin(canchas, eq(horarios.idCancha, canchas.id))));
horariosRoutes.post('/', requireAuth, requireRole('administrador'), async (c) => { const parsed = scheduleSchema.safeParse(await c.req.json().catch(() => null)); if (!parsed.success) return fail(c, 'Datos de horario inválidos', 422, parsed.error.flatten().fieldErrors); const court = await db.select({ id: canchas.id }).from(canchas).where(eq(canchas.id, parsed.data.id_cancha)).limit(1); if (!court.length) return fail(c, 'La cancha no existe', 404); const [created] = await db.insert(horarios).values({ idCancha: parsed.data.id_cancha, diaSemana: parsed.data.dia_semana, horaInicio: parsed.data.hora_inicio, horaFin: parsed.data.hora_fin, estado: parsed.data.estado ?? 'disponible' }).returning(); return ok(c, scheduleDto(created), 'Horario creado', 201); });
horariosRoutes.patch('/:id', requireAuth, requireRole('administrador'), async (c) => {
  const id = Number(c.req.param('id'));
  const parsed = schedulePatchSchema.safeParse(await c.req.json().catch(() => null));
  if (!Number.isInteger(id) || !parsed.success) return fail(c, 'Datos de horario inválidos', 422, parsed.success ? undefined : parsed.error.flatten().fieldErrors);
  const [current] = await db.select().from(horarios).where(eq(horarios.id, id)).limit(1);
  if (!current) return fail(c, 'Horario no encontrado', 404);
  const combined = { id_cancha: parsed.data.id_cancha ?? current.idCancha, dia_semana: parsed.data.dia_semana ?? current.diaSemana, hora_inicio: parsed.data.hora_inicio ?? current.horaInicio, hora_fin: parsed.data.hora_fin ?? current.horaFin, estado: parsed.data.estado ?? current.estado };
  const valid = scheduleSchema.safeParse(combined);
  if (!valid.success) return fail(c, 'El horario no cumple las reglas permitidas', 422, valid.error.flatten().fieldErrors);
  const [updated] = await db.update(horarios).set({ idCancha: combined.id_cancha, diaSemana: combined.dia_semana, horaInicio: combined.hora_inicio, horaFin: combined.hora_fin, estado: combined.estado }).where(eq(horarios.id, id)).returning();
  return ok(c, scheduleDto(updated), 'Horario actualizado');
});
horariosRoutes.delete('/:id', requireAuth, requireRole('administrador'), async (c) => { const [deleted] = await db.delete(horarios).where(eq(horarios.id, Number(c.req.param('id')))).returning({ id: horarios.id }); return deleted ? ok(c, deleted, 'Horario eliminado') : fail(c, 'Horario no encontrado', 404); });
