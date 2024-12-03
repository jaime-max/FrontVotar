import type { listarVotantes } from '@/views/ votantes/interfaces/votantes'
import type { ValidarVotanteResponse , VerificarVotacionCompletaResponse, VerificarVotanteDescartadoResponse }
  from '@/views/ votantes/interfaces/votantes'
import apiUser from '@/api/api-user'
import axios from 'axios'

export default {
  async listaVotantes(): Promise<listarVotantes[]> {
    const response = await apiUser.get<listarVotantes[]>('/api/votantes/todos');
    return response.data
  },

  async validarVotante(cedula: string): Promise<ValidarVotanteResponse> {
    try {
      const response = await apiUser.post('/api/votantes/voto/validar', { cedula });
      return response.data;  // Retorna la respuesta del backend
    } catch (error) {
      // En caso de error, se maneja el tipo de error de Axios
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ValidarVotanteResponse;  // Aseguramos que sea del tipo correcto
      } else {
        return { status: 'error', message: 'Ocurrió un error inesperado.' };
      }
    }
  },

  // Nuevo método para verificar si la votación está completa
  async verificarVotacionCompleta(): Promise<VerificarVotacionCompletaResponse> {
    try {
      const response = await apiUser.get('/api/votantes/completa');
      return response.data; // Retorna la respuesta del backend
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as VerificarVotacionCompletaResponse; // Asegura que sea del tipo correcto
      } else {
        return { status: 'error', message: 'Ocurrió un error inesperado.' };
      }
    }
  },
  // Método para descartar un votante
  async descartarVotante(id: number): Promise<VerificarVotanteDescartadoResponse> {
    try {
      const response = await apiUser.patch(`/api/votantes/${id}/descartar`);
      return response.data; // Mensaje de éxito
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as VerificarVotacionCompletaResponse; // Asegura que sea del tipo correcto
      } else {
        return { status: 'error', message: 'Ocurrió un error inesperado.' };
      }
    }
  },

  async listarVotantesNoDescartados(): Promise<listarVotantes[]> {
    try {
      const response = await apiUser.get<listarVotantes[]>('/api/votantes/no-descartados');
      return response.data;
    } catch (error) {
      console.error("Error al listar votantes no descartados:", error);
      throw error;
    }
  },

};

