// =============================================================
// COMPONENTE 1: Controller - Inventario & Auth
// =============================================================

const InventarioService = require('../services/inventarioService');
const { UsuarioRepository } = require('../repositories/inventarioRepository');
const { toUsuarioDTO, successResponse } = require('../dtos/dtos');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

// ---- INVENTARIO ----
const InventarioController = {

  // GET /api/inventario
  async listar(req, res, next) {
    try {
      const resultado = await InventarioService.listarInventario();
      res.status(200).json(resultado);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/inventario/:id_producto
  async obtener(req, res, next) {
    try {
      const stock = await InventarioService.obtenerStockProducto(req.params.id_producto);
      res.status(200).json(successResponse(stock));
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/inventario/:id_producto/stock
  async actualizar(req, res, next) {
    try {
      const { cantidad } = req.body;
      if (cantidad === undefined) {
        return res.status(422).json({ success: false, message: 'El campo cantidad es requerido' });
      }
      const actualizado = await InventarioService.actualizarStock(req.params.id_producto, cantidad);
      res.status(200).json(successResponse(actualizado, 'Stock actualizado'));
    } catch (err) {
      next(err);
    }
  }
};

// ---- AUTH ----
const AuthController = {

  // POST /api/auth/login
  // Recibe email+password, valida con Supabase Auth, devuelve JWT propio
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(422).json({ success: false, message: 'Email y password son requeridos' });
      }

      // Autenticar con Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError || !authData.user) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      }

      // Obtener datos del usuario de nuestra tabla 'usuarios'
      const usuario = await UsuarioRepository.findByAuthId(authData.user.id);
      if (!usuario) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado en el sistema' });
      }

      // Generar JWT propio de MEDISTOCK
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, rol_id: usuario.rol_id },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      res.status(200).json(successResponse({
        token,
        usuario: toUsuarioDTO(usuario)
      }, 'Login exitoso'));

    } catch (err) {
      next(err);
    }
  },

  // GET /api/auth/me
  async me(req, res, next) {
    try {
      const usuario = await UsuarioRepository.findById(req.user.id);
      if (!usuario) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      res.status(200).json(successResponse(toUsuarioDTO(usuario)));
    } catch (err) {
      next(err);
    }
  }
};

module.exports = { InventarioController, AuthController };
