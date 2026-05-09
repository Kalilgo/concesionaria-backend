import { prisma } from '../lib/prisma.js';
import { CreateAppointmentInput } from '../types/index.js';
import { NotFoundError } from '../utils/response.js';
import { sendEmail } from '../lib/resend.js';

export const appointmentsService = {
  async findAll(filters?: { confirmedOnly?: boolean; page?: number; limit?: number }) {
    const { page = 1, limit = 20, confirmedOnly } = filters || {};
    const where = confirmedOnly !== undefined ? { confirmado: confirmedOnly } : {};
    const skip = (page - 1) * limit;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        orderBy: [{ fecha: 'asc' }, { hora: 'asc' }],
        skip,
        take: limit,
        include: { vehicle: { select: { id: true, marca: true, modelo: true, slug: true } } },
      }),
      prisma.appointment.count({ where }),
    ]);

    return { appointments, meta: { page, limit, total } };
  },

  async findById(id: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { vehicle: { select: { id: true, marca: true, modelo: true, slug: true } } },
    });
    if (!appointment) throw new NotFoundError('Turno');
    return appointment;
  },

  async create(data: CreateAppointmentInput) {
    const existingSlot = await prisma.appointment.findFirst({
      where: {
        fecha: new Date(data.fecha),
        hora: data.hora,
      },
    });

    if (existingSlot) {
      throw new Error('Este horario ya está reservado');
    }

    const appointment = await prisma.appointment.create({
      data: {
        ...data,
        fecha: new Date(data.fecha),
      },
      include: { vehicle: { select: { marca: true, modelo: true } } },
    });

    await sendEmail({
      to: 'admin@concesionaria.com',
      subject: `Nuevo turno de ${data.nombre}`,
      html: `
        <h1>Nuevo turno solicitado</h1>
        <p><strong>Nombre:</strong> ${data.nombre}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Teléfono:</strong> ${data.telefono}</p>
        <p><strong>Vehículo:</strong> ${data.vehiculo}</p>
        <p><strong>Fecha:</strong> ${new Date(data.fecha).toLocaleDateString('es-AR')}</p>
        <p><strong>Hora:</strong> ${data.hora}</p>
        ${data.comentarios ? `<p><strong>Comentarios:</strong> ${data.comentarios}</p>` : ''}
        <p><strong>Fecha de solicitud:</strong> ${new Date().toLocaleString('es-AR')}</p>
      `,
    });

    return appointment;
  },

  async confirm(id: string) {
    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Turno');

    return prisma.appointment.update({
      where: { id },
      data: { confirmado: true },
    });
  },

  async cancel(id: string) {
    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Turno');

    return prisma.appointment.update({
      where: { id },
      data: { confirmado: false },
    });
  },

  async delete(id: string) {
    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Turno');

    return prisma.appointment.delete({ where: { id } });
  },

  async getStats() {
    const [total, confirmed, pending] = await Promise.all([
      prisma.appointment.count(),
      prisma.appointment.count({ where: { confirmado: true } }),
      prisma.appointment.count({ where: { confirmado: false } }),
    ]);
    return { total, confirmed, pending };
  },

  async getUpcoming(limit = 5) {
    const now = new Date();
    return prisma.appointment.findMany({
      where: {
        fecha: { gte: now },
        confirmado: false,
      },
      orderBy: [{ fecha: 'asc' }, { hora: 'asc' }],
      take: limit,
      include: { vehicle: { select: { marca: true, modelo: true } } },
    });
  },
};