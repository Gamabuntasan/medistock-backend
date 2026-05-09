// =============================================================
// MEDISTOCK BACKEND - Punto de entrada del servidor
// Express + Supabase + JWT + Swagger
// =============================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const routes = require('./routes/index');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- CORS ----
// Permite que el frontend (en otra máquina) consuma la API
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ---- Body Parser ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Swagger UI (Componente 8: Documentación de API) ----
// Documenta automáticamente todos los endpoints
// Acceder en: http://localhost:3000/api-docs
try {
  const swaggerDoc = YAML.load(path.join(__dirname, '../swagger.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, {
    customSiteTitle: 'MEDISTOCK API Docs',
    customCss: '.swagger-ui .topbar { background-color: #1a73e8; }'
  }));
  console.log('📄 Swagger docs disponibles en /api-docs');
} catch (e) {
  console.warn('⚠️  swagger.yaml no encontrado, documentación no disponible');
}

// ---- Rutas ----
app.use('/api', routes);

// ---- Ruta raíz ----
app.get('/', (req, res) => {
  res.json({
    service: 'MEDISTOCK API',
    version: '1.0.0',
    docs: '/api-docs',
    health: '/api/health'
  });
});

// ---- Manejo de errores (debe ir al final) ----
app.use(notFoundHandler);
app.use(errorHandler);

// ---- Iniciar servidor ----
app.listen(PORT, () => {
  console.log(`\n✅ MEDISTOCK API corriendo en puerto ${PORT}`);
  console.log(`   → Local:      http://localhost:${PORT}`);
  console.log(`   → Docs:       http://localhost:${PORT}/api-docs`);
  console.log(`   → Health:     http://localhost:${PORT}/api/health`);
  console.log(`   → Ambiente:   ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
