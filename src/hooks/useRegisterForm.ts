import { useState, useEffect } from "react";
import { registerRequest } from "../services/auth/authServices";
import { useAuth } from "./useAuth";
import { RegisterPayload } from "../types/User";
import { getMunicipios } from "../services/municipios/municipiosApi";
import { getCargos } from "../services/cargo/cargoApi";
import { getRoles } from "../services/rol/rolApi";
import { Cargo, Municipio, Rol } from "../types/common";

export interface RegisterForm {
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  cargoId: string;
  municipioId: string;
  rolId?: string;
  password: string;
  repeatPassword: string;
}

export const useRegisterForm = () => {
  const { setAuth } = useAuth();

  const [form, setForm] = useState<RegisterForm>({
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    cargoId: "",
    municipioId: "",
    rolId: "",
    password: "",
    repeatPassword: "",
  });

  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");

  const updateField = (field: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [muniRes, cargosRes, rolesRes] = await Promise.all([
          getMunicipios(),
          getCargos(),
          getRoles(),
        ]);

        if (muniRes.ok) setMunicipios(muniRes.municipios);

        if (cargosRes.ok) setCargos(cargosRes.cargos);

        if (rolesRes.ok) setRoles(rolesRes.roles);
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (isAdmin = false) => {
    setError("");

    const {
      nombres,
      apellidos,
      email,
      telefono,
      cargoId,
      municipioId,
      password,
      repeatPassword,
    } = form;

    if (
      !nombres ||
      !apellidos ||
      !email ||
      !telefono ||
      !cargoId ||
      !municipioId ||
      !password
    ) {
      setError("Todos los campos son obligatorios");
      return false;
    }

    if (form.cargoId === "" || form.municipioId === "") {
      setError("Debe seleccionar cargo y municipio");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Correo electrónico inválido");
      return false;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return false;
    }

    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }

    const payload: RegisterPayload = {
      nombres,
      apellidos,
      email,
      telefono,
      cargoId,
      municipioId,
      password,
      ...(form.rolId && { rolId: Number(form.rolId) }),
    };

    // console.log("Payload que se envía:", payload);

    setLoading(true);
    const res = await registerRequest(payload);
    setLoading(false);

    if (!res.success) {
      setError(res.error ?? "Error al registrar usuario");
      return false;
    }

    if (!isAdmin) {
      setAuth(res.data ?? null);
    }
    return true;
  };

  return {
    form,
    municipios,
    cargos,
    roles,
    loading,
    loadingData,
    error,
    updateField,
    handleSubmit,
    setCargos,
  };
};
