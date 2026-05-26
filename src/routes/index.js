// src/routes/externalRoutes.js
// ============================================================
// Rutas proxy para APIs externas
// Protege las claves API: nunca se exponen al frontend
//
// CORRECCIÓN IL3.3: mover llamadas a OpenWeatherMap y ExchangeRate
// al backend. El frontend llama a /api/clima y /api/divisas.
// Las claves se cargan desde variables de entorno en Render.
// ============================================================

const express = require('express');
const router  = express.Router();

// Las claves viven en .env (variables de entorno en Render)
// Agregar al .env.example:
//   OPENWEATHER_API_KEY=tu_clave_aqui
//   EXCHANGERATE_API_KEY=tu_clave_aqui
const WEATHER_API_KEY  = process.env.OPENWEATHER_API_KEY;
const EXCHANGE_API_KEY = process.env.EXCHANGERATE_API_KEY;
const CIUDAD           = process.env.WEATHER_CITY || 'Santiago,CL';

/**
 * GET /api/clima
 * Proxy hacia OpenWeatherMap. Retorna datos del clima de Santiago.
 * Público: no requiere JWT (el widget se muestra antes de loguearse).
 */
router.get('/clima', async (req, res, next) => {
  try {
    if (!WEATHER_API_KEY) {
      return res.status(503).json({ message: 'Servicio de clima no configurado' });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${CIUDAD}&appid=${WEATHER_API_KEY}&units=metric&lang=es`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(502).json({ message: 'Error al obtener datos del clima' });
    }

    const data = await response.json();
    // Retornar la respuesta tal cual para mantener compatibilidad con el frontend
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/divisas
 * Proxy hacia ExchangeRate-API. Retorna tasas de cambio base CLP.
 * Público: no requiere JWT.
 */
router.get('/divisas', async (req, res, next) => {
  try {
    if (!EXCHANGE_API_KEY) {
      return res.status(503).json({ message: 'Servicio de divisas no configurado' });
    }

    const url = `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/CLP`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(502).json({ message: 'Error al obtener tasas de cambio' });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
