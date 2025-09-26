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
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error obteniendo posiciones');
  }
});

// Obtener posiciones de un recorrido
router.get('/recorrido/:recorrido_id', async (req, res) => {
  try {
    const { recorrido_id } = req.params;
    const result = await pool.query('SELECT * FROM posicion WHERE recorrido_id = $1', [recorrido_id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error obteniendo posiciones del recorrido');
  }
});

// Crear una posición
router.post('/', async (req, res) => {
  try {
    const { recorrido_id, capturado_ts, geom } = req.body;
    const result = await pool.query(
      `INSERT INTO posicion (recorrido_id, capturado_ts, geom)
       VALUES ($1, $2, $3) RETURNING *`,
      [recorrido_id, capturado_ts, geom]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creando posición');
  }
});

// Actualizar una posición
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { recorrido_id, capturado_ts, geom } = req.body;
    const result = await pool.query(
      `UPDATE posicion 
       SET recorrido_id=$1, capturado_ts=$2, geom=$3
       WHERE id=$4 RETURNING *`,
      [recorrido_id, capturado_ts, geom, id]
    );
    if (result.rows.length === 0) return res.status(404).send('Posición no encontrada');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error actualizando posición');
  }
});

// Eliminar una posición
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM posicion WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).send('Posición no encontrada');
    res.json({ mensaje: 'Posición eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error eliminando posición');
  }
});

module.exports = router;
