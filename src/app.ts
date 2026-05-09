import type { FastifyInstance } from 'fastify';
import { v1Routes } from './routes/v1/index.js';

export const app = async (fastify: FastifyInstance) => {
  fastify.get('/health', async () => ({ status: 'ok' }));
  await fastify.register(v1Routes, { prefix: '/api/v1' });
};
