import type { FastifyRequest, FastifyReply } from 'fastify';
import { appointmentsService } from '../services/appointments.service.js';
import { createAppointmentSchema, updateAppointmentSchema } from '../validations/appointment.schema.js';

export const appointmentsController = {
  async getAll(req: FastifyRequest, reply: FastifyReply) {
    const query = req.query as { confirmedOnly?: string };
    const confirmedOnly = query.confirmedOnly === 'true';
    const appointments = await appointmentsService.findAll(confirmedOnly);
    return reply.send({ data: appointments });
  },

  async getById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const appointment = await appointmentsService.findById(id);
    if (!appointment) {
      return reply.status(404).send({ error: 'Turno no encontrado' });
    }
    return reply.send({ data: appointment });
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    const result = createAppointmentSchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ error: result.error.errors });
    }
    const appointment = await appointmentsService.create({
      ...result.data,
      fecha: new Date(result.data.fecha),
    });
    return reply.status(201).send({ data: appointment });
  },

  async update(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const result = updateAppointmentSchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ error: result.error.errors });
    }
    const appointment = await appointmentsService.update(id, result.data);
    if (!appointment) {
      return reply.status(404).send({ error: 'Turno no encontrado' });
    }
    return reply.send({ data: appointment });
  },

  async confirm(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const appointment = await appointmentsService.confirm(id);
    return reply.send({ data: appointment });
  },

  async delete(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    try {
      await appointmentsService.delete(id);
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ error: 'Turno no encontrado' });
    }
  },

  async getStats(req: FastifyRequest, reply: FastifyReply) {
    const stats = await appointmentsService.getStats();
    return reply.send({ data: stats });
  },
};
