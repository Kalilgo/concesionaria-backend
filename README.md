# Concesionaria Backend

Backend API para la aplicación de concesionaria de vehículos.

## Stack Tecnológico

- **Runtime**: Node.js
- **Framework**: Fastify
- **ORM**: Prisma
- **Base de Datos**: SQLite (desarrollo) / PostgreSQL (producción)
- **Validación**: Zod
- **Autenticación**: JWT con cookies httpOnly
- **Email**: Resend

## Estructura

```
src/
├── server.ts         # Punto de entrada
├── app.ts            # Registro de rutas
├── config/           # Configuración de entorno
├── routes/          # Rutas de la API
├── controllers/     # Controladores
├── services/        # Lógica de negocio
├── middlewares/     # Middlewares (auth, error handling)
├── lib/             # Utilidades (Prisma, Cloudinary, Resend)
├── validations/     # Schemas Zod
└── types/           # Tipos TypeScript
```

## Inicio Rápido

```bash
# Instalar dependencias
npm install

# Generar cliente Prisma
npm run db:generate

# Crear base de datos
npm run db:push

# Poblar con datos de ejemplo
npm run db:seed

# Iniciar en desarrollo
npm run dev
```

## Rutas API

### Auth
- `POST /api/v1/auth/login` - Iniciar sesión
- `POST /api/v1/auth/logout` - Cerrar sesión
- `GET /api/v1/auth/me` - Obtener usuario actual

### Vehículos
- `GET /api/v1/vehicles` - Listar todos
- `GET /api/v1/vehicles/marcas` - Listar marcas
- `GET /api/v1/vehicles/slug/:slug` - Obtener por slug
- `POST /api/v1/vehicles` - Crear (admin)
- `PUT /api/v1/vehicles/:id` - Actualizar (admin)
- `DELETE /api/v1/vehicles/:id` - Eliminar (admin)

### Consultas
- `GET /api/v1/inquiries` - Listar consultas
- `POST /api/v1/inquiries` - Crear consulta
- `PATCH /api/v1/inquiries/:id/read` - Marcar como leída (admin)
- `DELETE /api/v1/inquiries/:id` - Eliminar (admin)

### Turnos
- `GET /api/v1/appointments` - Listar turnos
- `POST /api/v1/appointments` - Crear turno
- `PATCH /api/v1/appointments/:id/confirm` - Confirmar turno (admin)
- `DELETE /api/v1/appointments/:id` - Eliminar (admin)

## Variables de Entorno

```env
DATABASE_URL=file:./dev.db
JWT_SECRET=tu-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
PORT=4000
```

## Deploy

Recomendado: Railway

1. Conectar repo de GitHub
2. Railway detecta automáticamente Node.js
3. Configurar DATABASE_URL desde el panel
4. Establecer FRONTEND_URL al dominio de Vercel
