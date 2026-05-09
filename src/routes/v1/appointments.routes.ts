import type { FastifyInstance } from 'fastify';
import { appointmentsController } from '../../controllers/appointments.controller.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';

export const appointmentsRoutes = async (app: FastifyInstance) => {
  app.get('/appointments', appointmentsController.getAll);
  app.get('/appointments/stats', { preHandler: [authenticate] }, appointmentsController.getStats);
  app.get('/appointments/:id', appointmentsController.getById);
  
  app.post('/appointments', appointmentsController.create);
  app.put('/appointments/:id', { preHandler: [authenticate] }, appointmentsController.update);
  app.patch('/appointments/:id/confirm', { preHandler: [authenticate] }, appointmentsController.confirm);
  app.delete('/appointments/:id', { preHandler: [authenticate, authorize] }, appointmentsController.delete);
};
