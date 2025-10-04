const express = require('express');
const router = express.Router();
const pool = require('../db');

// =========================
// CRUD de Rutas
// =========================

// Obtener todas las rutas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ruta ORDER BY id');
    res.json({ data: result.rows });
  } catch (err) {
    console.error('Error obteniendo rutas:', err);
    res.status(500).json({ error: 'Error obteniendo rutas' });
  }
});

// Obtener una ruta por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM ruta WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error obteniendo ruta:', err);
    res.status(500).json({ error: 'Error obteniendo ruta' });
  }
});

// Crear una ruta
router.post('/', async (req, res) => {
  try {
    const { perfil_id, nombre_ruta, color_hex, shape, calles } = req.body;

    // Validaciones mínimas
    if (!perfil_id) return res.status(422).json({ message: 'El campo perfil_id es obligatorio.' });
    if (!nombre_ruta) return res.status(422).json({ message: 'El campo nombre_ruta es obligatorio.' });

    // Insertar en ruta
    const result = await pool.query(
      `INSERT INTO ruta (perfil_id, nombre_ruta, color_hex, shape, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING *`,
      [perfil_id, nombre_ruta, color_hex || null, shape || null]
    );

    const nuevaRuta = result.rows[0];

    // Si mandan calles asociadas (IDs de calle)
    if (calles && Array.isArray(calles) && calles.length > 0) {
      for (let calle_id of calles) {
        await pool.query(
          `INSERT INTO ruta_calle (ruta_id, calle_id) VALUES ($1, $2)`,
          [nuevaRuta.id, calle_id]
        );
      }
    }

    res.status(201).json(nuevaRuta);
  } catch (err) {
    console.error('Error creando ruta:', err);
    res.status(500).json({ error: 'Error creando ruta' });
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

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error actualizando ruta:', err);
    res.status(500).json({ error: 'Error actualizando ruta' });
  }
});

// Eliminar una ruta
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM ruta WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }

    res.json({ message: 'Ruta eliminada correctamente' });
  } catch (err) {
    console.error('Error eliminando ruta:', err);
    res.status(500).json({ error: 'Error eliminando ruta' });
  }
});

module.exports = router;
