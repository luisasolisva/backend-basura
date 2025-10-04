const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Rutas
app.get('/', (req, res) => res.send('Servidor backend funcionando 🚛'));

// Importar rutas
const perfilRoutes = require('./routes/perfil');   // luego lo creamos igual
const vehiculoRoutes = require('./routes/vehiculo');
const rutaRoutes = require('./routes/ruta');
const horarioRoutes = require('./routes/horario');
const recorridoRoutes = require('./routes/recorrido');
const posicionRoutes = require('./routes/posicion');
const calleRoutes = require('./routes/calle');






// Usar rutas
app.use('/api/perfiles', perfilRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/rutas', rutaRoutes);
app.use('/api/horarios', horarioRoutes);
app.use('/api/recorridos', recorridoRoutes);
app.use('/api/posiciones', posicionRoutes);
app.use('/api/calles', calleRoutes);








// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
