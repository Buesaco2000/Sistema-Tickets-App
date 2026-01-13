import { EstadoTicket } from "./tickets";

export interface SoportePlataforma {
  id: number;
  nombresIng: string;
  apellidosIng: string;
  municipio: string;
  ingeniero: string;
  tipo_error: string;
  estado: EstadoTicket;
  imagen_url: string | null;
}

export interface SoportePayload {
  descripcion: string;
  tipoSoporteId: number;
  imagen?: File | null;
}
