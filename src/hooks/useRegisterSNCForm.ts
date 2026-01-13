import { useEffect, useState } from "react";
import { crearSoporteNCRequest } from "../services/tickets/ticketService";
import { NotasCreditoPayload } from "../types/notasCredito";
import { getMunicipios } from "../services/municipios/municipiosApi";
import { Municipio } from "../types/common";

export interface Tickets {
  saludId: string;
  ingenieroId: string;
  municipioId: string;
  tipoErrorId?: string;
  estado: string;
  descripcion: string;
}

export const useSNCRegisterForm = () => {
  const TIPO_SOPORTE_ID = 1;

  const [form, setForm] = useState<NotasCreditoPayload>({
    fecha_facturacion: "",
    factura_anular: "",
    factura_copago_anular: "",
    factura_refacturar: "",
    motivo: "",
    valor_copago_anulado: "",
    tipoSoporteId: TIPO_SOPORTE_ID,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field: keyof NotasCreditoPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (): Promise<boolean> => {
    setError("");

    const requiredFields: (keyof NotasCreditoPayload)[] = [
      "fecha_facturacion",
      "factura_anular",
      "factura_copago_anular",
      "factura_refacturar",
      "motivo",
      "valor_copago_anulado",
    ];

    const hasEmpty = requiredFields.some(
      (field) => !form[field]?.toString().trim()
    );

    if (hasEmpty) {
      setError("Todos los campos son obligatorios");
      return false;
    }

    setLoading(true);

    try {
      const res = await crearSoporteNCRequest(form);

      setLoading(false);

      if (!res || res.success !== true) {
        setError(res.error ?? "Error al crear soporte Notas Credito");
        return false;
      }

      return true;
    } catch (error) {
      setError("No se pudo conectar con el servidor");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    updateField,
    error,
    handleSubmit,
  };
};

export const useMunicipios = () => {
  const [rows, setRows] = useState<Municipio[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingData(true);

        const muniRes = await getMunicipios();
        if (muniRes.ok) setRows(muniRes.municipios);
      } catch (error) {
        console.error("Error cargando municipios", error);
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, []);

  return { rows, loadingData };
};
