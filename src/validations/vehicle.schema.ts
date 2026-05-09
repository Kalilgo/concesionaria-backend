import { z } from 'zod';

export const createVehicleSchema = z.object({
  marca: z.string().min(1, 'Marca es requerida'),
  modelo: z.string().min(1, 'Modelo es requerido'),
  anio: z.number().min(1900).max(new Date().getFullYear() + 1),
  precio: z.number().positive('Precio debe ser positivo'),
  kilometros: z.number().int().min(0),
  combustible: z.string().min(1, 'Tipo de combustible es requerido'),
  transmision: z.string().min(1, 'Transmisión es requerida'),
  color: z.string().min(1, 'Color es requerido'),
  descripcion: z.string().min(10, 'Descripción debe tener al menos 10 caracteres'),
  caracteristicas: z.string(),
  slug: z.string().min(1, 'Slug es requerido').regex(/^[a-z0-9-]+$/, 'Slug debe tener solo letras minúsculas, números y guiones'),
  imagenes: z.array(z.string().url()).optional(),
  disponible: z.boolean().optional(),
  destacado: z.boolean().optional(),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export const vehicleQuerySchema = z.object({
  marca: z.string().optional(),
  minPrecio: z.coerce.number().optional(),
  maxPrecio: z.coerce.number().optional(),
  anio: z.coerce.number().optional(),
  combustible: z.string().optional(),
  transmision: z.string().optional(),
  disponible: z.coerce.boolean().optional(),
  destacado: z.coerce.boolean().optional(),
});
