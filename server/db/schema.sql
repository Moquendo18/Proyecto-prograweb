CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255) DEFAULT 'default-avatar.png',
    nivel INTEGER DEFAULT 1,
    experiencia_actual INTEGER DEFAULT 0,
    balance_monedas INTEGER DEFAULT 100,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transmisiones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(150) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    total_espectadores INTEGER DEFAULT 0,
    en_vivo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE regalos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    costo_monedas INTEGER NOT NULL,
    icono_url VARCHAR(255) NOT NULL
);

CREATE TABLE historial_regalos (
    id SERIAL PRIMARY KEY,
    transmision_id INTEGER NOT NULL REFERENCES transmisiones(id) ON DELETE CASCADE,
    emisor_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    receptor_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    regalo_id INTEGER NOT NULL REFERENCES regalos(id) ON DELETE CASCADE,
    enviado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mensajes_chat (
    id SERIAL PRIMARY KEY,
    transmision_id INTEGER NOT NULL REFERENCES transmisiones(id) ON DELETE CASCADE,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    mensaje TEXT NOT NULL,
    enviado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transmisiones_en_vivo ON transmisiones(en_vivo);
CREATE INDEX idx_mensajes_chat_transmision ON mensajes_chat(transmision_id, enviado_en);
CREATE INDEX idx_historial_regalos_transmision ON historial_regalos(transmision_id, enviado_en);

INSERT INTO regalos (nombre, costo_monedas, icono_url) VALUES
    ('Rosa', 1, '🌹'),
    ('Corazón', 5, '❤️'),
    ('Like', 10, '👍'),
    ('Pastel', 20, '🎂'),
    ('Coche', 50, '🚗'),
    ('Barco', 100, '🚢'),
    ('Lion', 200, '🦁'),
    ('Corona', 500, '👑'),
    ('Galaxia', 1000, '🌌'),
    ('Cohete', 2500, '🚀');
