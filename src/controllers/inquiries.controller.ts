import type { FastifyRequest, FastifyReply } from 'fastify';
import { inquiriesService } from '../services/inquiries.service.js';
import { createInquirySchema, updateInquirySchema } from '../validations/inquiry.schema.js';

export const inquiriesController = {
  async getAll(req: FastifyRequest, reply: FastifyReply) {
    const query = req.query as { unreadOnly?: string };
    const unreadOnly = query.unreadOnly === 'true';
    const inquiries = await inquiriesService.findAll(unreadOnly);
    return reply.send({ data: inquiries });
  },

  async getById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const inquiry = await inquiriesService.findById(id);
    if (!inquiry) {
      return reply.status(404).send({ error: 'Consulta no encontrada' });
    }
    return reply.send({ data: inquiry });
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    const result = createInquirySchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ error: result.error.errors });
    }
    const inquiry = await inquiriesService.create(result.data);
    return reply.status(201).send({ data: inquiry });
  },

  async update(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const result = updateInquirySchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ error: result.error.errors });
    }
    const inquiry = await inquiriesService.update(id, result.data);
    if (!inquiry) {
      return reply.status(404).send({ error: 'Consulta no encontrada' });
    }
    return reply.send({ data: inquiry });
  },

  async markAsRead(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const inquiry = await inquiriesService.markAsRead(id);
    return reply.send({ data: inquiry });
  },

  async delete(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    try {
      await inquiriesService.delete(id);
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ error: 'Consulta no encontrada' });
    }
  },

  async getStats(req: FastifyRequest, reply: FastifyReply) {
    const stats = await inquiriesService.getStats();
    return reply.send({ data: stats });
  },
};
