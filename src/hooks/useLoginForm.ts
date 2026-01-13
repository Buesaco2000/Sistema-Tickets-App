import { useState } from "react";
import { useAuth } from "./useAuth";
import { loginRequest } from "../services/auth/authServices";

export interface LoginForm {
  email: string;
  password: string;
}

export const useLoginForm = () => {
  const { setAuth } = useAuth();

  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field: keyof LoginForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.email.trim()) return "El correo electrónico es obligatorio";
    if (!form.password) return "La contraseña es obligatoria";
    return null;
  };

  const handleSubmit = async (): Promise<boolean> => {
    setError("");
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return false;
    }

    setLoading(true);

    try {
      const res = await loginRequest(form.email, form.password);
      setLoading(false);

      if (!res.success) {
        setError(res.error || "Credenciales incorrectas");
        return false;
      }

      if (!res.data) {
        setError("No se recibieron datos del usuario");
        return false;
      }

      setAuth(res.data);
      return true;
    } catch (err) {
      setLoading(false);
      setError("Error de conexión");
      return false;
    }
  };

  return { form, loading, error, updateField, handleSubmit };
};
