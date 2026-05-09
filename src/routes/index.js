// =============================================================
// RUTAS - Define los verbos HTTP y conecta con los controllers
// Aquí también se aplican los middlewares de auth por ruta
// =============================================================

const express = require('express');
const router = express.Router();

const ProductoController = require('../controllers/productoController');
const PedidoController = require('../controllers/pedidoController');
const { InventarioController, AuthController } = require('../controllers/inventarioController');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// ============================================================
// AUTH (público)
// ============================================================
router.post('/auth/login', AuthController.login);
router.get('/auth/me', authenticate, AuthController.me);

// ============================================================
// PRODUCTOS
// GET /api/productos          → público (catálogo)
// POST/PATCH/DELETE           → solo admin (rol 1) y ejecutivo (rol 3)
// ============================================================
router.get('/productos', ProductoController.listar);
router.get('/productos/:id', ProductoController.obtener);
router.post('/productos', authenticate, authorize(1, 3), ProductoController.crear);
router.patch('/productos/:id', authenticate, authorize(1, 3), ProductoController.actualizar);
router.delete('/productos/:id', authenticate, authorize(1), ProductoController.eliminar);

// ============================================================
// PEDIDOS
// ============================================================
router.get('/pedidos', authenticate, authorize(1, 3, 5), PedidoController.listar);
router.get('/pedidos/cliente/:id_cliente', authenticate, PedidoController.porCliente);
router.get('/pedidos/:id', authenticate, PedidoController.obtener);
router.post('/pedidos', authenticate, PedidoController.crear);
router.patch('/pedidos/:id/estado', authenticate, authorize(1, 3, 4), PedidoController.actualizarEstado);

// ============================================================
// INVENTARIO
// ============================================================
router.get('/inventario', authenticate, authorize(1, 3, 4), InventarioController.listar);
router.get('/inventario/:id_producto', authenticate, InventarioController.obtener);
router.patch('/inventario/:id_producto/stock', authenticate, authorize(1, 4), InventarioController.actualizar);

// ============================================================
// HEALTH CHECK (para verificar que el servidor está vivo)
// ============================================================
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'MEDISTOCK API',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
