import { z } from 'zod';

export const createAppointmentSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(1, 'Teléfono es requerido'),
  fecha: z.string().datetime({ message: 'Fecha inválida' }),
  hora: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Hora inválida (formato HH:MM)'),
  vehiculo: z.string().min(1, 'Vehículo es requerido'),
  comentarios: z.string().optional(),
  vehicleId: z.string().optional(),
});

export const updateAppointmentSchema = z.object({
  confirmado: z.boolean().optional(),
});
