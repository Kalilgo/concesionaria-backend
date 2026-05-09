import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export const errorHandler = (
  error: FastifyError,
  req: FastifyRequest,
  reply: FastifyReply
) => {
  req.log.error(error);
  
  if (error.statusCode) {
    return reply.status(error.statusCode).send({
      error: error.message,
    });
  }
  
  return reply.status(500).send({
    error: 'Error interno del servidor',
  });
};
