export interface listarVotantes{
  id: number;
  cedula: string;
  nombre: string;
  votado: boolean;
  descartado: boolean;
}
export interface ValidarVotanteResponse {
  status: string;
  message: string;
}
export interface VerificarVotacionCompletaResponse {
  status: string;
  message: string;
}
export interface VerificarVotanteDescartadoResponse {
  status: string;
  message: string;
}
