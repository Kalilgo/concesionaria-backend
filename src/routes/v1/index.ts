import type { FastifyInstance } from 'fastify';
import { vehiclesRoutes } from './vehicles.routes.js';
import { inquiriesRoutes } from './inquiries.routes.js';
import { appointmentsRoutes } from './appointments.routes.js';
import { authRoutes } from './auth.routes.js';

export const v1Routes = async (app: FastifyInstance) => {
  await app.register(vehiclesRoutes, { prefix: '' });
  await app.register(inquiriesRoutes, { prefix: '' });
  await app.register(appointmentsRoutes, { prefix: '' });
  await app.register(authRoutes, { prefix: '' });
};
