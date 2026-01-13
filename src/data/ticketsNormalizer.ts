import { TotalesEstadoResponse, TotalesTickets } from "../types/tickets";

export const normalizeTotalesPorSoporte = (data: TotalesTickets[]) => {
  return data.reduce(
    (acc, item) => {
      switch (item.tipo_soporte) {
        case "PLATAFORMA":
          acc.rFast += item.total_soportes;
          break;
        case "NOTA_CREDITO":
          acc.notasCredito += item.total_soportes;
          break;
        case "OTRO":
          acc.otros += item.total_soportes;
          break;
      }
      return acc;
    },
    { rFast: 0, notasCredito: 0, otros: 0 }
  );
};

export const normalizeEstados = (data: TotalesEstadoResponse) => {
  const estados = {
    abierto: 0,
    en_proceso: 0,
    resuelto: 0,
  };

  data.estados.forEach((e) => {
    estados[e.estado] = e.total;
  });

  return {
    ...estados,
    totalGeneral: estados.abierto + estados.en_proceso + estados.resuelto,
  };
};
