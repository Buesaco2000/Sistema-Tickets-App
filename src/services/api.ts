import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Evento custom para logout forzado
export const FORCE_LOGOUT_EVENT = "force-logout";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Envía cookies HttpOnly automáticamente
});

// Rutas que NO deben redirigir a login en caso de 401
const authRoutes = ["/usuarios/login", "/usuarios/register"];

// Interceptor para capturar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || "";
    const isAuthRoute = authRoutes.some((route) => requestUrl.includes(route));

    // Si es 401 y NO es una ruta de autenticación - redirigir a login
    if (error.response?.status === 401 && !isAuthRoute) {
      sessionStorage.removeItem("user");
      window.dispatchEvent(new CustomEvent(FORCE_LOGOUT_EVENT));
    }

    return Promise.reject(error);
  }
);

export default api;
