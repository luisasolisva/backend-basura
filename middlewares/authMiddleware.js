// backend-basura/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'mi_super_secreto'; // ⚠️ ponlo luego en .env

// Verifica si el token es válido
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  // El token viene como "Bearer <token>"
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // ahora `req.user` tiene { id, email, rol }
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

// Verifica rol específico
function checkRole(role) {
  return (req, res, next) => {
    if (req.user.rol !== role) {
      return res.status(403).json({ error: 'No tienes permisos para esta acción' });
    }
    next();
  };
}

module.exports = { verifyToken, checkRole };
