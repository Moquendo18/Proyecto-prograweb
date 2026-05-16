import { Router } from 'express';
import crypto from 'crypto';
import db from '../db.js';

const router = Router();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const password_hash = hashPassword(password);
    const { rows } = await db.query(
      `INSERT INTO usuarios (username, email, password_hash)
       VALUES ($1, $2, $3) RETURNING id, username, email, avatar_url, nivel, balance_monedas, fecha_registro`,
      [username, email, password_hash]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'El usuario o email ya existe' });
    }
    console.error('Register error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña obligatorios' });
    }

    const password_hash = hashPassword(password);
    const { rows } = await db.query(
      `SELECT id, username, email, avatar_url, nivel, experiencia_actual, balance_monedas, fecha_registro
       FROM usuarios WHERE email = $1 AND password_hash = $2`,
      [email, password_hash]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
