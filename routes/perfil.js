// backend-basura/routes/perfil.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// =========================
// CRUD de Perfil
// =========================

// Obtener todos los perfiles
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM perfil ORDER BY id');
    res.json({ data: result.rows });
  } catch (err) {
    console.error('Error obteniendo perfiles:', err);
    res.status(500).json({ error: 'Error obteniendo perfiles' });
  }
});

// Obtener un perfil por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM perfil WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error obteniendo perfil:', err);
    res.status(500).json({ error: 'Error obteniendo perfil' });
  }
});

// Crear un perfil
router.post('/', async (req, res) => {
  try {
    const { nombre_perfil, activo = true } = req.body;

    if (!nombre_perfil) {
      return res.status(400).json({ message: 'El campo nombre_perfil es obligatorio.' });
    }

    const result = await pool.query(
      `INSERT INTO perfil (nombre_perfil, activo, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW()) RETURNING *`,
      [nombre_perfil, activo]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creando perfil:', err);
    res.status(500).json({ error: 'Error creando perfil' });
  }
});

// Actualizar un perfil
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_perfil, activo } = req.body;

    const result = await pool.query(
      `UPDATE perfil
       SET nombre_perfil = $1, activo = $2, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [nombre_perfil, activo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error actualizando perfil:', err);
    res.status(500).json({ error: 'Error actualizando perfil' });
  }
});

// Eliminar un perfil
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM perfil WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    res.json({ message: 'Perfil eliminado correctamente' });
  } catch (err) {
    console.error('Error eliminando perfil:', err);
    res.status(500).json({ error: 'Error eliminando perfil' });
  }
});

module.exports = router;
