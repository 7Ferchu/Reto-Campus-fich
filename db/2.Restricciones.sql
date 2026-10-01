-- Valores por defecto
ALTER TABLE administradores
    ALTER COLUMN fecha_creacion SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE solicitantes
    ALTER COLUMN fecha_registro SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE horarios
    ALTER COLUMN estado SET DEFAULT 'disponible',
    ALTER COLUMN fecha_creacion SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE reservas
    ALTER COLUMN estado SET DEFAULT 'confirmada',
    ALTER COLUMN fecha_creacion SET DEFAULT CURRENT_TIMESTAMP;

-- Validaciones de negocio
ALTER TABLE solicitantes
    ADD CONSTRAINT chk_solicitantes_tipo_usuario
    CHECK (tipo_usuario IN ('estudiante', 'docente', 'administrativo', 'externo'));

ALTER TABLE reservas
    ADD CONSTRAINT chk_reservas_estado
    CHECK (estado IN ('confirmada', 'rechazada', 'cancelada'));

ALTER TABLE horarios
    ADD CONSTRAINT chk_horarios_dia_semana
    CHECK (dia_semana IN ('lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado')),
    ADD CONSTRAINT chk_horarios_rango
    CHECK (hora_inicio >= TIME '07:00:00'
           AND hora_fin <= TIME '22:00:00'
           AND hora_inicio < hora_fin);

-- Llaves primarias
ALTER TABLE administradores
    ADD CONSTRAINT pk_administradores PRIMARY KEY (id_administrador);

ALTER TABLE solicitantes
    ADD CONSTRAINT pk_solicitantes PRIMARY KEY (id_solicitante);

ALTER TABLE canchas
    ADD CONSTRAINT pk_canchas PRIMARY KEY (id_cancha);

ALTER TABLE horarios
    ADD CONSTRAINT pk_horarios PRIMARY KEY (id_horario);

ALTER TABLE reservas
    ADD CONSTRAINT pk_reservas PRIMARY KEY (id_reserva);

-- Llaves foráneas
ALTER TABLE horarios
    ADD CONSTRAINT fk_horarios_canchas
    FOREIGN KEY (id_cancha) REFERENCES canchas (id_cancha);

ALTER TABLE reservas
    ADD CONSTRAINT fk_reservas_solicitantes
    FOREIGN KEY (id_solicitante) REFERENCES solicitantes (id_solicitante),
    ADD CONSTRAINT fk_reservas_horarios
    FOREIGN KEY (id_horario) REFERENCES horarios (id_horario);

-- Correos no repetidos
ALTER TABLE administradores
    ADD CONSTRAINT uq_administradores_usuario UNIQUE (usuario);

ALTER TABLE solicitantes
    ADD CONSTRAINT uq_solicitantes_correo UNIQUE (correo);

-- Una reserva cancelada libera nuevamente el bloque para esa fecha.
CREATE UNIQUE INDEX uq_reserva_horario_fecha
    ON reservas (id_horario, fecha_reserva)
    WHERE estado IN ('confirmada', 'rechazada');
