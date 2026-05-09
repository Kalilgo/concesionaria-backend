import type { FastifyInstance } from 'fastify';
import { appointmentsController } from '../../controllers/appointments.controller.js';
import { authenticate } from '../../middlewares/authenticate.js';

export const appointmentsRoutes = async (app: FastifyInstance) => {
  app.get('/appointments', appointmentsController.getAll);
  app.get('/appointments/stats', { preHandler: [authenticate] }, appointmentsController.getStats);
  app.get('/appointments/upcoming', { preHandler: [authenticate] }, appointmentsController.getUpcoming);
  app.get('/appointments/:id', appointmentsController.getById);
  
  app.post('/appointments', appointmentsController.create);
  app.patch('/appointments/:id/confirm', { preHandler: [authenticate] }, appointmentsController.confirm);
  app.patch('/appointments/:id/cancel', { preHandler: [authenticate] }, appointmentsController.cancel);
  app.delete('/appointments/:id', { preHandler: [authenticate] }, appointmentsController.delete);
};