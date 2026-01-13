import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateRoute({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles?: string[];
}) {
  const { user, loadingAuth } = useAuth();

  if (loadingAuth) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    // Si no hay usuario autenticado, redirige a login
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.rol ?? "")) {
    return <Navigate to="/auth" />;
  }

  // Si hay usuario autenticado, renderiza la ruta
  return children;
}
