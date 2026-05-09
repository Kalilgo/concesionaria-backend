import type { FastifyRequest, FastifyReply } from 'fastify';

export const authorize = async (req: FastifyRequest, reply: FastifyReply) => {
  if (!req.user) {
    return reply.status(401).send({ error: 'No autenticado' });
  }
};
