import bcrypt from 'bcrypt';
import { sql } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import { client, db } from './client.js';
import { administradores, solicitantes } from './schema.js';

const passwordHash = await bcrypt.hash('Campus123', 8);
await db.update(administradores).set({ contrasena: passwordHash }).where(eq(administradores.usuario, 'IngFer'));
await db.update(solicitantes).set({ contrasena: passwordHash });
for (const [table, column] of [['administradores', 'id_administrador'], ['solicitantes', 'id_solicitante'], ['canchas', 'id_cancha'], ['horarios', 'id_horario'], ['reservas', 'id_reserva']] as const) {
  await db.execute(sql.raw(`SELECT setval(pg_get_serial_sequence('${table}', '${column}'), COALESCE((SELECT MAX(${column}) FROM ${table}), 0) + 1, false)`));
}
console.log('Credenciales de prueba actualizadas con bcrypt (8 saltos).');
await client.end();
