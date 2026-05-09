import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../utils/response.js';
import { ZodError } from 'zod';

export const errorHandler = (
  error: FastifyError,
  req: FastifyRequest,
  reply: FastifyReply
) => {
  req.log.error({
    err: error,
    url: req.url,
    method: req.method,
  });

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      error: error.message,
      code: error.code,
    });
  }

  if (error instanceof ZodError) {
    const errors = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    return reply.status(400).send({
      success: false,
      error: 'Error de validación',
      errors,
    });
  }

  if (error.statusCode === 401) {
    return reply.status(401).send({
      success: false,
      error: 'No autenticado',
      code: 'UNAUTHORIZED',
    });
  }

  if (error.statusCode === 404) {
    return reply.status(404).send({
      success: false,
      error: 'Recurso no encontrado',
      code: 'NOT_FOUND',
    });
  }

  const isProduction = process.env.NODE_ENV === 'production';

  return reply.status(500).send({
    success: false,
    error: isProduction ? 'Error interno del servidor' : error.message,
    code: 'INTERNAL_ERROR',
  });
};