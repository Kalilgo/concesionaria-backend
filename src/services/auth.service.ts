import { prisma } from '../lib/prisma.js';
import type { FastifyInstance } from 'fastify';
import type { AuthPayload } from '../types/index.js';

export const authService = {
  async validateAdmin(email: string, password: string) {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return null;
    
    const bcrypt = await import('bcrypt');
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) return null;
    
    return { id: admin.id, email: admin.email };
  },

  async createAdmin(email: string, password: string, name: string) {
    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    return prisma.admin.create({
      data: { email, password: hashedPassword, name },
    });
  },

  generateToken(fastify: FastifyInstance, payload: AuthPayload) {
    return fastify.jwt.sign(payload);
  },

  verifyToken(fastify: FastifyInstance, token: string) {
    return fastify.jwt.verify<AuthPayload>(token);
  },
};
