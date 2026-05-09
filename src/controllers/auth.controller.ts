import type { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/auth.service.js';
import { env } from '../config/env.js';
import { sendSuccess, sendCreated, sendError } from '../utils/response.js';

const loginSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 1 },
  },
};

const registerSchema = {
  type: 'object',
  required: ['email', 'password', 'name'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
    name: { type: 'string', minLength: 1 },
  },
};

export const authController = {
  async login(req: FastifyRequest, reply: FastifyReply) {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      return sendError(reply, 400, 'Email y contraseña son requeridos');
    }

    const admin = await authService.validateAdmin(email, password);
    const token = authService.generateToken(reply.server, admin);
    
    reply.setCookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return sendSuccess(reply, { id: admin.id, email: admin.email }, 'Login exitoso');
  },

  async register(req: FastifyRequest, reply: FastifyReply) {
    const { email, password, name } = req.body as { email: string; password: string; name: string };

    if (!email || !password || !name) {
      return sendError(reply, 400, 'Todos los campos son requeridos');
    }

    if (password.length < 6) {
      return sendError(reply, 400, 'La contraseña debe tener al menos 6 caracteres');
    }

    const admin = await authService.createAdmin(email, password, name);

    return sendCreated(reply, { id: admin.id, email: admin.email }, 'Admin creado exitosamente');
  },

  async logout(req: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie('token', { path: '/' });
    return sendSuccess(reply, null, 'Sesión cerrada');
  },

  async me(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user as { id: string; email: string };
    const admin = await authService.getAdminById(user.id);
    return sendSuccess(reply, admin);
  },

  async refreshToken(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user as { id: string; email: string };
    const token = authService.generateToken(reply.server, { id: user.id, email: user.email });
    
    reply.setCookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return sendSuccess(reply, { token }, 'Token renovado');
  },
};