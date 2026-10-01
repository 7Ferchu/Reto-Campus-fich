-- Administrador del sistema. La contraseña se almacena sin encriptar por motivos de prueba.
INSERT INTO administradores (id_administrador, usuario, contrasena)
VALUES (1, 'IngFer', 'Campus123');

-- Solicitantes: 2 docentes, 1 administrativo, 3 estudiantes y 2 externos.
INSERT INTO solicitantes
    (id_solicitante, nombres, apellidos, correo, tipo_usuario, codigo_fich)
VALUES
    (1, 'Ana', 'Martínez', 'ana.martinez@fich.edu.co', 'docente', 'DOC001'),
    (2, 'Carlos', 'Rodríguez', 'carlos.rodriguez@fich.edu.co', 'docente', 'DOC002'),
    (3, 'Laura', 'Gómez', 'laura.gomez@fich.edu.co', 'administrativo', NULL),
    (4, 'Pedro', 'López', 'pedro.lopez@fich.edu.co', 'estudiante', 'EST001'),
    (5, 'María', 'Torres', 'maria.torres@fich.edu.co', 'estudiante', 'EST002'),
    (6, 'Juan', 'Hernández', 'juan.hernandez@fich.edu.co', 'estudiante', 'EST003'),
    (7, 'Diego', 'Pérez', 'diego.perez@gmail.com', 'externo', NULL),
    (8, 'Sofía', 'Ramírez', 'sofia.ramirez@gmail.com', 'externo', NULL);

-- Las dos canchas universitarias.
INSERT INTO canchas (id_cancha, nombre, tipo_superficie, descripcion)
VALUES
    (1, 'Cancha de pasto sintético', 'pasto sintetico', 'Cancha universitaria de fútbol en pasto sintético'),
    (2, 'Cancha de cemento', 'cemento', 'Cancha universitaria multipropósito de cemento');

-- Bloques de horarios válidos: lunes a sábado, entre las 07:00 y las 22:00.
INSERT INTO horarios
    (id_horario, id_cancha, dia_semana, hora_inicio, hora_fin)
VALUES
    (1, 1, 'lunes', '07:00', '09:00'),
    (2, 1, 'martes', '09:00', '11:00'),
    (3, 1, 'miércoles', '15:00', '17:00'),
    (4, 1, 'jueves', '17:00', '19:00'),
    (5, 2, 'lunes', '10:00', '12:00'),
    (6, 2, 'martes', '14:00', '16:00'),
    (7, 2, 'viernes', '16:00', '18:00'),
    (8, 2, 'sábado', '18:00', '20:00');

-- Reservas: 2 docentes, 1 administrativo, 3 estudiantes y 2 externos.
INSERT INTO reservas
    (id_reserva, id_solicitante, id_horario, fecha_reserva, observaciones)
VALUES
    (1, 1, 1, '2026-10-05', 'Reserva docente de entrenamiento'),
    (2, 2, 2, '2026-10-06', 'Reserva docente de actividad institucional'),
    (3, 3, 5, '2026-10-05', 'Reserva administrativa'),
    (4, 4, 3, '2026-10-07', 'Práctica estudiantil'),
    (5, 5, 4, '2026-10-08', 'Práctica estudiantil'),
    (6, 6, 6, '2026-10-13', 'Práctica estudiantil'),
    (7, 7, 7, '2026-10-09', 'Reserva de usuario externo'),
    (8, 8, 8, '2026-10-10', 'Reserva de usuario externo');
