import { prisma } from '../lib/prisma.js';
import { CreateVehicleInput, UpdateVehicleInput } from '../types/index.js';

export const vehiclesService = {
  async findAll(filters?: Record<string, unknown>) {
    const where: Record<string, unknown> = {};
    
    if (filters?.marca) where.marca = filters.marca;
    if (filters?.combustible) where.combustible = filters.combustible;
    if (filters?.transmision) where.transmision = filters.transmision;
    if (filters?.disponible !== undefined) where.disponible = filters.disponible;
    if (filters?.destacado !== undefined) where.destacado = filters.destacado;
    if (filters?.minPrecio || filters?.maxPrecio) {
      where.precio = {};
      if (filters?.minPrecio) (where.precio as Record<string, unknown>).gte = filters.minPrecio;
      if (filters?.maxPrecio) (where.precio as Record<string, unknown>).lte = filters.maxPrecio;
    }

    return prisma.vehicle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  },

  async findBySlug(slug: string) {
    return prisma.vehicle.findUnique({
      where: { slug },
    });
  },

  async findById(id: string) {
    return prisma.vehicle.findUnique({
      where: { id },
    });
  },

  async create(data: CreateVehicleInput) {
    return prisma.vehicle.create({
      data: {
        ...data,
        imagenes: JSON.stringify(data.imagenes || []),
      },
    });
  },

  async update(id: string, data: UpdateVehicleInput) {
    const updateData: Record<string, unknown> = { ...data };
    if (data.imagenes) {
      updateData.imagenes = JSON.stringify(data.imagenes);
    }
    return prisma.vehicle.update({
      where: { id },
      data: updateData,
    });
  },

  async delete(id: string) {
    return prisma.vehicle.delete({
      where: { id },
    });
  },

  async getMarcas() {
    const vehicles = await prisma.vehicle.findMany({
      select: { marca: true },
      distinct: ['marca'],
    });
    return vehicles.map((v) => v.marca);
  },
};
