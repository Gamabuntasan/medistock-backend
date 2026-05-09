# MEDISTOCK — Backend API RESTful

API RESTful del sistema MEDISTOCK para gestión de inventario y comercio electrónico de productos médicos.

## Stack Tecnológico

- **Runtime:** Node.js 18+
- **Framework:** Express 4
- **Base de Datos:** Supabase (PostgreSQL)
- **Autenticación:** JWT + Supabase Auth
- **Documentación API:** Swagger UI / OpenAPI 3.0

## Estructura de Carpetas

```
medistock-backend/
├── src/
│   ├── controllers/        # [IL3.2 - C1] Endpoints REST (rutas, verbos HTTP, códigos)
│   │   ├── productoController.js
│   │   ├── pedidoController.js
│   │   └── inventarioController.js  (también contiene AuthController)
│   ├── services/           # [IL3.2 - C2] Lógica de negocio desacoplada
│   │   ├── productoService.js
│   │   ├── pedidoService.js
│   │   └── inventarioService.js
│   ├── repositories/       # [IL3.2 - C3] Acceso a datos (Supabase)
│   │   ├── productoRepository.js
│   │   └── inventarioRepository.js  (también contiene UsuarioRepository)
│   ├── models/             # [IL3.2 - C4] Entidades del dominio
│   │   └── entities.js
│   ├── dtos/               # [IL3.2 - C5] Objetos de transferencia de datos
│   │   └── dtos.js
│   ├── middlewares/        # [IL3.2 - C6 y C7]
│   │   ├── auth.middleware.js     # Seguridad / Autenticación JWT
│   │   └── error.middleware.js    # Manejo global de errores
│   ├── config/
│   │   └── supabase.js     # Cliente Supabase
│   ├── routes/
│   │   └── index.js        # Definición de rutas
│   └── index.js            # Entrada del servidor
├── swagger.yaml            # [IL3.2 - C8] Documentación OpenAPI
├── .env.example
├── .gitignore
└── package.json
```

## Componentes implementados (IL3.2)

| # | Componente | Archivo |
|---|-----------|---------|
| C1 | Controller — Endpoints REST | `src/controllers/` |
| C2 | Service — Lógica de negocio | `src/services/` |
| C3 | Repository / DAO | `src/repositories/` |
| C4 | Model / Entity | `src/models/entities.js` |
| C5 | DTOs / Response Objects | `src/dtos/dtos.js` |
| C6 | Seguridad / Auth JWT | `src/middlewares/auth.middleware.js` |
| C7 | Manejo de Errores Global | `src/middlewares/error.middleware.js` |
| C8 | Documentación Swagger/OpenAPI | `swagger.yaml` → `/api-docs` |

## Instalación y configuración

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/medistock-backend.git
cd medistock-backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# 4. Iniciar en desarrollo
npm run dev

# 5. Iniciar en producción
npm start
```

## Variables de entorno requeridas

| Variable | Descripción | Dónde obtenerla |
|----------|-------------|-----------------|
| `SUPABASE_URL` | URL del proyecto Supabase | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave service_role | Supabase → Settings → API |
| `JWT_SECRET` | Clave secreta para firmar JWT | Cualquier string largo |
| `FRONTEND_URL` | URL del cliente frontend | URL de Vercel/Netlify |
| `PORT` | Puerto del servidor (default: 3000) | — |

## Endpoints disponibles

### Autenticación
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/login` | Login → retorna JWT | No |
| GET | `/api/auth/me` | Perfil del usuario | Sí |

### Productos
| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | `/api/productos` | Listar productos (paginado) | Público |
| GET | `/api/productos/:id` | Obtener producto | Público |
| POST | `/api/productos` | Crear producto | Admin, Ejecutivo |
| PATCH | `/api/productos/:id` | Actualizar producto | Admin, Ejecutivo |
| DELETE | `/api/productos/:id` | Desactivar producto | Admin |

### Pedidos
| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | `/api/pedidos` | Listar pedidos | Admin, Ejecutivo, Finanzas |
| GET | `/api/pedidos/:id` | Ver pedido | Autenticado |
| GET | `/api/pedidos/cliente/:id` | Pedidos por cliente | Autenticado |
| POST | `/api/pedidos` | Crear pedido | Autenticado |
| PATCH | `/api/pedidos/:id/estado` | Cambiar estado | Admin, Ejecutivo, Logística |

### Inventario
| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | `/api/inventario` | Listar stock | Admin, Ejecutivo, Logística |
| GET | `/api/inventario/:id` | Stock de producto | Autenticado |
| PATCH | `/api/inventario/:id/stock` | Actualizar stock | Admin, Logística |

### Sistema
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Estado del servidor |
| GET | `/api-docs` | Documentación Swagger |

## Repositorio Frontend

→ https://github.com/Gamabuntasan/Integracion
