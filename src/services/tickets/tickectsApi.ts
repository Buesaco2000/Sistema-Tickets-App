import { NotasCredito, NotasCreditoPayload } from "../../types/notasCredito";
import { SoporteOPayload, SoporteOtros } from "../../types/soporteOtros";
import {
  SoportePayload,
  SoportePlataforma,
} from "../../types/soportePlataforma";
import {
  Soporte,
  TotalesEstadoResponse,
  TotalesTickets,
} from "../../types/tickets";
import api from "../api";

// OBTENER DATOS DE TICKETS

export const getTickets = async (options?: {
  signal?: AbortSignal;
}): Promise<Soporte[]> => {
  const res = await api.get<{ success: boolean; data: Soporte[] }>(
    "/tickets/mis-tickets",
    {
      signal: options?.signal,
    }
  );
  return res.data.data;
};

export const getTotalesTicket = async (): Promise<TotalesTickets[]> => {
  const res = await api.get<TotalesTickets[]>("/tickets");
  return res.data;
};

export const getTicketEstado = async (): Promise<TotalesEstadoResponse> => {
  const res = await api.get<TotalesEstadoResponse>("/tickets/total");
  return res.data;
};

export const getTicketsEstado = async (): Promise<Soporte[]> => {
  const res = await api.get<Soporte[]>("/tickets/estado");
  return res.data;
};

export const getTicketsOS = async (): Promise<SoporteOtros[]> => {
  const res = await api.get<SoporteOtros[]>("/otroS/soporte");
  return res.data;
};

export const getTicketsSP = async (): Promise<SoportePlataforma[]> => {
  const res = await api.get<SoportePlataforma[]>("/rfast/soporte");
  return res.data;
};

export const getTicketsNC = async (): Promise<NotasCredito[]> => {
  const res = await api.get<NotasCredito[]>("/notasC/soporte");
  return res.data;
};

// CREAR DATOS DE TICKETS

export const createSoporteTicket = async (payload: SoportePayload) => {
  const formData = new FormData();

  formData.append("descripcion", payload.descripcion);
  formData.append("tipo_soporte_id", payload.tipoSoporteId.toString());

  if (payload.imagen) {
    formData.append("imagen", payload.imagen);
  }

  const res = await api.post("/rfast", formData);
  return res.data;
};

export const createSoporteNCTicket = async (payload: NotasCreditoPayload) => {
  const body = {
    fecha_facturacion: payload.fecha_facturacion,
    factura_anular: payload.factura_anular,
    factura_copago_anular: payload.factura_copago_anular,
    valor_copago_anulado: payload.valor_copago_anulado,
    factura_refacturar: payload.factura_refacturar,
    motivo: payload.motivo,
    tipo_soporte_id: payload.tipoSoporteId,
  };

  const res = await api.post("/notasC", body);
  return res.data;
};

export const createSoporteOTicket = async (payload: SoporteOPayload) => {
  const formData = new FormData();

  formData.append("descripcion", payload.descripcion);
  formData.append("tipo_soporte_id", payload.tipoSoporteId.toString());

  if (payload.imagen) {
    formData.append("imagen", payload.imagen);
  }

  const res = await api.post("/otroS", formData);
  return res.data;
};

//ACTUALIZAR DATOS DEL TICKETS

export const updateTicketEstado = async (id: number, estado: string) => {
  const res = await api.put(`/tickets/${id}/estado`, { estado });
  return res.data;
};

export const updateTicket = async (id: string, payload: any) => {
  const res = await api.put(`/tickets/${id}`, payload);
  return res.data;
};

export const deleteTicket = async (id: string) => {
  const res = await api.delete(`/tickets/${id}`);
  return res.data;
};
