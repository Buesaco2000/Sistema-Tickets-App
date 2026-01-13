import { useState, useEffect } from "react";

interface TicketFormConfig {
  tipoSoporteId: number;
  submitFn: (payload: any) => Promise<{ success: boolean; error?: string }>;
}

export const useTicketForm = ({
  tipoSoporteId,
  submitFn,
}: TicketFormConfig) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Limpiar URL al desmontar
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (file: File | null) => {
    if (preview) URL.revokeObjectURL(preview);

    if (file) {
      setImagen(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setImagen(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (): Promise<boolean> => {
    setError("");

    if (!descripcion.trim()) {
      setError("La descripcion es obligatoria");
      return false;
    }

    setLoading(true);

    try {
      const res = await submitFn({
        descripcion,
        tipoSoporteId,
        imagen,
      });

      if (!res.success) {
        setError(res.error ?? "Error al crear soporte");
        return false;
      }

      return true;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setDescripcion("");
    setImagen(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setError("");
  };

  return {
    descripcion,
    setDescripcion,
    imagen,
    preview,
    loading,
    error,
    handleImageChange,
    handleSubmit,
    reset,
  };
};
