import { createContext, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { FORCE_LOGOUT_EVENT } from "../services/api";
import { User } from "../types/User";

type AuthContextType = {
  user: User | null;
  loadingAuth: boolean;
  setAuth: (u: User | null) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loadingAuth: true,
  setAuth: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const navigate = useNavigate();

  // Escuchar logout forzado
  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
      navigate("/auth/login");
    };
    window.addEventListener(FORCE_LOGOUT_EVENT, handleForceLogout);
    return () =>
      window.removeEventListener(FORCE_LOGOUT_EVENT, handleForceLogout);
  }, [navigate]);

  // Logout manual (cuando el usuario hace clic en "Cerrar sesión")
  const logout = useCallback(async () => {
    try {
      await api.post("/usuarios/logout");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setUser(null);
      sessionStorage.removeItem("user");
      navigate("/auth/login");
    }
  }, [navigate]);

  // Cargar usuario desde sessionStorage al iniciar
  useEffect(() => {
    try {
      const savedUser = sessionStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      sessionStorage.removeItem("user");
    } finally {
      setLoadingAuth(false);
    }
  }, []);

  // Guardar solo los datos del usuario (el token está en cookie HttpOnly)
  const setAuth = useCallback((u: User | null) => {
    setUser(u);
    if (u) {
      sessionStorage.setItem("user", JSON.stringify(u));
    } else {
      sessionStorage.removeItem("user");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loadingAuth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
