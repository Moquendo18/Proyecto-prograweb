import { Router } from 'express';
import db from '../db.js';

const router = Router();

const PAYMENT_PACKAGES = [
  { id: 1, monedas: 100, precio: 1.99 },
  { id: 2, monedas: 500, precio: 7.99 },
  { id: 3, monedas: 1200, precio: 14.99 },
  { id: 4, monedas: 5000, precio: 49.99 },
];

router.get('/packages', (_req, res) => {
  res.json(PAYMENT_PACKAGES);
});

router.post('/deposit', async (req, res) => {
  try {
    const { usuario_id, package_id } = req.body;
    if (!usuario_id || !package_id) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const pkg = PAYMENT_PACKAGES.find((p) => p.id === package_id);
    if (!pkg) {
      return res.status(400).json({ error: 'Paquete no válido' });
    }

    const { rows } = await db.query(
      `UPDATE usuarios SET balance_monedas = balance_monedas + $1
       WHERE id = $2 RETURNING id, username, balance_monedas`,
      [pkg.monedas, usuario_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Depósito exitoso', usuario: rows[0], paquete: pkg });
  } catch (err) {
    console.error('Deposit error:', err);
    res.status(500).json({ error: 'Error al procesar depósito' });
  }
});

export default router;
