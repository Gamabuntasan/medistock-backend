// =============================================================
// COMPONENTE 4: Model / Entity
// Define las entidades del dominio MEDISTOCK.
// Estas clases representan los objetos de negocio reales
// y sirven como referencia para validaciones y mapeos.
// =============================================================

class Producto {
  constructor({ id, nombre, descripcion, precio, stock, categoria, activo, created_at }) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.stock = stock;
    this.categoria = categoria;
    this.activo = activo ?? true;
    this.created_at = created_at;
  }
}

class Usuario {
  constructor({ id, auth_id, nombre, email, rol_id, activo, created_at }) {
    this.id = id;
    this.auth_id = auth_id;
    this.nombre = nombre;
    this.email = email;
    this.rol_id = rol_id;
    this.activo = activo ?? true;
    this.created_at = created_at;
  }
}

class Pedido {
  constructor({ id_pedido, id_cliente, estado_pedido, total_pago, metodo_pago, created_at }) {
    this.id_pedido = id_pedido;
    this.id_cliente = id_cliente;
    this.estado_pedido = estado_pedido ?? 'pendiente';
    this.total_pago = total_pago;
    this.metodo_pago = metodo_pago;
    this.created_at = created_at;
  }
}

class DetallePedido {
  constructor({ id, id_pedido, id_producto, cantidad, precio_unitario }) {
    this.id = id;
    this.id_pedido = id_pedido;
    this.id_producto = id_producto;
    this.cantidad = cantidad;
    this.precio_unitario = precio_unitario;
  }
}

class InventarioDetalle {
  constructor({ id, id_producto, cantidad_disponible, ubicacion }) {
    this.id = id;
    this.id_producto = id_producto;
    this.cantidad_disponible = cantidad_disponible;
    this.ubicacion = ubicacion;
  }
}

module.exports = { Producto, Usuario, Pedido, DetallePedido, InventarioDetalle };
