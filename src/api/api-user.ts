import axios from 'axios';

const apiUser = axios.create({
  baseURL: 'http://localhost:8080', // Asegúrate de que la URL de tu backend sea correcta
});

// Interceptor para añadir el token a las solicitudes protegidas
apiUser.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Obtén el token del localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Añade el token al encabezado
  }
  return config;
});

// Manejo de errores
apiUser.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token'); // Elimina el token
      console.warn('Usuario no autorizado o token inválido.');
      // Puedes emitir un evento global para manejar redirecciones
    }
    return Promise.reject(error);
  }
);

export default apiUser;
