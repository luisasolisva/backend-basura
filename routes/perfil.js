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
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error obteniendo perfiles');
  }
});

// Obtener un perfil por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM perfil WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).send('Perfil no encontrado');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error obteniendo perfil');
  }
});

// Crear un perfil
router.post('/', async (req, res) => {
  try {
    const { nombre_perfil } = req.body;
    const result = await pool.query(
      'INSERT INTO perfil (nombre_perfil) VALUES ($1) RETURNING *',
      [nombre_perfil]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creando perfil');
  }
});

// Actualizar un perfil
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_perfil, activo } = req.body;
    const result = await pool.query(
      'UPDATE perfil SET nombre_perfil = $1, activo = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [nombre_perfil, activo, id]
    );
    if (result.rows.length === 0) return res.status(404).send('Perfil no encontrado');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error actualizando perfil');
  }
});

// Eliminar un perfil
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM perfil WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).send('Perfil no encontrado');
    res.json({ mensaje: 'Perfil eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error eliminando perfil');
  }
});

module.exports = router;
