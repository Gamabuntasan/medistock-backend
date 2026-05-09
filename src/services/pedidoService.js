// =============================================================
// COMPONENTE 2: Service - Lógica de negocio de Pedidos
// Orquesta la creación de pedidos: valida stock,
// crea el pedido, descuenta inventario.
// =============================================================

const PedidoRepository = require('../repositories/pedidoRepository');
const { InventarioRepository } = require('../repositories/inventarioRepository');
const { toPedidoDTO, paginatedResponse, successResponse } = require('../dtos/dtos');

const ESTADOS_VALIDOS = ['pendiente', 'en_proceso', 'completado', 'cancelado'];

const PedidoService = {

  async listarPedidos({ page = 1, limit = 20, estado } = {}) {
    if (estado && !ESTADOS_VALIDOS.includes(estado)) {
      const err = new Error(`Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}`);
      err.statusCode = 422;
      throw err;
    }
    const { data, count } = await PedidoRepository.findAll({ page, limit, estado });
    return paginatedResponse(data.map(toPedidoDTO), count, page, limit);
  },

  async obtenerPedido(id) {
    const pedido = await PedidoRepository.findById(id);
    if (!pedido) {
      const err = new Error('Pedido no encontrado');
      err.statusCode = 404;
      throw err;
    }
    return toPedidoDTO(pedido);
  },

  async pedidosPorCliente(id_cliente) {
    const pedidos = await PedidoRepository.findByCliente(id_cliente);
    return successResponse(pedidos.map(toPedidoDTO));
  },

  async crearPedido(datos) {
    // Validar estructura
    if (!datos.id_cliente) {
      const err = new Error('El campo id_cliente es obligatorio');
      err.statusCode = 422;
      throw err;
    }
    if (!datos.detalles || !Array.isArray(datos.detalles) || datos.detalles.length === 0) {
      const err = new Error('El pedido debe tener al menos un producto en detalles');
      err.statusCode = 422;
      throw err;
    }

    // Validar stock de cada producto antes de crear
    for (const item of datos.detalles) {
      if (!item.id_producto || !item.cantidad || item.cantidad <= 0) {
        const err = new Error('Cada detalle debe tener id_producto y cantidad > 0');
        err.statusCode = 422;
        throw err;
      }

      const inventario = await InventarioRepository.findByProducto(item.id_producto);
      if (!inventario || inventario.cantidad_disponible < item.cantidad) {
        const err = new Error(`Stock insuficiente para el producto ID ${item.id_producto}`);
        err.statusCode = 409;
        throw err;
      }
    }

    // Calcular total
    const total = datos.detalles.reduce((sum, item) => {
      return sum + (item.cantidad * item.precio_unitario);
    }, 0);

    const pedidoData = {
      id_cliente: datos.id_cliente,
      estado_pedido: 'pendiente',
      total_pago: total,
      metodo_pago: datos.metodo_pago || null
    };

    const pedidoCreado = await PedidoRepository.create(pedidoData, datos.detalles);

    // Descontar stock de cada producto
    for (const item of datos.detalles) {
      await InventarioRepository.descontarStock(item.id_producto, item.cantidad);
    }

    return toPedidoDTO(pedidoCreado);
  },

  async actualizarEstado(id, estado) {
    if (!ESTADOS_VALIDOS.includes(estado)) {
      const err = new Error(`Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}`);
      err.statusCode = 422;
      throw err;
    }
    await PedidoService.obtenerPedido(id); // verifica que exista
    const actualizado = await PedidoRepository.updateEstado(id, estado);
    return toPedidoDTO(actualizado);
  }
};

module.exports = PedidoService;
