// =============================================================
// COMPONENTE 5: DTOs / Response Objects
// Separan lo que devuelve la BD de lo que expone la API.
// Evitan filtrar campos internos (auth_id, claves, etc.)
// y permiten formatear la respuesta sin cambiar el modelo.
// =============================================================

// --- Productos ---
const toProductoDTO = (row) => ({
  id: row.id,
  nombre: row.nombre,
  descripcion: row.descripcion,
  precio: row.precio,
  stock: row.stock,
  categoria: row.categoria,
  activo: row.activo
});

// --- Usuarios (sin exponer auth_id ni datos sensibles) ---
const toUsuarioDTO = (row) => ({
  id: row.id,
  nombre: row.nombre,
  email: row.email,
  rol_id: row.rol_id,
  activo: row.activo
});

// --- Pedido con sus detalles ---
const toPedidoDTO = (row) => ({
  id_pedido: row.id_pedido,
  id_cliente: row.id_cliente,
  estado: row.estado_pedido,
  total: row.total_pago,
  metodo_pago: row.metodo_pago,
  fecha: row.created_at,
  detalles: row.detalle_pedidos
    ? row.detalle_pedidos.map(toDetallePedidoDTO)
    : []
});

// --- Detalle de pedido ---
const toDetallePedidoDTO = (row) => ({
  id_producto: row.id_producto,
  cantidad: row.cantidad,
  precio_unitario: row.precio_unitario,
  subtotal: row.cantidad * row.precio_unitario
});

// --- Inventario ---
const toInventarioDTO = (row) => ({
  id_producto: row.id_producto,
  producto: row.productos ? row.productos.nombre : null,
  cantidad_disponible: row.cantidad_disponible,
  ubicacion: row.ubicacion
});

// --- Respuesta estándar de la API ---
const successResponse = (data, message = 'OK') => ({
  success: true,
  message,
  data
});

const paginatedResponse = (data, total, page, limit) => ({
  success: true,
  data,
  pagination: {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    pages: Math.ceil(total / limit)
  }
});

module.exports = {
  toProductoDTO,
  toUsuarioDTO,
  toPedidoDTO,
  toDetallePedidoDTO,
  toInventarioDTO,
  successResponse,
  paginatedResponse
};
