// =============================================================
// COMPONENTE 3: Repository / DAO - Pedidos
// =============================================================

const supabase = require('../config/supabase');

const PedidoRepository = {

  async findAll({ page = 1, limit = 20, estado } = {}) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('pedidos')
      .select('*, detalle_pedidos(*)', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });

    if (estado) {
      query = query.eq('estado_pedido', estado);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { data, count };
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*, detalle_pedidos(*)')
      .eq('id_pedido', id)
      .single();
    if (error) throw error;
    return data;
  },

  async findByCliente(id_cliente) {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*, detalle_pedidos(*)')
      .eq('id_cliente', id_cliente)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(pedido, detalles) {
    // Insertar pedido
    const { data: pedidoCreado, error: errPedido } = await supabase
      .from('pedidos')
      .insert(pedido)
      .select()
      .single();
    if (errPedido) throw errPedido;

    // Insertar detalles con el id del pedido recién creado
    const detallesConId = detalles.map(d => ({
      ...d,
      id_pedido: pedidoCreado.id_pedido
    }));

    const { error: errDetalles } = await supabase
      .from('detalle_pedidos')
      .insert(detallesConId);
    if (errDetalles) throw errDetalles;

    return pedidoCreado;
  },

  async updateEstado(id, estado) {
    const { data, error } = await supabase
      .from('pedidos')
      .update({ estado_pedido: estado })
      .eq('id_pedido', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

module.exports = PedidoRepository;
