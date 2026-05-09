export interface AppointmentType {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  fecha: Date;
  hora: string;
  vehiculo: string;
  comentarios: string | null;
  confirmado: boolean;
  createdAt: Date;
  updatedAt: Date;
  vehicleId: string | null;
}

export interface CreateAppointmentInput {
  nombre: string;
  email: string;
  telefono: string;
  fecha: Date;
  hora: string;
  vehiculo: string;
  comentarios?: string;
  vehicleId?: string;
}

export interface UpdateAppointmentInput {
  confirmado?: boolean;
}
