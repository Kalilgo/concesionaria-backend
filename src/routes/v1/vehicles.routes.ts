import type { FastifyInstance } from 'fastify';
import { vehiclesController } from '../../controllers/vehicles.controller.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';

export const vehiclesRoutes = async (app: FastifyInstance) => {
  app.get('/vehicles', vehiclesController.getAll);
  app.get('/vehicles/marcas', vehiclesController.getMarcas);
  app.get('/vehicles/slug/:slug', vehiclesController.getBySlug);
  app.get('/vehicles/:id', vehiclesController.getById);

  app.post('/vehicles', { preHandler: [authenticate, authorize] }, vehiclesController.create);
  app.put('/vehicles/:id', { preHandler: [authenticate, authorize] }, vehiclesController.update);
  app.delete('/vehicles/:id', { preHandler: [authenticate, authorize] }, vehiclesController.delete);
};
