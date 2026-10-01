import { date, integer, pgTable, timestamp, time, varchar } from 'drizzle-orm/pg-core';

export const administradores = pgTable('administradores', {
  id: integer('id_administrador').generatedByDefaultAsIdentity().primaryKey(),
  usuario: varchar('usuario', { length: 50 }).notNull(),
  contrasena: varchar('contrasena', { length: 255 }).notNull(),
  fechaCreacion: timestamp('fecha_creacion', { withTimezone: false }).defaultNow().notNull()
});

export const solicitantes = pgTable('solicitantes', {
  id: integer('id_solicitante').generatedByDefaultAsIdentity().primaryKey(),
  nombres: varchar('nombres', { length: 100 }).notNull(),
  apellidos: varchar('apellidos', { length: 100 }).notNull(),
  correo: varchar('correo', { length: 150 }).notNull(),
  contrasena: varchar('contrasena', { length: 255 }).notNull(),
  tipoUsuario: varchar('tipo_usuario', { length: 20 }).notNull(),
  codigoFich: varchar('codigo_fich', { length: 30 }),
  fechaRegistro: timestamp('fecha_registro', { withTimezone: false }).defaultNow().notNull()
});

export const canchas = pgTable('canchas', {
  id: integer('id_cancha').generatedByDefaultAsIdentity().primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  tipoSuperficie: varchar('tipo_superficie', { length: 50 }).notNull(),
  descripcion: varchar('descripcion', { length: 255 })
});

export const horarios = pgTable('horarios', {
  id: integer('id_horario').generatedByDefaultAsIdentity().primaryKey(),
  idCancha: integer('id_cancha').notNull().references(() => canchas.id),
  diaSemana: varchar('dia_semana', { length: 15 }).notNull(),
  horaInicio: time('hora_inicio').notNull(),
  horaFin: time('hora_fin').notNull(),
  estado: varchar('estado', { length: 20 }).notNull().default('disponible'),
  fechaCreacion: timestamp('fecha_creacion', { withTimezone: false }).defaultNow().notNull()
});

export const reservas = pgTable('reservas', {
  id: integer('id_reserva').generatedByDefaultAsIdentity().primaryKey(),
  idSolicitante: integer('id_solicitante').notNull().references(() => solicitantes.id),
  idHorario: integer('id_horario').notNull().references(() => horarios.id),
  fechaReserva: date('fecha_reserva').notNull(),
  estado: varchar('estado', { length: 20 }).notNull().default('confirmada'),
  observaciones: varchar('observaciones', { length: 255 }),
  fechaCreacion: timestamp('fecha_creacion', { withTimezone: false }).defaultNow().notNull()
});

export const tables = { administradores, solicitantes, canchas, horarios, reservas };
