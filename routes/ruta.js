// backend-basura/routes/ruta.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// =========================
// CRUD de Ruta
// =========================

// Obtener todas las rutas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ruta ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error obteniendo rutas');
  }
});

// Obtener una ruta por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM ruta WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).send('Ruta no encontrada');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error obteniendo ruta');
  }
});

// Crear una ruta
router.post('/', async (req, res) => {
  try {
    const { perfil_id, nombre_ruta, color_hex, shape } = req.body;
    const result = await pool.query(
      `INSERT INTO ruta (perfil_id, nombre_ruta, color_hex, shape)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [perfil_id, nombre_ruta, color_hex, shape]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creando ruta');
  }
});

// Actualizar una ruta
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { perfil_id, nombre_ruta, color_hex, shape } = req.body;
    const result = await pool.query(
      `UPDATE ruta 
       SET perfil_id=$1, nombre_ruta=$2, color_hex=$3, shape=$4, updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [perfil_id, nombre_ruta, color_hex, shape, id]
    );
    if (result.rows.length === 0) return res.status(404).send('Ruta no encontrada');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error actualizando ruta');
  }
});

// Eliminar una ruta
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM ruta WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).send('Ruta no encontrada');
    res.json({ mensaje: 'Ruta eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error eliminando ruta');
  }
});

module.exports = router;
