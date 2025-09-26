// backend-basura/routes/horario.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// =========================
// CRUD de Horario
// =========================

// Obtener todos los horarios
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM horario ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error obteniendo horarios');
  }
});

// Obtener un horario por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM horario WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).send('Horario no encontrado');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error obteniendo horario');
  }
});

// Crear un horario
router.post('/', async (req, res) => {
  try {
    const { ruta_id, vehiculo_id, dia_semana, hora_inicio, hora_fin } = req.body;
    const result = await pool.query(
      `INSERT INTO horario (ruta_id, vehiculo_id, dia_semana, hora_inicio, hora_fin)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [ruta_id, vehiculo_id, dia_semana, hora_inicio, hora_fin]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creando horario');
  }
});

// Actualizar un horario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ruta_id, vehiculo_id, dia_semana, hora_inicio, hora_fin } = req.body;
    const result = await pool.query(
      `UPDATE horario 
       SET ruta_id=$1, vehiculo_id=$2, dia_semana=$3, hora_inicio=$4, hora_fin=$5
       WHERE id=$6 RETURNING *`,
      [ruta_id, vehiculo_id, dia_semana, hora_inicio, hora_fin, id]
    );
    if (result.rows.length === 0) return res.status(404).send('Horario no encontrado');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error actualizando horario');
  }
});

// Eliminar un horario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM horario WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).send('Horario no encontrado');
    res.json({ mensaje: 'Horario eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error eliminando horario');
  }
});

module.exports = router;
