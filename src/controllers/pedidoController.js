// =============================================================
// COMPONENTE 1: Controller - Endpoints REST de Pedidos
// =============================================================

const PedidoService = require('../services/pedidoService');
const { successResponse } = require('../dtos/dtos');

const PedidoController = {

  // GET /api/pedidos?page=1&estado=pendiente
  async listar(req, res, next) {
    try {
      const resultado = await PedidoService.listarPedidos(req.query);
      res.status(200).json(resultado);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/pedidos/:id
  async obtener(req, res, next) {
    try {
      const pedido = await PedidoService.obtenerPedido(req.params.id);
      res.status(200).json(successResponse(pedido));
    } catch (err) {
      next(err);
    }
  },

  // GET /api/pedidos/cliente/:id_cliente
  async porCliente(req, res, next) {
    try {
      const resultado = await PedidoService.pedidosPorCliente(req.params.id_cliente);
      res.status(200).json(resultado);
    } catch (err) {
      next(err);
    }
  },

  // POST /api/pedidos
  async crear(req, res, next) {
    try {
      const nuevo = await PedidoService.crearPedido(req.body);
      res.status(201).json(successResponse(nuevo, 'Pedido creado exitosamente'));
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/pedidos/:id/estado
  async actualizarEstado(req, res, next) {
    try {
      const { estado } = req.body;
      const actualizado = await PedidoService.actualizarEstado(req.params.id, estado);
      res.status(200).json(successResponse(actualizado, `Estado actualizado a: ${estado}`));
    } catch (err) {
      next(err);
    }
  }
};

module.exports = PedidoController;
