import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { getPerfilApi, updatePerfilApi } from "../services/auth/authApi";

interface UpdatePerfilPayload {
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
}

interface PerfilResult {
  success: boolean;
  message: string;
}

export const usePerfil = () => {
  const { user, setAuth } = useAuth();
  const [loading, setLoading] = useState(true);

  const loadPerfil = useCallback(async () => {
    if (!user) return;

    try {
      const response = await getPerfilApi(user.id);
      if (response.data) {
        setAuth(response.data);
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, setAuth]);

  const updatePerfil = async (values: UpdatePerfilPayload): Promise<PerfilResult> => {
    if (!user) {
      return { success: false, message: "Usuario no autenticado" };
    }

    try {
      const response = await updatePerfilApi(user.id, values);

      if (response.success && response.data) {
        setAuth(response.data);
        return { success: true, message: "Perfil actualizado correctamente" };
      }

      return { success: false, message: response.message || "Error al actualizar" };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error actualizando perfil";
      console.error("Error actualizando perfil", error);
      return { success: false, message: errorMessage };
    }
  };

  useEffect(() => {
    loadPerfil();
  }, [loadPerfil]);

  return {
    user,
    loading,
    updatePerfil,
  };
};
