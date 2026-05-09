export interface ApiResponse<T> {
  data?: T;
  error?: string | string[];
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} no encontrado`, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(errors: string[]) {
    super(400, 'Error de validación', 'VALIDATION_ERROR');
    this.errors = errors;
  }
  errors?: string[];
}

export class UnauthorizedError extends AppError {
  constructor(message = 'No autenticado') {
    super(401, message, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor() {
    super(403, 'Acceso denegado', 'FORBIDDEN');
  }
}

export function sendSuccess<T>(reply: any, data: T, message?: string) {
  return reply.send({
    success: true,
    data,
    message,
  });
}

export function sendCreated<T>(reply: any, data: T, message = 'Recurso creado exitosamente') {
  return reply.status(201).send({
    success: true,
    data,
    message,
  });
}

export function sendNoContent(reply: any) {
  return reply.status(204).send();
}

export function sendError(reply: any, statusCode: number, message: string, errors?: string[]) {
  return reply.status(statusCode).send({
    success: false,
    error: message,
    errors,
  });
}