// =============================================================
// COMPONENTE 6: Configuración de Seguridad / Autenticación
// Middleware que verifica el JWT en cada request protegido.
// El token se genera cuando el usuario se loguea desde
// el frontend con Supabase Auth y lo envía en el header.
// =============================================================

const jwt = require('jsonwebtoken');
const { UsuarioRepository } = require('../repositories/inventarioRepository');

// Verifica que el request tenga un JWT válido
const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // formato: "Bearer <token>"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Acceso denegado: token no proporcionado'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, rol_id }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

// Verifica que el usuario tenga un rol específico
// Roles: 1=Admin, 2=Cliente, 3=Ejecutivo, 4=Logística, 5=Finanzas
const authorize = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'No autenticado' });
    }
    if (!rolesPermitidos.includes(req.user.rol_id)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para realizar esta acción'
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
