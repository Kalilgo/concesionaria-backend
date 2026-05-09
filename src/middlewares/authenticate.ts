import type { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/auth.service.js';

export const authenticate = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return reply.status(401).send({ error: 'No autenticado' });
    }
    const user = await authService.verifyToken(req.server, token);
    req.user = user;
  } catch {
    return reply.status(401).send({ error: 'Token inválido' });
  }
};
