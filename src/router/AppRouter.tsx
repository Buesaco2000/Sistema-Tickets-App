import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/Auth/LoginPage";
import AuthPage from "../pages/Auth/AuthPage";
import RecoverPasswordPage from "../pages/Auth/RecoverPasswordPage";
import DashboardPage from "../pages/Dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";
import RegisterPage from "../pages/Auth/RegisterPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />

      {/* Rutas públicas */}
      <Route path="/auth">
        <Route index element={<AuthPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/recoverPassword" element={<RecoverPasswordPage />} />
      </Route>

      {/* Rutas privadas */}
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />

      {/* 🔹 Ruta por defecto si no existe */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
