export interface Soporte {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  tipo_error: string;
  estado: EstadoTicket;
  tipo: string;
  ingeniero_id: number;
  imagen_url: string | null;
}

export type TipoSoporte = "PLATAFORMA" | "NOTA_CREDITO" | "OTRO" | null;

export interface TotalesTickets {
  tipo_soporte: TipoSoporte;
  total_soportes: number;
}

export type EstadoTicket = "abierto" | "en_proceso" | "resuelto";

export interface EstadoTotal {
  estado: EstadoTicket;
  total: number;
}

export interface TotalesEstadoResponse {
  estados: EstadoTotal[];
  total_general: number;
}
