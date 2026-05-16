import db from '../db.js';

const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 900, 1500, 2300, 3400, 5000, 7500,
];

function calcularNivel(exp) {
  let nivel = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (exp >= LEVEL_THRESHOLDS[i]) {
      nivel = i + 1;
      break;
    }
  }
  return nivel;
}

export function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    socket.on('join-room', async ({ transmisionId, usuarioId }) => {
      try {
        socket.join(`sala:${transmisionId}`);
        socket.data.transmisionId = transmisionId;
        socket.data.usuarioId = usuarioId;

        await db.query(
          `UPDATE transmisiones SET total_espectadores = total_espectadores + 1 WHERE id = $1`,
          [transmisionId]
        );

        const { rows: usuarios } = await db.query(
          `SELECT COUNT(*) AS count FROM mensajes_chat WHERE transmision_id = $1`,
          [transmisionId]
        );

        io.to(`sala:${transmisionId}`).emit('room-update', {
          espectadores: await obtenerEspectadores(transmisionId),
        });

        console.log(`${socket.id} se unió a la sala ${transmisionId}`);
      } catch (err) {
        console.error('Error join-room:', err);
        socket.emit('error', { message: 'Error al unirse a la transmisión' });
      }
    });

    socket.on('send-message', async ({ mensaje }) => {
      try {
        const { transmisionId, usuarioId } = socket.data;
        if (!transmisionId || !usuarioId || !mensaje?.trim()) return;

        const { rows: usuarios } = await db.query(
          `SELECT id, username, avatar_url, nivel FROM usuarios WHERE id = $1`,
          [usuarioId]
        );

        if (usuarios.length === 0) return;

        const usuario = usuarios[0];

        const { rows: msgs } = await db.query(
          `INSERT INTO mensajes_chat (transmision_id, usuario_id, mensaje)
           VALUES ($1, $2, $3) RETURNING id, enviado_en`,
          [transmisionId, usuarioId, mensaje.trim()]
        );

        io.to(`sala:${transmisionId}`).emit('new-message', {
          id: msgs[0].id,
          usuario: {
            id: usuario.id,
            username: usuario.username,
            avatar_url: usuario.avatar_url,
            nivel: usuario.nivel,
          },
          mensaje: mensaje.trim(),
          enviado_en: msgs[0].enviado_en,
        });
      } catch (err) {
        console.error('Error send-message:', err);
        socket.emit('error', { message: 'Error al enviar mensaje' });
      }
    });

    socket.on('send-gift', async ({ regaloId }) => {
      try {
        const { transmisionId, usuarioId } = socket.data;
        if (!transmisionId || !usuarioId || !regaloId) return;

        const { rows: regalos } = await db.query(
          `SELECT id, nombre, costo_monedas, icono_url FROM regalos WHERE id = $1`,
          [regaloId]
        );

        if (regalos.length === 0) {
          return socket.emit('error', { message: 'Regalo no válido' });
        }

        const regalo = regalos[0];

        const { rows: emisores } = await db.query(
          `SELECT id, balance_monedas, experiencia_actual FROM usuarios WHERE id = $1`,
          [usuarioId]
        );

        if (emisores.length === 0) return;
        const emisor = emisores[0];

        if (emisor.balance_monedas < regalo.costo_monedas) {
          return socket.emit('error', {
            message: 'Monedas insuficientes',
            code: 'INSUFFICIENT_BALANCE',
          });
        }

        const { rows: transmisiones } = await db.query(
          `SELECT usuario_id FROM transmisiones WHERE id = $1`,
          [transmisionId]
        );

        if (transmisiones.length === 0) return;
        const receptorId = transmisiones[0].usuario_id;

        const nuevaExp = emisor.experiencia_actual + Math.floor(regalo.costo_monedas * 0.5);
        const nuevoNivel = calcularNivel(nuevaExp);

        await db.query('BEGIN');

        await db.query(
          `UPDATE usuarios SET balance_monedas = balance_monedas - $1, experiencia_actual = $2, nivel = $3 WHERE id = $4`,
          [regalo.costo_monedas, nuevaExp, nuevoNivel, usuarioId]
        );

        if (receptorId !== usuarioId) {
          const expReceptor = Math.floor(regalo.costo_monedas * 0.2);
          await db.query(
            `UPDATE usuarios SET experiencia_actual = experiencia_actual + $1 WHERE id = $2`,
            [expReceptor, receptorId]
          );
        }

        const { rows: receptorCheck } = await db.query(
          `SELECT nivel FROM usuarios WHERE id = $1`,
          [receptorId]
        );

        await db.query(
          `INSERT INTO historial_regalos (transmision_id, emisor_id, receptor_id, regalo_id)
           VALUES ($1, $2, $3, $4)`,
          [transmisionId, usuarioId, receptorId, regaloId]
        );

        await db.query('COMMIT');

        io.to(`sala:${transmisionId}`).emit('gift-received', {
          regalo: {
            id: regalo.id,
            nombre: regalo.nombre,
            icono_url: regalo.icono_url,
            costo_monedas: regalo.costo_monedas,
          },
          emisor: { id: emisor.id },
          receptor_id: receptorId,
          emisor_nivel_actual: nuevoNivel,
        });

        socket.emit('balance-update', {
          nuevo_balance: emisor.balance_monedas - regalo.costo_monedas,
          nueva_experiencia: nuevaExp,
          nuevo_nivel: nuevoNivel,
        });
      } catch (err) {
        await db.query('ROLLBACK').catch(() => {});
        console.error('Error send-gift:', err);
        socket.emit('error', { message: 'Error al enviar regalo' });
      }
    });

    socket.on('disconnect', async () => {
      try {
        const { transmisionId } = socket.data;
        if (transmisionId) {
          await db.query(
            `UPDATE transmisiones SET total_espectadores = GREATEST(total_espectadores - 1, 0) WHERE id = $1`,
            [transmisionId]
          );

          io.to(`sala:${transmisionId}`).emit('room-update', {
            espectadores: await obtenerEspectadores(transmisionId),
          });
        }
      } catch (err) {
        console.error('Error disconnect:', err);
      }
      console.log(`Usuario desconectado: ${socket.id}`);
    });
  });
}

async function obtenerEspectadores(transmisionId) {
  try {
    const { rows } = await db.query(
      `SELECT COUNT(*) AS count FROM mensajes_chat WHERE transmision_id = $1`,
      [transmisionId]
    );
    return parseInt(rows[0].count);
  } catch {
    return 0;
  }
}
