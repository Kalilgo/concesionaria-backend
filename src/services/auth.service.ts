import { prisma } from '../lib/prisma.js';
import type { FastifyInstance } from 'fastify';
import type { AuthPayload } from '../types/index.js';
import { UnauthorizedError, AppError } from '../utils/response.js';

export const authService = {
  async validateAdmin(email: string, password: string): Promise<AuthPayload> {
    const admin = await prisma.admin.findUnique({ where: { email } });
    
    if (!admin) {
      throw new UnauthorizedError('Credenciales inválidas');
    }
    
    const bcrypt = await import('bcrypt');
    const isValid = await bcrypt.compare(password, admin.password);
    
    if (!isValid) {
      throw new UnauthorizedError('Credenciales inválidas');
    }
    
    return { id: admin.id, email: admin.email };
  },

  async createAdmin(email: string, password: string, name: string) {
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
      throw new AppError(409, 'El email ya está registrado', 'EMAIL_EXISTS');
    }

    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 12);
    
    return prisma.admin.create({
      data: { email, password: hashedPassword, name },
    });
  },

  async getAdminById(id: string) {
    const admin = await prisma.admin.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, createdAt: true },
    });
    if (!admin) {
      throw new UnauthorizedError('Usuario no encontrado');
    }
    return admin;
  },

  async updatePassword(id: string, currentPassword: string, newPassword: string) {
    const admin = await prisma.admin.findUnique({ where: { id } });
    if (!admin) {
      throw new UnauthorizedError('Usuario no encontrado');
    }

    const bcrypt = await import('bcrypt');
    const isValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isValid) {
      throw new UnauthorizedError('Contraseña actual incorrecta');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    return prisma.admin.update({
      where: { id },
      data: { password: hashedPassword },
    });
  },

  generateToken(fastify: FastifyInstance, payload: AuthPayload) {
    return fastify.jwt.sign(payload);
  },

  verifyToken(fastify: FastifyInstance, token: string) {
    try {
      return fastify.jwt.verify<AuthPayload>(token);
    } catch {
      throw new UnauthorizedError('Token inválido o expirado');
    }
  },
};