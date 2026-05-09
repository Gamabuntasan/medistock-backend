// =============================================================
// COMPONENTE 7: Manejo de Errores Global
// Interceptor centralizado que captura TODAS las excepciones
// y devuelve respuestas HTTP estandarizadas.
// Sin este componente, un error no controlado devolvería
// un stack trace en producción o un crash del servidor.
// =============================================================

const errorHandler = (err, req, res, next) => {
  // Log del error en consola (en producción usarías un logger como Winston)
  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message);

  // Determinar el código HTTP a retornar
  const statusCode = err.statusCode || 500;

  // Respuesta estándar de error
  const response = {
    success: false,
    message: err.message || 'Error interno del servidor',
    path: req.path,
    timestamp: new Date().toISOString()
  };

  // En desarrollo, incluir el stack trace para depuración
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

// Middleware para rutas no encontradas (404)
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.path}`,
    timestamp: new Date().toISOString()
  });
};

module.exports = { errorHandler, notFoundHandler };
