import { RegisterPayload, User } from "../../types/User";
import api from "../api";
import { ApiResponse } from "../../services/auth/authServices";

export const registerApi = async (payload: RegisterPayload) => {
  const body = {
    nombres: payload.nombres,
    apellidos: payload.apellidos,
    email: payload.email,
    telefono: payload.telefono,
    cargo_id: Number(payload.cargoId),
    municipio_id: Number(payload.municipioId),
    password: payload.password,
  };
  const res = await api.post("/usuarios/register", body);
  return res.data;
};

export const loginApi = async (email: string, password: string) => {
  const res = await api.post("/usuarios/login", { email, password });
  return res.data;
};

export const recoverPasswordRequest = async (email: string) => {
  try {
    const { data } = await api.post("/usuarios/recover-password", { email });
    return { ok: true, message: data.message };
  } catch (error: any) {
    return {
      ok: false,
      error: error.response?.data?.message || "Error al enviar el correo",
    };
  }
};

// Obtener perfil con token (GET /usuarios/perfil)
export const getPerfilApi = async (id: number) => {
  const res = await api.get(`/usuarios/${id}`);
  return res.data;
};

export const getUsuariosApi = async (): Promise<User[]> => {
  const res = await api.get<ApiResponse<User[]>>("/usuarios");
  return res.data.data ?? [];
};

// Actualizar perfil (PUT /usuarios/:id)
export const updatePerfilApi = async (id: number, payload: Partial<User>) => {
  const res = await api.put(`/usuarios/${id}`, payload);
  return res.data;
};

export const updateUsuarioEstado = async (id: number, activo: boolean) => {
  const res = await api.put(`/usuarios/${id}/estado`, { activo });
  return res.data;
};
