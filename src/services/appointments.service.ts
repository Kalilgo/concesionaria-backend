import { prisma } from '../lib/prisma.js';
import { CreateAppointmentInput, UpdateAppointmentInput } from '../types/index.js';
import { sendEmail } from '../lib/resend.js';

export const appointmentsService = {
  async findAll(confirmedOnly?: boolean) {
    return prisma.appointment.findMany({
      where: confirmedOnly !== undefined ? { confirmado: confirmedOnly } : undefined,
      orderBy: [{ fecha: 'asc' }, { hora: 'asc' }],
      include: { vehicle: { select: { marca: true, modelo: true } } },
    });
  },

  async findById(id: string) {
    return prisma.appointment.findUnique({
      where: { id },
      include: { vehicle: { select: { marca: true, modelo: true } } },
    });
  },

  async create(data: CreateAppointmentInput) {
    const appointment = await prisma.appointment.create({
      data,
      include: { vehicle: { select: { marca: true, modelo: true } } },
    });

    await sendEmail({
      to: 'admin@concesionaria.com',
      subject: `Nuevo turno de ${data.nombre}`,
      html: `<h1>Nuevo turno</h1>
        <p><strong>Nombre:</strong> ${data.nombre}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Teléfono:</strong> ${data.telefono}</p>
        <p><strong>Vehículo:</strong> ${data.vehiculo}</p>
        <p><strong>Fecha:</strong> ${new Date(data.fecha).toLocaleDateString('es-AR')}</p>
        <p><strong>Hora:</strong> ${data.hora}</p>
        <p><strong>Comentarios:</strong> ${data.comentarios || 'Ninguno'}</p>`,
    });

    return appointment;
  },

  async update(id: string, data: UpdateAppointmentInput) {
    return prisma.appointment.update({
      where: { id },
      data,
    });
  },

  async confirm(id: string) {
    return prisma.appointment.update({
      where: { id },
      data: { confirmado: true },
    });
  },

  async delete(id: string) {
    return prisma.appointment.delete({
      where: { id },
    });
  },

  async getStats() {
    const [total, confirmed, pending] = await Promise.all([
      prisma.appointment.count(),
      prisma.appointment.count({ where: { confirmado: true } }),
      prisma.appointment.count({ where: { confirmado: false } }),
    ]);
    return { total, confirmed, pending };
  },
};
