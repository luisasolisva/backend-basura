// backend-basura/routes/posicion.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// =========================
// CRUD de Posición
// =========================

// Obtener todas las posiciones
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posicion ORDER BY id');
    res.json({ data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo posiciones' });
  }
});

// Obtener posiciones de un recorrido
router.get('/recorrido/:recorrido_id', async (req, res) => {
  try {
    const { recorrido_id } = req.params;
    const result = await pool.query('SELECT * FROM posicion WHERE recorrido_id = $1', [recorrido_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recorrido no encontrado' });
    }

    res.json({ data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo posiciones del recorrido' });
  }
});

// Crear una posición
router.post('/', async (req, res) => {
  try {
    const { recorrido_id, lat, lon } = req.body;

    if (!lat) return res.status(400).json({ message: 'El campo lat es obligatorio.' });
    if (!lon) return res.status(400).json({ message: 'El campo lon es obligatorio.' });

    // Guardamos lat/lon como texto en geom (puedes cambiarlo a tipo geometry si usas PostGIS)
    const geom = `POINT(${lon} ${lat})`;

    const result = await pool.query(
      `INSERT INTO posicion (recorrido_id, capturado_ts, geom)
       VALUES ($1, NOW(), $2) RETURNING *`,
      [recorrido_id, geom]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creando posición:', err);
    res.status(500).json({ error: 'Error creando posición' });
  }
});

// Actualizar una posición
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { recorrido_id, lat, lon } = req.body;

    if (!lat || !lon) {
      return res.status(400).json({ message: 'Los campos lat y lon son obligatorios.' });
    }

    const geom = `POINT(${lon} ${lat})`;

    const result = await pool.query(
      `UPDATE posicion 
       SET recorrido_id=$1, capturado_ts=NOW(), geom=$2
       WHERE id=$3 RETURNING *`,
      [recorrido_id, geom, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Posición no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error actualizando posición:', err);
    res.status(500).json({ error: 'Error actualizando posición' });
  }
});

// Eliminar una posición
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM posicion WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Posición no encontrada' });
    }

    res.json({ message: 'Posición eliminada correctamente' });
  } catch (err) {
    console.error('Error eliminando posición:', err);
    res.status(500).json({ error: 'Error eliminando posición' });
  }
});

module.exports = router;
