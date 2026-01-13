import api from "../api";

export const getRoles = async () => {
  try {
    const { data } = await api.get("cargos/rol");
    return { ok: true, roles: data.roles };
  } catch (error: any) {
    return {
      ok: false,
      error: error.response?.data?.message || "Error al obtener roles",
    };
  }
};
