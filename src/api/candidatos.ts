import apiUser from '@/api/api-user'
import type { registrarCandidato } from '@/views/candidato/interfaces/registrarCandi'


export default {
  async registerCandidato(data: registrarCandidato) {
    // Crear una instancia de FormData
    const formData = new FormData();

    // Agregar datos al FormData
    formData.append(
      "candidato",
      JSON.stringify({
        nombre: data.nombre,
        apellido: data.apellido,
        curso: data.curso,
      })
    );

    if (data.file) {
      formData.append("file", data.file);
    }

    // Enviar solicitud
    const response = await apiUser.post<string>('/api/candidatos', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};
