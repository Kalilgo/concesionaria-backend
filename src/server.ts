import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import { app } from './app.js';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: env.FRONTEND_URL,
  credentials: true,
});

await fastify.register(cookie);

await fastify.register(jwt, {
  secret: env.JWT_SECRET,
});

fastify.setErrorHandler(errorHandler);

await app(fastify);

const start = async () => {
  try {
    await fastify.listen({ port: Number(env.PORT) });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
