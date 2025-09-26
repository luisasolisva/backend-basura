// backend-basura/routes/recorrido.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// =========================
// CRUD de Recorrido
// =========================

// Obtener todos los recorridos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM recorrido ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error obteniendo recorridos');
  }
});

// Obtener un recorrido por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM recorrido WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).send('Recorrido no encontrado');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error obteniendo recorrido');
  }
});

// Crear un recorrido
router.post('/', async (req, res) => {
  try {
    const { ruta_id, vehiculo_id, fecha } = req.body;
    const result = await pool.query(
      `INSERT INTO recorrido (ruta_id, vehiculo_id, fecha, created_at)
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [ruta_id, vehiculo_id, fecha]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creando recorrido');
  }
});

// Actualizar un recorrido
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ruta_id, vehiculo_id, fecha } = req.body;
    const result = await pool.query(
      `UPDATE recorrido 
       SET ruta_id=$1, vehiculo_id=$2, fecha=$3
       WHERE id=$4 RETURNING *`,
      [ruta_id, vehiculo_id, fecha, id]
    );
    if (result.rows.length === 0) return res.status(404).send('Recorrido no encontrado');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error actualizando recorrido');
  }
});

// Eliminar un recorrido
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM recorrido WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).send('Recorrido no encontrado');
    res.json({ mensaje: 'Recorrido eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error eliminando recorrido');
  }
});

module.exports = router;
