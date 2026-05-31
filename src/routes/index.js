const express = require('express');
const router  = express.Router();

const { AuthController, InventarioController } = require('../controllers/inventarioController');
const PedidoController  = require('../controllers/pedidoController');
const ProductoController = require('../controllers/productoController');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// ── Health ──────────────────────────────────────────────────────
router.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── Auth ────────────────────────────────────────────────────────
router.post('/auth/login',  AuthController.login);
router.get('/auth/me',      authenticate, AuthController.me);

// ── Productos ───────────────────────────────────────────────────
router.get('/productos',          ProductoController.listar);
router.get('/productos/:id',      ProductoController.obtener);
router.post('/productos',         authenticate, authorize(1, 3), ProductoController.crear);
router.patch('/productos/:id',    authenticate, authorize(1, 3), ProductoController.actualizar);
router.delete('/productos/:id',   authenticate, authorize(1),    ProductoController.eliminar);

// ── Pedidos ─────────────────────────────────────────────────────
router.get('/pedidos',                    authenticate, authorize(1, 3, 5), PedidoController.listar);
router.get('/pedidos/cliente/:id_cliente',authenticate, PedidoController.porCliente);
router.get('/pedidos/:id',                authenticate, PedidoController.obtener);
router.post('/pedidos',                   authenticate, PedidoController.crear);
router.patch('/pedidos/:id/estado',       authenticate, authorize(1, 3, 4), PedidoController.actualizarEstado);

// ── Inventario ──────────────────────────────────────────────────
router.get('/inventario',                    authenticate, authorize(1, 3, 4), InventarioController.listar);
router.get('/inventario/:id_producto',       authenticate, InventarioController.obtener);
router.patch('/inventario/:id_producto/stock', authenticate, authorize(1, 4), InventarioController.actualizar);

// ── APIs externas ───────────────────────────────────────────────
// (acá va tu código existente de /clima y /divisas — NO lo borres)

module.exports = router;
