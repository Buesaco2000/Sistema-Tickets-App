import api from "../api";

export const getMunicipios = async () => {
  try {
    const { data } = await api.get("/municipios");
    return { ok: true, municipios: data.municipios };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    return { ok: false, error: message };
  }
};
