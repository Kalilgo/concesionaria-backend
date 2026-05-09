import { prisma } from '../lib/prisma.js';
import { CreateVehicleInput, UpdateVehicleInput } from '../types/index.js';
import { NotFoundError } from '../utils/response.js';

export const vehiclesService = {
  async findAll(filters?: {
    marca?: string;
    combustible?: string;
    transmision?: string;
    disponible?: boolean;
    destacado?: boolean;
    minPrecio?: number;
    maxPrecio?: number;
    page?: number;
    limit?: number;
  }) {
    const { page = 1, limit = 20, ...restFilters } = filters || {};
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    
    if (restFilters.marca) where.marca = restFilters.marca;
    if (restFilters.combustible) where.combustible = restFilters.combustible;
    if (restFilters.transmision) where.transmision = restFilters.transmision;
    if (restFilters.disponible !== undefined) where.disponible = restFilters.disponible;
    if (restFilters.destacado !== undefined) where.destacado = restFilters.destacado;
    if (restFilters.minPrecio || restFilters.maxPrecio) {
      where.precio = {};
      if (restFilters.minPrecio) (where.precio as Record<string, unknown>).gte = restFilters.minPrecio;
      if (restFilters.maxPrecio) (where.precio as Record<string, unknown>).lte = restFilters.maxPrecio;
    }

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.vehicle.count({ where }),
    ]);

    return {
      vehicles,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  },

  async findBySlug(slug: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { slug },
      include: { 
        inquiries: { take: 5, orderBy: { createdAt: 'desc' } },
        appointments: { take: 5, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!vehicle) throw new NotFoundError('Vehículo');
    return vehicle;
  },

  async findById(id: string) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) throw new NotFoundError('Vehículo');
    return vehicle;
  },

  async create(data: CreateVehicleInput) {
    const existingSlug = await prisma.vehicle.findUnique({ where: { slug: data.slug } });
    if (existingSlug) {
      throw new Error('Ya existe un vehículo con este slug');
    }

    return prisma.vehicle.create({
      data: {
        ...data,
        imagenes: JSON.stringify(data.imagenes || []),
      },
    });
  },

  async update(id: string, data: UpdateVehicleInput) {
    const existing = await prisma.vehicle.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Vehículo');

    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await prisma.vehicle.findFirst({
        where: { slug: data.slug, NOT: { id } },
      });
      if (slugExists) throw new Error('Ya existe un vehículo con este slug');
    }

    const updateData: Record<string, unknown> = { ...data };
    if (data.imagenes) {
      updateData.imagenes = JSON.stringify(data.imagenes);
    }
    updateData.updatedAt = new Date();

    return prisma.vehicle.update({
      where: { id },
      data: updateData,
    });
  },

  async delete(id: string) {
    const existing = await prisma.vehicle.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Vehículo');

    return prisma.vehicle.delete({ where: { id } });
  },

  async getMarcas() {
    const vehicles = await prisma.vehicle.findMany({
      select: { marca: true },
      distinct: ['marca'],
      orderBy: { marca: 'asc' },
    });
    return vehicles.map((v) => v.marca);
  },

  async getFiltros() {
    const [marcas, combustibles, transmisiones] = await Promise.all([
      this.getMarcas(),
      prisma.vehicle.findMany({ 
        select: { combustible: true }, 
        distinct: ['combustible'],
        orderBy: { combustible: 'asc' },
      }),
      prisma.vehicle.findMany({ 
        select: { transmision: true }, 
        distinct: ['transmision'],
        orderBy: { transmision: 'asc' },
      }),
    ]);

    return {
      marcas,
      combustibles: combustibles.map((c) => c.combustible),
      transmisiones: transmisiones.map((t) => t.transmision),
    };
  },
};