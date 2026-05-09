import type { FastifyRequest, FastifyReply } from 'fastify';
import { appointmentsService } from '../services/appointments.service.js';
import { sendSuccess, sendCreated } from '../utils/response.js';

export const appointmentsController = {
  async getAll(req: FastifyRequest, reply: FastifyReply) {
    const { confirmedOnly, page, limit } = req.query as Record<string, string | undefined>;
    const result = await appointmentsService.findAll({
      confirmedOnly: confirmedOnly === 'true',
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
    return sendSuccess(reply, result);
  },

  async getById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const appointment = await appointmentsService.findById(id);
    return sendSuccess(reply, appointment);
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    const data = req.body as Record<string, unknown>;

    try {
      const appointment = await appointmentsService.create(data as any);
      return sendCreated(reply, appointment, 'Turno solicitado exitosamente');
    } catch (error: any) {
      if (error.message?.includes('horario')) {
        return reply.status(409).send({ success: false, error: error.message });
      }
      throw error;
    }
  },

  async confirm(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const appointment = await appointmentsService.confirm(id);
    return sendSuccess(reply, appointment, 'Turno confirmado');
  },

  async cancel(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const appointment = await appointmentsService.cancel(id);
    return sendSuccess(reply, appointment, 'Turno cancelado');
  },

  async delete(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    await appointmentsService.delete(id);
    return reply.status(204).send();
  },

  async getStats(req: FastifyRequest, reply: FastifyReply) {
    const stats = await appointmentsService.getStats();
    return sendSuccess(reply, stats);
  },

  async getUpcoming(req: FastifyRequest, reply: FastifyReply) {
    const { limit } = req.query as { limit?: string };
    const upcoming = await appointmentsService.getUpcoming(limit ? Number(limit) : 5);
    return sendSuccess(reply, upcoming);
  },
};