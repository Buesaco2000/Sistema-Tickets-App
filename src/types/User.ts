export interface User {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  rol_id?: number;
  rol?: string;
  cargo_id?: number;
  cargo?: string;
  municipio_id?: number;
  municipio?: string;
  activo: EstadoUser;
}

export interface RegisterPayload {
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  cargoId: string;
  municipioId: string;
  password: string;
}

export type EstadoUser = boolean;
