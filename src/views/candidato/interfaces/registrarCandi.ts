export  interface registrarCandidato {
  nombre: string;
  apellido: string;
  curso: string;
  file: File | null;

}

export interface listarCandidato{
  id: number;
  nombre: string;
  apellido: string;
  curso: string;
  foto: string | null;
  votos: number;
}

export interface editarCandidatos{
  id: number;
  nombre: string;
  apellido: string;
  curso: string;
  file: File | null;
}

