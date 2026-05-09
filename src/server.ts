import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import { app } from './app.js';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { prisma } from './lib/prisma.js';

const fastify = Fastify({
  logger: {
    level: env.NODE_ENV === 'production' ? 'warn' : 'info',
    transport: env.NODE_ENV !== 'production' ? {
      target: 'pino-pretty',
      options: { colorize: true },
    } : undefined,
  },
  trustProxy: true,
});

await fastify.register(cors, {
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

await fastify.register(cookie, {
  secret: env.JWT_SECRET,
  parseOptions: {},
});

await fastify.register(jwt, {
  secret: env.JWT_SECRET,
  sign: { expiresIn: env.JWT_EXPIRES_IN },
  verify: { algorithms: ['HS256'] },
});

fastify.setErrorHandler(errorHandler);

await app(fastify);

const shutdown = async (signal: string) => {
  fastify.log.info(`Recibido ${signal}, cerrando servidor...`);
  
  await fastify.close();
  await prisma.$disconnect();
  
  fastify.log.info('Servidor cerrado');
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

const start = async () => {
  try {
    await fastify.listen({ 
      port: Number(env.PORT), 
      host: '0.0.0.0',
    });
    fastify.log.info(`Servidor corriendo en http://localhost:${env.PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();