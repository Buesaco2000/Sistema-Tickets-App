export interface SoporteOtros {
  id: number;
  nombresIng: string;
  apellidosIng: string;
  municipio: string;
  ingeniero: string;
  tipo_error: string;
  estado: "abierto" | "en_proceso" | "resuelto";
  imagen: string | null;
}

export interface SoporteOPayload {
  descripcion: string;
  tipoSoporteId: number;
  imagen?: File | null;
}
