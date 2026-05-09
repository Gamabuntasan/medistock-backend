// =============================================================
// COMPONENTE 3: Repository / DAO - Productos
// Toda la lógica de acceso a la BD está aquí.
// Los servicios NO hablan directamente con Supabase,
// solo llaman a métodos de este repositorio.
// =============================================================

const supabase = require('../config/supabase');

const ProductoRepository = {

  async findAll({ page = 1, limit = 20, categoria } = {}) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('productos')
      .select('*', { count: 'exact' })
      .eq('activo', true)
      .range(from, to);

    if (categoria) {
      query = query.eq('categoria', categoria);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { data, count };
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(producto) {
    const { data, error } = await supabase
      .from('productos')
      .insert(producto)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, campos) {
    const { data, error } = await supabase
      .from('productos')
      .update(campos)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    // Borrado lógico: no eliminamos el registro, solo lo desactivamos
    const { data, error } = await supabase
      .from('productos')
      .update({ activo: false })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

module.exports = ProductoRepository;
