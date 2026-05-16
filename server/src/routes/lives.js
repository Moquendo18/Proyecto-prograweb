import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT t.*, u.username, u.avatar_url
       FROM transmisiones t JOIN usuarios u ON t.usuario_id = u.id
       WHERE t.en_vivo = TRUE
       ORDER BY t.total_espectadores DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching lives:', err);
    res.status(500).json({ error: 'Error al obtener transmisiones' });
  }
});

router.get('/past', async (_req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT t.*, u.username, u.avatar_url,
        (SELECT COUNT(*) FROM mensajes_chat WHERE transmision_id = t.id) AS total_mensajes,
        (SELECT COUNT(*) FROM historial_regalos WHERE transmision_id = t.id) AS total_regalos
       FROM transmisiones t JOIN usuarios u ON t.usuario_id = u.id
       WHERE t.en_vivo = FALSE
       ORDER BY t.creado_en DESC
       LIMIT 20`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching past streams:', err);
    res.status(500).json({ error: 'Error al obtener transmisiones pasadas' });
  }
});

router.get('/:id/messages', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT mc.id, mc.mensaje, mc.enviado_en, u.id AS "usuario_id", u.username, u.avatar_url, u.nivel
       FROM mensajes_chat mc JOIN usuarios u ON u.id = mc.usuario_id
       WHERE mc.transmision_id = $1
       ORDER BY mc.enviado_en ASC
       LIMIT 200`,
      [req.params.id]
    );

    const formatted = rows.map((r) => ({
      id: r.id,
      mensaje: r.mensaje,
      enviado_en: r.enviado_en,
      usuario: {
        id: r.usuario_id,
        username: r.username,
        avatar_url: r.avatar_url,
        nivel: r.nivel,
      },
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT t.*, u.username, u.avatar_url, u.nivel
       FROM transmisiones t JOIN usuarios u ON t.usuario_id = u.id
       WHERE t.id = $1`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Transmisión no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching live:', err);
    res.status(500).json({ error: 'Error al obtener transmisión' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { usuario_id, titulo, categoria } = req.body;
    if (!usuario_id || !titulo || !categoria) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const { rows } = await db.query(
      `INSERT INTO transmisiones (usuario_id, titulo, categoria)
       VALUES ($1, $2, $3) RETURNING *`,
      [usuario_id, titulo, categoria]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating live:', err);
    res.status(500).json({ error: 'Error al crear transmisión' });
  }
});

router.patch('/:id/end', async (req, res) => {
  try {
    const { rows } = await db.query(
      `UPDATE transmisiones SET en_vivo = FALSE WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Transmisión no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error ending live:', err);
    res.status(500).json({ error: 'Error al finalizar transmisión' });
  }
});

export default router;
