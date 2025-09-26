// backend-basura/routes/calle.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// =========================
// CRUD de Calle
// =========================

// Obtener todas las calles
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM calle ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error obteniendo calles');
  }
});

// Obtener una calle por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM calle WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).send('Calle no encontrada');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error obteniendo calle');
  }
});

// Crear una calle
router.post('/', async (req, res) => {
  try {
    const { nombre, shape } = req.body;
    const result = await pool.query(
      `INSERT INTO calle (nombre, shape, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW()) RETURNING *`,
      [nombre, shape]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creando calle');
  }
});

// Actualizar una calle
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, shape } = req.body;
    const result = await pool.query(
      `UPDATE calle 
       SET nombre=$1, shape=$2, updated_at=NOW()
       WHERE id=$3 RETURNING *`,
      [nombre, shape, id]
    );
    if (result.rows.length === 0) return res.status(404).send('Calle no encontrada');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error actualizando calle');
  }
});

// Eliminar una calle
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM calle WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).send('Calle no encontrada');
    res.json({ mensaje: 'Calle eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error eliminando calle');
  }
});

module.exports = router;
