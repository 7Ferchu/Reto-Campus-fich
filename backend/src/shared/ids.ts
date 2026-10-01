import { sql } from 'drizzle-orm';
import { db } from '@/db/client.js';

export async function nextId(table: 'administradores' | 'solicitantes' | 'canchas' | 'horarios' | 'reservas') {
  const result = await db.execute<{ next_id: number }>(sql.raw(`SELECT COALESCE(MAX(id_${table === 'administradores' ? 'administrador' : table === 'solicitantes' ? 'solicitante' : table === 'canchas' ? 'cancha' : table === 'horarios' ? 'horario' : 'reserva'}), 0) + 1 AS next_id FROM ${table}`));
  return Number(result[0]?.next_id ?? 1);
}
