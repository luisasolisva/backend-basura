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
    res.json({ data: result.rows });
  } catch (err) {
    console.error('Error obteniendo horarios:', err);
    res.status(500).json({ error: 'Error obteniendo horarios' });
  }
});

// Obtener un horario por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM horario WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error obteniendo horario:', err);
    res.status(500).json({ error: 'Error obteniendo horario' });
  }
});

// Crear un horario
router.post('/', async (req, res) => {
  try {
    const { ruta_id, vehiculo_id, dia_semana, hora_inicio, hora_fin } = req.body;

    if (!dia_semana) {
      return res.status(400).json({ message: 'El campo dia_semana es obligatorio.' });
    }

    const result = await pool.query(
      `INSERT INTO horario (ruta_id, vehiculo_id, dia_semana, hora_inicio, hora_fin, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`,
      [ruta_id, vehiculo_id, dia_semana, hora_inicio, hora_fin]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creando horario:', err);
    res.status(500).json({ error: 'Error creando horario' });
  }
});

// Actualizar un horario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ruta_id, vehiculo_id, dia_semana, hora_inicio, hora_fin } = req.body;

    const result = await pool.query(
      `UPDATE horario
       SET ruta_id=$1, vehiculo_id=$2, dia_semana=$3, hora_inicio=$4, hora_fin=$5, updated_at=NOW()
       WHERE id=$6 RETURNING *`,
      [ruta_id, vehiculo_id, dia_semana, hora_inicio, hora_fin, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error actualizando horario:', err);
    res.status(500).json({ error: 'Error actualizando horario' });
  }
});

// Eliminar un horario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM horario WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }

    res.json({ message: 'Horario eliminado correctamente' });
  } catch (err) {
    console.error('Error eliminando horario:', err);
    res.status(500).json({ error: 'Error eliminando horario' });
  }
});

module.exports = router;
