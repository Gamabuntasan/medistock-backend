// =============================================================
// COMPONENTE 2: Service - Lógica de negocio de Productos
// El controller NO valida ni transforma datos.
// Todo eso ocurre aquí. El service tampoco sabe de HTTP,
// solo de reglas de negocio y orquestación.
// =============================================================

const ProductoRepository = require('../repositories/productoRepository');
const { toProductoDTO, paginatedResponse } = require('../dtos/dtos');

const ProductoService = {

  async listarProductos({ page = 1, limit = 20, categoria } = {}) {
    const { data, count } = await ProductoRepository.findAll({ page, limit, categoria });
    const dtos = data.map(toProductoDTO);
    return paginatedResponse(dtos, count, page, limit);
  },

  async obtenerProducto(id) {
    const producto = await ProductoRepository.findById(id);
    if (!producto) {
      const err = new Error('Producto no encontrado');
      err.statusCode = 404;
      throw err;
    }
    return toProductoDTO(producto);
  },

  async crearProducto(datos) {
    // Validaciones de negocio
    if (!datos.nombre || datos.nombre.trim() === '') {
      const err = new Error('El nombre del producto es obligatorio');
      err.statusCode = 422;
      throw err;
    }
    if (!datos.precio || datos.precio <= 0) {
      const err = new Error('El precio debe ser mayor a 0');
      err.statusCode = 422;
      throw err;
    }
    if (datos.stock !== undefined && datos.stock < 0) {
      const err = new Error('El stock no puede ser negativo');
      err.statusCode = 422;
      throw err;
    }

    const nuevo = await ProductoRepository.create({
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion || '',
      precio: datos.precio,
      stock: datos.stock ?? 0,
      categoria: datos.categoria || 'general',
      activo: true
    });

    return toProductoDTO(nuevo);
  },

  async actualizarProducto(id, datos) {
    // Verificar que existe
    await ProductoService.obtenerProducto(id);

    // Solo actualizamos los campos que vienen en el body
    const camposPermitidos = ['nombre', 'descripcion', 'precio', 'stock', 'categoria'];
    const camposActualizar = {};
    for (const campo of camposPermitidos) {
      if (datos[campo] !== undefined) {
        camposActualizar[campo] = datos[campo];
      }
    }

    if (Object.keys(camposActualizar).length === 0) {
      const err = new Error('No se enviaron campos válidos para actualizar');
      err.statusCode = 422;
      throw err;
    }

    const actualizado = await ProductoRepository.update(id, camposActualizar);
    return toProductoDTO(actualizado);
  },

  async eliminarProducto(id) {
    await ProductoService.obtenerProducto(id);
    await ProductoRepository.delete(id);
    return { id, eliminado: true };
  }
};

module.exports = ProductoService;
