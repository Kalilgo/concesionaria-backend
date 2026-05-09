import type { FastifyInstance } from 'fastify';
import { inquiriesController } from '../../controllers/inquiries.controller.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';

export const inquiriesRoutes = async (app: FastifyInstance) => {
  app.get('/inquiries', inquiriesController.getAll);
  app.get('/inquiries/stats', { preHandler: [authenticate] }, inquiriesController.getStats);
  app.get('/inquiries/:id', inquiriesController.getById);
  
  app.post('/inquiries', inquiriesController.create);
  app.put('/inquiries/:id', { preHandler: [authenticate] }, inquiriesController.update);
  app.patch('/inquiries/:id/read', { preHandler: [authenticate] }, inquiriesController.markAsRead);
  app.delete('/inquiries/:id', { preHandler: [authenticate, authorize] }, inquiriesController.delete);
};
