import { prisma } from '../lib/prisma.js';
import { CreateInquiryInput, UpdateInquiryInput } from '../types/index.js';
import { sendEmail } from '../lib/resend.js';

export const inquiriesService = {
  async findAll(unreadOnly?: boolean) {
    return prisma.inquiry.findMany({
      where: unreadOnly ? { leido: false } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { vehicle: { select: { marca: true, modelo: true } } },
    });
  },

  async findById(id: string) {
    return prisma.inquiry.findUnique({
      where: { id },
      include: { vehicle: { select: { marca: true, modelo: true } } },
    });
  },

  async create(data: CreateInquiryInput) {
    const inquiry = await prisma.inquiry.create({
      data,
      include: { vehicle: { select: { marca: true, modelo: true } } },
    });

    await sendEmail({
      to: 'admin@concesionaria.com',
      subject: `Nueva consulta de ${data.nombre}`,
      html: `<h1>Nueva consulta</h1>
        <p><strong>Nombre:</strong> ${data.nombre}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Teléfono:</strong> ${data.telefono}</p>
        <p><strong>Vehículo:</strong> ${inquiry.vehicle?.marca} ${inquiry.vehicle?.modelo || 'General'}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${data.mensaje}</p>`,
    });

    return inquiry;
  },

  async update(id: string, data: UpdateInquiryInput) {
    return prisma.inquiry.update({
      where: { id },
      data,
    });
  },

  async markAsRead(id: string) {
    return prisma.inquiry.update({
      where: { id },
      data: { leido: true },
    });
  },

  async delete(id: string) {
    return prisma.inquiry.delete({
      where: { id },
    });
  },

  async getStats() {
    const [total, unread] = await Promise.all([
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { leido: false } }),
    ]);
    return { total, unread };
  },
};
