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
  file: File | null;
  votos: number;
}
