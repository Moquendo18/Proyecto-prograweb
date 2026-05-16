import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM regalos ORDER BY costo_monedas ASC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching gifts:', err);
    res.status(500).json({ error: 'Error al obtener regalos' });
  }
});

export default router;
