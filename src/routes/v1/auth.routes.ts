import type { FastifyInstance } from 'fastify';
import { authController } from '../../controllers/auth.controller.js';
import { authenticate } from '../../middlewares/authenticate.js';

export const authRoutes = async (app: FastifyInstance) => {
  app.post('/auth/login', {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '1 minute',
        errorResponseBuilder: () => ({
          success: false,
          error: 'Demasiados intentos. Intenta en 1 minuto.',
        }),
      },
    },
  }, authController.login);

  app.post('/auth/register', authController.register);
  app.post('/auth/logout', authController.logout);
  app.get('/auth/me', { preHandler: [authenticate] }, authController.me);
  app.post('/auth/refresh', { preHandler: [authenticate] }, authController.refreshToken);
};