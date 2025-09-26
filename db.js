// backend-basura/db.js
const { Pool } = require('pg');

// Configuración de la conexión
const pool = new Pool({
  user: 'postgres',        // Usuario por defecto
  host: 'localhost',       // Servidor local
  database: 'basura_db',   // Tu base de datos
  password: 'luisasolis', // 🔑 Usa la que pusiste en la instalación
  port: 5432,              // Puerto que dejaste
});

// Probar conexión
pool.connect()
  .then(() => console.log("✅ Conectado a PostgreSQL"))
  .catch(err => console.error("❌ Error de conexión:", err));

module.exports = pool;
