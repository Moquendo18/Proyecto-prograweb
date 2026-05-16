import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const { rows: historicoEspectadores } = await db.query(
      `SELECT
         DATE(creado_en) AS fecha,
         SUM(total_espectadores) AS espectadores
       FROM transmisiones
       WHERE usuario_id = $1 AND en_vivo = FALSE
       GROUP BY DATE(creado_en)
       ORDER BY fecha ASC
       LIMIT 30`,
      [usuarioId]
    );

    const { rows: ingresosRegalos } = await db.query(
      `SELECT
         DATE(hr.enviado_en) AS fecha,
         SUM(r.costo_monedas) AS ingresos
       FROM historial_regalos hr
       JOIN regalos r ON r.id = hr.regalo_id
       JOIN transmisiones t ON t.id = hr.transmision_id
       WHERE t.usuario_id = $1
       GROUP BY DATE(hr.enviado_en)
       ORDER BY fecha ASC
       LIMIT 30`,
      [usuarioId]
    );

    const { rows: minutosTransmitidos } = await db.query(
      `SELECT
         DATE(creado_en) AS fecha,
         COUNT(*) * 30 AS minutos_estimados
       FROM transmisiones
       WHERE usuario_id = $1 AND en_vivo = FALSE
       GROUP BY DATE(creado_en)
       ORDER BY fecha ASC
       LIMIT 30`,
      [usuarioId]
    );

    const { rows: topRegalos } = await db.query(
      `SELECT
         r.nombre,
         r.icono_url,
         COUNT(*) AS veces_enviado,
         SUM(r.costo_monedas) AS total_gastado
       FROM historial_regalos hr
       JOIN regalos r ON r.id = hr.regalo_id
       JOIN transmisiones t ON t.id = hr.transmision_id
       WHERE t.usuario_id = $1
       GROUP BY r.id, r.nombre, r.icono_url
       ORDER BY total_gastado DESC
       LIMIT 5`,
      [usuarioId]
    );

    res.json({
      historicoEspectadores,
      ingresosRegalos,
      minutosTransmitidos,
      topRegalos,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

export default router;
