import { prisma } from '../lib/prisma.js';
import { CreateInquiryInput } from '../types/index.js';
import { NotFoundError } from '../utils/response.js';
import { sendEmail } from '../lib/resend.js';

export const inquiriesService = {
  async findAll(filters?: { unreadOnly?: boolean; page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = filters || {};
    const where = filters?.unreadOnly ? { leido: false } : {};
    const skip = (page - 1) * limit;

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { vehicle: { select: { id: true, marca: true, modelo: true, slug: true } } },
      }),
      prisma.inquiry.count({ where }),
    ]);

    return { inquiries, meta: { page, limit, total } };
  },

  async findById(id: string) {
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: { vehicle: { select: { id: true, marca: true, modelo: true, slug: true } } },
    });
    if (!inquiry) throw new NotFoundError('Consulta');
    return inquiry;
  },

  async create(data: CreateInquiryInput) {
    const inquiry = await prisma.inquiry.create({
      data,
      include: { vehicle: { select: { id: true, marca: true, modelo: true } } },
    });

    const vehicleInfo = inquiry.vehicle 
      ? `${inquiry.vehicle.marca} ${inquiry.vehicle.modelo}` 
      : 'Consulta general';

    await sendEmail({
      to: 'gomezukalil@gmail.com',
      subject: `Nueva consulta de ${data.nombre}`,
      html: `
        <h1>Nueva consulta</h1>
        <p><strong>Nombre:</strong> ${data.nombre}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Teléfono:</strong> ${data.telefono}</p>
        <p><strong>Vehículo:</strong> ${vehicleInfo}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${data.mensaje}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-AR')}</p>
      `,
    });

    return inquiry;
  },

  async markAsRead(id: string) {
    const existing = await prisma.inquiry.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Consulta');

    return prisma.inquiry.update({
      where: { id },
      data: { leido: true },
    });
  },

  async markAllAsRead() {
    return prisma.inquiry.updateMany({
      where: { leido: false },
      data: { leido: true },
    });
  },

  async delete(id: string) {
    const existing = await prisma.inquiry.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Consulta');

    return prisma.inquiry.delete({ where: { id } });
  },

  async getStats() {
    const [total, unread, read] = await Promise.all([
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { leido: false } }),
      prisma.inquiry.count({ where: { leido: true } }),
    ]);
    return { total, unread, read };
  },
};