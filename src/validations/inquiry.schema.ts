import { z } from 'zod';

export const createInquirySchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(1, 'Teléfono es requerido'),
  mensaje: z.string().min(10, 'Mensaje debe tener al menos 10 caracteres'),
  vehicleId: z.string().optional(),
});

export const updateInquirySchema = z.object({
  leido: z.boolean().optional(),
});
