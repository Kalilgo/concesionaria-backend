import type { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/auth.service.js';
import { z } from 'zod';
import { env } from '../config/env.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export const authController = {
  async login(req: FastifyRequest, reply: FastifyReply) {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ error: result.error.errors });
    }

    const admin = await authService.validateAdmin(result.data.email, result.data.password);
    if (!admin) {
      return reply.status(401).send({ error: 'Credenciales inválidas' });
    }

    const token = authService.generateToken(reply.server, admin);
    
    reply.setCookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return reply.send({ data: { id: admin.id, email: admin.email } });
  },

  async register(req: FastifyRequest, reply: FastifyReply) {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ error: result.error.errors });
    }

    const admin = await authService.createAdmin(
      result.data.email,
      result.data.password,
      result.data.name
    );

    return reply.status(201).send({ data: { id: admin.id, email: admin.email } });
  },

  async logout(req: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie('token', { path: '/' });
    return reply.send({ message: 'Sesión cerrada' });
  },

  async me(req: FastifyRequest, reply: FastifyReply) {
    return reply.send({ data: req.user });
  },
};
