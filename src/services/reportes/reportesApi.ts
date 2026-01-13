import api from "../api";

export interface TicketReporte {
  id: number;
  fecha_creacion: string;
  estado: string;
  tipo_soporte: string;
  usuario_nombres: string;
  usuario_apellidos: string;
  usuario_email: string;
  usuario_telefono: string;
  ingeniero_nombres: string;
  ingeniero_apellidos: string;
  ingeniero_email: string;
  municipio: string;
  descripcion: string;
  imagen: string;
  fecha_facturacion?: string;
  factura_anular?: string;
  factura_copago_anular?: string;
  valor_copago_anulado?: number;
  factura_refacturar?: string;
}

export interface ResumenMensual {
  mes: number;
  nombre_mes: string;
  total_tickets: number;
  abiertos: number;
  en_proceso: number;
  resueltos: number;
}

export interface HistoricoReporte {
  anio: number;
  mes: number;
  nombre_mes: string;
  total_tickets: number;
  abiertos: number;
  en_proceso: number;
  resueltos: number;
  rfast: number;
  notas_credito: number;
  otros_soportes: number;
}

export type PeriodoReporte = "semana" | "mes" | "anio" | "rango" | "todos";

// Tipos de soporte: 1 = Otros Soportes, 2 = R-FAST, 3 = Nota de Credito
export type TipoSoporteReporte = "todos" | "1" | "2" | "3";

interface ReporteTicketsParams {
  periodo: PeriodoReporte;
  fecha_inicio?: string;
  fecha_fin?: string;
  tipo_soporte_id?: TipoSoporteReporte;
}

export const getReporteTickets = async (
  params: ReporteTicketsParams
): Promise<TicketReporte[]> => {
  const queryParams = new URLSearchParams();
  queryParams.append("periodo", params.periodo);
  if (params.fecha_inicio) queryParams.append("fecha_inicio", params.fecha_inicio);
  if (params.fecha_fin) queryParams.append("fecha_fin", params.fecha_fin);
  if (params.tipo_soporte_id) queryParams.append("tipo_soporte_id", params.tipo_soporte_id);

  const res = await api.get<{ success: boolean; data: TicketReporte[]; total: number }>(
    `/reportes/tickets?${queryParams.toString()}`
  );
  return res.data.data;
};

export const getResumenMensual = async (
  anio?: number
): Promise<ResumenMensual[]> => {
  const queryParams = anio ? `?anio=${anio}` : "";
  const res = await api.get<{ success: boolean; data: ResumenMensual[] }>(
    `/reportes/resumen-mensual${queryParams}`
  );
  return res.data.data;
};

export const getHistoricoReportes = async (): Promise<HistoricoReporte[]> => {
  const res = await api.get<{ success: boolean; data: HistoricoReporte[] }>(
    "/reportes/historico"
  );
  return res.data.data;
};
