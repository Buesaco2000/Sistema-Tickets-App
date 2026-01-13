export interface Municipio {
  id: string;
  nombre: string;
}

export interface Cargo {
  id: string;
  nombre: string;
}

export interface Rol {
  id: string;
  nombre: string;
}

export interface Tickets {
  saludId: string;
  ingenieroId: string;
  municipioId: string;
  tipoErrorId?: string;
  estado: string;
  descripcion: string;
}