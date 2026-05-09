export interface InquiryType {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  vehicleId: string | null;
  leido: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInquiryInput {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  vehicleId?: string;
}

export interface UpdateInquiryInput {
  leido?: boolean;
}
