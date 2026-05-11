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
├── server.ts          # Punto de entrada con configuración
├── app.ts             # Registro de rutas
├── config/            # Configuración de entorno validada
├── routes/            # Rutas de la API
├── controllers/       # Controladores (lógica HTTP)
├── services/          # Lógica de negocio
├── middlewares/       # Middlewares (auth, error handling)
├── lib/               # Utilidades (Prisma, Cloudinary, Resend)
├── types/             # Tipos TypeScript
└── utils/             # Utilidades comunes (responses, errors)
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

## Variables de Entorno

```env
DATABASE_URL=file:./prisma/prisma/dev.db
JWT_SECRET=tu-secret-key-minimo-32-caracteres
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
PORT=4000
NODE_ENV=development

# Opcional - Cloudinary para uploads
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Opcional - Resend para emails
RESEND_API_KEY=
```

## Credenciales de Prueba

Después de ejecutar `npm run db:seed`:

- **Email**: `gomezukalil@gmail.com`
- **Contraseña**: `123`

## Rutas API

### Auth
- `POST /api/v1/auth/login` - Iniciar sesión
- `POST /api/v1/auth/logout` - Cerrar sesión
- `POST /api/v1/auth/refresh` - Renovar token
- `GET /api/v1/auth/me` - Obtener usuario actual (requiere auth)

### Vehículos
- `GET /api/v1/vehicles` - Listar todos (soporta paginación y filtros)
- `GET /api/v1/vehicles/marcas` - Listar marcas únicas
- `GET /api/v1/vehicles/filtros` - Obtener todos los filtros disponibles
- `GET /api/v1/vehicles/slug/:slug` - Obtener por slug
- `GET /api/v1/vehicles/:id` - Obtener por ID
- `POST /api/v1/vehicles` - Crear (admin)
- `PUT /api/v1/vehicles/:id` - Actualizar (admin)
- `DELETE /api/v1/vehicles/:id` - Eliminar (admin)

### Consultas
- `GET /api/v1/inquiries` - Listar consultas (paginación)
- `GET /api/v1/inquiries/stats` - Estadísticas (admin)
- `GET /api/v1/inquiries/:id` - Ver consulta
- `POST /api/v1/inquiries` - Crear consulta
- `PATCH /api/v1/inquiries/:id/read` - Marcar como leída (admin)
- `PATCH /api/v1/inquiries/read-all` - Marcar todas como leídas (admin)
- `DELETE /api/v1/inquiries/:id` - Eliminar (admin)

### Turnos
- `GET /api/v1/appointments` - Listar turnos (paginación)
- `GET /api/v1/appointments/stats` - Estadísticas (admin)
- `GET /api/v1/appointments/upcoming` - Próximos turnos (admin)
- `GET /api/v1/appointments/:id` - Ver turno
- `POST /api/v1/appointments` - Crear turno
- `PATCH /api/v1/appointments/:id/confirm` - Confirmar turno (admin)
- `PATCH /api/v1/appointments/:id/cancel` - Cancelar turno (admin)
- `DELETE /api/v1/appointments/:id` - Eliminar (admin)

## Scripts

```bash
npm run dev          # Desarrollo con hot-reload
npm run build        # Compilar TypeScript
npm run start        # Iniciar producción
npm run db:generate  # Generar Prisma Client
npm run db:push      # Sincronizar schema con DB
npm run db:seed      # Poblar datos de ejemplo
```

## Deploy

Recomendado: Railway

1. Conectar repo de GitHub
2. Railway detecta automáticamente Node.js
3. Configurar DATABASE_URL desde el panel
4. Establecer FRONTEND_URL al dominio de Vercel

## Características Implementadas

- Validación de entorno con Zod
- Manejo centralizado de errores
- Respuestas API estandarizadas
- Shutdown graceful (SIGTERM/SIGINT)
- Logging estructurado con niveles
- CORS configurado para frontend
- Cookies httpOnly para JWT
- Email notifications (opcional)
- Paginación en listados
- Filtros avanzados en vehículos