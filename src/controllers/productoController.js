// =============================================================
// COMPONENTE 1: Controller - Endpoints REST de Productos
// Solo se encarga de recibir el request HTTP, llamar
// al service correspondiente y devolver la respuesta.
// NO contiene lógica de negocio ni acceso a datos.
// =============================================================

const ProductoService = require('../services/productoService');
const { successResponse } = require('../dtos/dtos');

const ProductoController = {

  // GET /api/productos?page=1&limit=20&categoria=analgesicos
  async listar(req, res, next) {
    try {
      const { page, limit, categoria } = req.query;
      const resultado = await ProductoService.listarProductos({ page, limit, categoria });
      res.status(200).json(resultado);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/productos/:id
  async obtener(req, res, next) {
    try {
      const producto = await ProductoService.obtenerProducto(req.params.id);
      res.status(200).json(successResponse(producto));
    } catch (err) {
      next(err);
    }
  },

  // POST /api/productos
  async crear(req, res, next) {
    try {
      const nuevo = await ProductoService.crearProducto(req.body);
      res.status(201).json(successResponse(nuevo, 'Producto creado exitosamente'));
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/productos/:id
  async actualizar(req, res, next) {
    try {
      const actualizado = await ProductoService.actualizarProducto(req.params.id, req.body);
      res.status(200).json(successResponse(actualizado, 'Producto actualizado exitosamente'));
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/productos/:id
  async eliminar(req, res, next) {
    try {
      const resultado = await ProductoService.eliminarProducto(req.params.id);
      res.status(200).json(successResponse(resultado, 'Producto desactivado exitosamente'));
    } catch (err) {
      next(err);
    }
  }
};

module.exports = ProductoController;
