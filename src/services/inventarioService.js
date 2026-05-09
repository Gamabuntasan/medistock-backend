// =============================================================
// COMPONENTE 2: Service - Lógica de negocio de Inventario
// =============================================================

const { InventarioRepository } = require('../repositories/inventarioRepository');
const { toInventarioDTO, successResponse } = require('../dtos/dtos');

const InventarioService = {

  async listarInventario() {
    const data = await InventarioRepository.findAll();
    return successResponse(data.map(toInventarioDTO));
  },

  async obtenerStockProducto(id_producto) {
    const inv = await InventarioRepository.findByProducto(id_producto);
    if (!inv) {
      const err = new Error('Producto no encontrado en inventario');
      err.statusCode = 404;
      throw err;
    }
    return toInventarioDTO(inv);
  },

  async actualizarStock(id_producto, nueva_cantidad) {
    if (nueva_cantidad < 0) {
      const err = new Error('La cantidad no puede ser negativa');
      err.statusCode = 422;
      throw err;
    }
    const actualizado = await InventarioRepository.updateStock(id_producto, nueva_cantidad);
    return toInventarioDTO(actualizado);
  }
};

module.exports = InventarioService;
