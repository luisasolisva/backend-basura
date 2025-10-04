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
    res.json({ data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo recorridos' });
  }
});

// Obtener un recorrido por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM recorrido WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Recorrido no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo recorrido' });
  }
});

// Crear un recorrido
router.post('/', async (req, res) => {
  try {
    const { ruta_id, vehiculo_id, fecha } = req.body;

    if (!ruta_id) return res.status(422).json({ message: 'El campo ruta_id es obligatorio.' });
    if (!vehiculo_id) return res.status(422).json({ message: 'El campo vehiculo_id es obligatorio.' });

    const result = await pool.query(
      `INSERT INTO recorrido (ruta_id, vehiculo_id, fecha, created_at)
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [ruta_id, vehiculo_id, fecha]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creando recorrido' });
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
    if (result.rows.length === 0) return res.status(404).json({ error: 'Recorrido no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error actualizando recorrido' });
  }
});

// Eliminar un recorrido
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM recorrido WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Recorrido no encontrado' });
    res.json({ message: 'Recorrido eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error eliminando recorrido' });
  }
});

// =========================
// Registrar posición en un recorrido
// =========================
router.post('/:recorrido_id/posiciones', async (req, res) => {
  try {
    const { recorrido_id } = req.params;
    const { lat, lon } = req.body;

    if (!lat) return res.status(400).json({ message: 'El campo lat es obligatorio.' });
    if (!lon) return res.status(400).json({ message: 'El campo lon es obligatorio.' });

    const geom = `POINT(${lon} ${lat})`;

    const result = await pool.query(
      `INSERT INTO posicion (recorrido_id, capturado_ts, geom)
       VALUES ($1, NOW(), $2) RETURNING *`,
      [recorrido_id, geom]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error registrando posición en recorrido:', err);
    res.status(500).json({ error: 'Error registrando posición en recorrido' });
  }
});

module.exports = router;
