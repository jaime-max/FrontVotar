export interface listarVotantes{
  id: number;
  cedula: string;
  nombre: string;
  votado: boolean;
}
export interface ValidarVotanteResponse {
  status: string;
  message: string;
}
export interface VerificarVotacionCompletaResponse {
  status: string;
  message: string;
}
