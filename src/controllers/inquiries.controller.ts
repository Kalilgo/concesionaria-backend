import type { FastifyRequest, FastifyReply } from 'fastify';
import { inquiriesService } from '../services/inquiries.service.js';
import { sendSuccess, sendCreated } from '../utils/response.js';

export const inquiriesController = {
  async getAll(req: FastifyRequest, reply: FastifyReply) {
    const { unreadOnly, page, limit } = req.query as Record<string, string | undefined>;
    const result = await inquiriesService.findAll({
      unreadOnly: unreadOnly === 'true',
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
    return sendSuccess(reply, result);
  },

  async getById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const inquiry = await inquiriesService.findById(id);
    return sendSuccess(reply, inquiry);
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    const data = req.body as Record<string, unknown>;
    const inquiry = await inquiriesService.create(data as any);
    return sendCreated(reply, inquiry, 'Consulta enviada exitosamente');
  },

  async markAsRead(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const inquiry = await inquiriesService.markAsRead(id);
    return sendSuccess(reply, inquiry, 'Consulta marcada como leída');
  },

  async markAllAsRead(req: FastifyRequest, reply: FastifyReply) {
    const count = await inquiriesService.markAllAsRead();
    return sendSuccess(reply, { count }, 'Todas las consultas marcadas como leídas');
  },

  async delete(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    await inquiriesService.delete(id);
    return reply.status(204).send();
  },

  async getStats(req: FastifyRequest, reply: FastifyReply) {
    const stats = await inquiriesService.getStats();
    return sendSuccess(reply, stats);
  },
};