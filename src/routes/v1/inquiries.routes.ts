import type { FastifyInstance } from 'fastify';
import { inquiriesController } from '../../controllers/inquiries.controller.js';
import { authenticate } from '../../middlewares/authenticate.js';

export const inquiriesRoutes = async (app: FastifyInstance) => {
  app.get('/inquiries', inquiriesController.getAll);
  app.get('/inquiries/stats', { preHandler: [authenticate] }, inquiriesController.getStats);
  app.get('/inquiries/:id', inquiriesController.getById);
  
  app.post('/inquiries', {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: '1 minute',
        errorResponseBuilder: () => ({
          success: false,
          error: 'Demasiadas consultas. Intenta más tarde.',
        }),
      },
    },
  }, inquiriesController.create);

  app.patch('/inquiries/:id/read', { preHandler: [authenticate] }, inquiriesController.markAsRead);
  app.patch('/inquiries/read-all', { preHandler: [authenticate] }, inquiriesController.markAllAsRead);
  app.delete('/inquiries/:id', { preHandler: [authenticate] }, inquiriesController.delete);
};