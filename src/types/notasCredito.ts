export interface NotasCredito {
  id: number;
  nombresIng: string;
  apellidosIng: string;
  motivo: string;
  centro_atencion: string;
  tipo_error: string;
  estado: "abierto" | "en_proceso" | "resuelto" | "cerrado";
  valor_copago_anulado: string | null;
}

export interface NotasCreditoPayload {
  fecha_facturacion: string;
  factura_anular: string;
  factura_copago_anular: string;
  centro_atencion?: string;
  factura_refacturar: string;
  nombre_facturador?: string;
  motivo: string;
  valor_copago_anulado: string;
  tipoSoporteId: number;
}
