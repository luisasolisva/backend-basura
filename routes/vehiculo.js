const express = require('express');
const router = express.Router();
const pool = require('../db');

// =========================
// CRUD de Vehículos
// =========================

// Obtener todos los vehículos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vehiculo ORDER BY id');
    res.json({ data: result.rows });
  } catch (err) {
    console.error('Error obteniendo vehículos:', err);
    res.status(500).json({ error: 'Error obteniendo vehículos' });
  }
});

// Obtener un vehículo por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM vehiculo WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error obteniendo vehículo:', err);
    res.status(500).json({ error: 'Error obteniendo vehículo' });
  }
});

// Crear un vehículo
router.post('/', async (req, res) => {
  try {
    const { perfil_id, placa, marca, modelo, capacidad, tipo_combustible } = req.body;

    if (!placa) return res.status(422).json({ message: 'El campo placa es obligatorio.' });

    // Validar placa duplicada
    const existe = await pool.query('SELECT id FROM vehiculo WHERE placa = $1', [placa]);
    if (existe.rows.length > 0) {
      return res.status(400).json({ message: 'La placa ya existe.' });
    }

    const result = await pool.query(
      `INSERT INTO vehiculo (perfil_id, placa, marca, modelo, capacidad, tipo_combustible, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [perfil_id || null, placa, marca || null, modelo || null, capacidad || null, tipo_combustible || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creando vehículo:', err);
    res.status(500).json({ error: 'Error creando vehículo' });
  }
});

// Actualizar un vehículo
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { perfil_id, placa, marca, modelo, capacidad, tipo_combustible } = req.body;

    // Validar si la placa ya existe en otro vehículo
    if (placa) {
      const existe = await pool.query('SELECT id FROM vehiculo WHERE placa = $1 AND id != $2', [placa, id]);
      if (existe.rows.length > 0) {
        return res.status(400).json({ message: 'La placa ya existe.' });
      }
    }

    const result = await pool.query(
      `UPDATE vehiculo 
       SET perfil_id=$1, placa=$2, marca=$3, modelo=$4, capacidad=$5, tipo_combustible=$6, updated_at=NOW()
       WHERE id=$7 RETURNING *`,
      [perfil_id || null, placa, marca, modelo, capacidad, tipo_combustible, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error actualizando vehículo:', err);
    res.status(500).json({ error: 'Error actualizando vehículo' });
  }
});

// Eliminar un vehículo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM vehiculo WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    res.json({ message: 'Vehículo eliminado correctamente' });
  } catch (err) {
    console.error('Error eliminando vehículo:', err);
    res.status(500).json({ error: 'Error eliminando vehículo' });
  }
});

module.exports = router;
