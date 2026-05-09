// =============================================================
// COMPONENTE 3: Repository / DAO - Inventario & Usuarios
// =============================================================

const supabase = require('../config/supabase');

// ---- INVENTARIO ----
const InventarioRepository = {

  async findAll() {
    const { data, error } = await supabase
      .from('inventario_detalle')
      .select('*, productos(nombre, categoria)');
    if (error) throw error;
    return data;
  },

  async findByProducto(id_producto) {
    const { data, error } = await supabase
      .from('inventario_detalle')
      .select('*, productos(nombre)')
      .eq('id_producto', id_producto)
      .single();
    if (error) throw error;
    return data;
  },

  async descontarStock(id_producto, cantidad) {
    // Usa la función RPC que ya tienes definida en Supabase
    const { error } = await supabase.rpc('descontar_stock', {
      p_producto_id: id_producto,
      p_cantidad: cantidad
    });
    if (error) throw error;
    return true;
  },

  async updateStock(id_producto, nueva_cantidad) {
    const { data, error } = await supabase
      .from('inventario_detalle')
      .update({ cantidad_disponible: nueva_cantidad })
      .eq('id_producto', id_producto)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

// ---- USUARIOS ----
const UsuarioRepository = {

  async findAll() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol_id, activo, created_at');
    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol_id, activo, created_at')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async findByAuthId(auth_id) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol_id, activo')
      .eq('auth_id', auth_id)
      .single();
    if (error) throw error;
    return data;
  }
};

module.exports = { InventarioRepository, UsuarioRepository };
