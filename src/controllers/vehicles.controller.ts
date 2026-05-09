import type { FastifyRequest, FastifyReply } from 'fastify';
import { vehiclesService } from '../services/vehicles.service.js';
import { sendSuccess, sendCreated, sendError } from '../utils/response.js';
import { Prisma } from '@prisma/client';

export const vehiclesController = {
  async getAll(req: FastifyRequest, reply: FastifyReply) {
    const {
      marca,
      combustible,
      transmision,
      disponible,
      destacado,
      minPrecio,
      maxPrecio,
      page,
      limit,
    } = req.query as Record<string, string | undefined>;

    const filters = {
      marca,
      combustible,
      transmision,
      disponible: disponible === 'true' ? true : disponible === 'false' ? false : undefined,
      destacado: destacado === 'true' ? true : destacado === 'false' ? false : undefined,
      minPrecio: minPrecio ? Number(minPrecio) : undefined,
      maxPrecio: maxPrecio ? Number(maxPrecio) : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    };

    const result = await vehiclesService.findAll(filters);
    return sendSuccess(reply, result.vehicles, undefined);
  },

  async getBySlug(req: FastifyRequest, reply: FastifyReply) {
    const { slug } = req.params as { slug: string };
    const vehicle = await vehiclesService.findBySlug(slug);
    return sendSuccess(reply, vehicle);
  },

  async getById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const vehicle = await vehiclesService.findById(id);
    return sendSuccess(reply, vehicle);
  },

  async create(req: FastifyRequest, reply: FastifyReply) {
    const data = req.body as Record<string, unknown>;

    try {
      const vehicle = await vehiclesService.create(data as any);
      return sendCreated(reply, vehicle, 'Vehículo creado exitosamente');
    } catch (error: any) {
      if (error.message?.includes('slug')) {
        return sendError(reply, 409, 'Ya existe un vehículo con este slug');
      }
      throw error;
    }
  },

  async update(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const data = req.body as Record<string, unknown>;

    try {
      const vehicle = await vehiclesService.update(id, data as any);
      return sendSuccess(reply, vehicle, 'Vehículo actualizado exitosamente');
    } catch (error: any) {
      if (error.message?.includes('slug')) {
        return sendError(reply, 409, 'Ya existe un vehículo con este slug');
      }
      throw error;
    }
  },

  async delete(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    await vehiclesService.delete(id);
    return reply.status(204).send();
  },

  async getMarcas(req: FastifyRequest, reply: FastifyReply) {
    const marcas = await vehiclesService.getMarcas();
    return sendSuccess(reply, marcas);
  },

  async getFiltros(req: FastifyRequest, reply: FastifyReply) {
    const filtros = await vehiclesService.getFiltros();
    return sendSuccess(reply, filtros);
  },
};