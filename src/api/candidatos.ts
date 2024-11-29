import apiUser from '@/api/api-user'
import type { editarCandidatos, listarCandidato, registrarCandidato } from '@/views/candidato/interfaces/registrarCandi'
import axios from 'axios'

export default {
  async registerCandidato(data: registrarCandidato) {
    // Crear una instancia de FormData
    const formData = new FormData();

    // Convertir el objeto candidato a JSON
    const candidatoJson = JSON.stringify({
      nombre: data.nombre,
      apellido: data.apellido,
      curso: data.curso
    });

    // Agregar el JSON al FormData
    formData.append("candidato", candidatoJson);

    // Verificar si el archivo fue proporcionado y agregarlo al FormData
    if (data.file) {
      formData.append("file", data.file);
    }

    // Enviar solicitud
    try {
      const response = await apiUser.post<string>('/api/candidatos', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error al registrar candidato:', error);
      throw error;
    }
  },

  async listarCandidatos(): Promise<listarCandidato[]> {
    const response = await apiUser.get<listarCandidato[]>('/api/candidatos');

    return response.data
  },
  async Totalvotos(): Promise<number> {
    const response = await apiUser.get<number>('/api/candidatos/total-votos');
    return  response.data
  },


  async Votar(id: number, cedula: string): Promise<listarCandidato> {
    try {
      const response = await apiUser.post<listarCandidato>(`/api/candidatos/votar/${id}?cedula=${cedula}`);
      return response.data;
    } catch (error: unknown) {
      // Comprobamos si el error es un error de Axios (que tiene la propiedad `response`)
      if (axios.isAxiosError(error)) {
        // Si el error es de Axios, manejamos la respuesta del servidor
        console.error('Error al cargar votantes:', error.response?.data);
        throw new Error(`Error al cargar los votantes: ${error.response?.data}`);
      } else {
        // Si el error no es de Axios, mostramos un error genérico
        console.error('Error desconocido al cargar votantes:', (error as Error).message);
        throw new Error(`Error desconocido: ${(error as Error).message}`);
      }
    }
  },

  async EditarCandi(data: editarCandidatos): Promise<void> {
    const formData = new FormData();

    // Enviar los datos del candidato (sin JSON, solo como campos)
    formData.append("candidato", JSON.stringify({
      nombre: data.nombre,
      apellido: data.apellido,
      curso: data.curso
    }));

    // Si se proporciona una nueva imagen, agregarla al FormData
    if (data.file) {
      formData.append("file", data.file);
    }

    // Realizar la solicitud PUT
    try {
      await apiUser.put(`/api/candidatos/${data.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error('Error al actualizar el candidato:', error);
      throw error;
    }
  },

  async eliminarCandidato(id: number): Promise<void> {
    await apiUser.delete(`/api/candidatos/${id}`);
  },
  async subirVotantes(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Realizar la solicitud POST para cargar el archivo
      const response = await apiUser.post<string>('/api/candidatos/cargar-votantes', formData);

      // Retornar la respuesta si la solicitud es exitosa
      return response.data;
    } catch (error: unknown) {
      // Comprobamos si el error es un error de Axios (que tiene la propiedad `response`)
      if (axios.isAxiosError(error)) {
        // Si el error es de Axios, manejamos la respuesta del servidor
        console.error('Error al cargar votantes:', error.response?.data);
        throw new Error(`Error al cargar los votantes: ${error.response?.data}`);
      } else {
        // Si el error no es de Axios, mostramos un error genérico
        console.error('Error desconocido al cargar votantes:', (error as Error).message);
        throw new Error(`Error desconocido: ${(error as Error).message}`);
      }
    }
  }
};
