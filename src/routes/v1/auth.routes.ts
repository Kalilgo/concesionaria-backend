import type { FastifyInstance } from 'fastify';
import { authController } from '../../controllers/auth.controller.js';
import { authenticate } from '../../middlewares/authenticate.js';

export const authRoutes = async (app: FastifyInstance) => {
  app.post('/auth/login', authController.login);
  app.post('/auth/register', authController.register);
  app.post('/auth/logout', authController.logout);
  app.get('/auth/me', { preHandler: [authenticate] }, authController.me);
};
