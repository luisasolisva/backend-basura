// backend-basura/routes/vehiculo.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los vehículos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vehiculo ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error obteniendo vehículos');
  }
});

// Obtener un vehículo por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM vehiculo WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).send('Vehículo no encontrado');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error obteniendo vehículo');
  }
});

// Crear un vehículo
router.post('/', async (req, res) => {
  try {
    const { perfil_id, placa, marca, modelo, capacidad, tipo_combustible } = req.body;
    const result = await pool.query(
      `INSERT INTO vehiculo (perfil_id, placa, marca, modelo, capacidad, tipo_combustible)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [perfil_id, placa, marca, modelo, capacidad, tipo_combustible]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creando vehículo');
  }
});

// Actualizar un vehículo
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { perfil_id, placa, marca, modelo, capacidad, tipo_combustible } = req.body;
    const result = await pool.query(
      `UPDATE vehiculo 
       SET perfil_id=$1, placa=$2, marca=$3, modelo=$4, capacidad=$5, tipo_combustible=$6, updated_at=NOW()
       WHERE id=$7 RETURNING *`,
      [perfil_id, placa, marca, modelo, capacidad, tipo_combustible, id]
    );
    if (result.rows.length === 0) return res.status(404).send('Vehículo no encontrado');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error actualizando vehículo');
  }
});

// Eliminar un vehículo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM vehiculo WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).send('Vehículo no encontrado');
    res.json({ mensaje: 'Vehículo eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error eliminando vehículo');
  }
});

module.exports = router;
