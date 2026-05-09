import type { FastifyRequest, FastifyReply } from 'fastify';
import { vehiclesService } from '../services/vehicles.service.js';
import { createVehicleSchema, updateVehicleSchema, vehicleQuerySchema } from '../validations/vehicle.schema.js';

export const vehiclesController = {
  async getAll(req: FastifyRequest, reply: FastifyReply) {
    const queryResult = vehicleQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
      return reply.status(400).send({ error: queryResult.error.errors });
    }
    const vehicles = await vehiclesService.findAll(queryResult.data);
    return reply.send({ data: vehicles });
  },

  async getBySlug(req: FastifyRequest, reply: FastifyReply) {
    const { slug } = req.params as { slug: string };
    const vehicle = await vehiclesService.findBySlug(slug);
    if (!vehicle) {
      return reply.status(404).send({ error: 'Vehículo no encontrado' });
    }
    return reply.send({ data: vehicle });
  },

  async getById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const vehicle = await vehiclesService.findById(id);
    if (!vehicle) {
      return reply.status(404).send({ error: 'Vehículo no encontrado' });
    }
    return reply.send({ data: vehicle });
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    const result = createVehicleSchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ error: result.error.errors });
    }
    const vehicle = await vehiclesService.create(result.data);
    return reply.status(201).send({ data: vehicle });
  },

  async update(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const result = updateVehicleSchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ error: result.error.errors });
    }
    const vehicle = await vehiclesService.update(id, result.data);
    if (!vehicle) {
      return reply.status(404).send({ error: 'Vehículo no encontrado' });
    }
    return reply.send({ data: vehicle });
  },

  async delete(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    try {
      await vehiclesService.delete(id);
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ error: 'Vehículo no encontrado' });
    }
  },

  async getMarcas(req: FastifyRequest, reply: FastifyReply) {
    const marcas = await vehiclesService.getMarcas();
    return reply.send({ data: marcas });
  },
};
