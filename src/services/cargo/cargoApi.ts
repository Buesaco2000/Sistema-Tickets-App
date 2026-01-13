import api from "../api";

export const getCargos = async () => {
  try {
    const { data } = await api.get("/cargos");
    return {
      ok: true,
      cargos: data.cargos,
    };
  } catch (error: any) {
    return {
      ok: false,
      error: error.response?.data?.message || "Error al obtener cargos",
    };
  }
};
