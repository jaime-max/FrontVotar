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
  (response) => response, // Devuelve la respuesta sin cambios si todo está bien
  (error) => {
    const status = error.response?.status;
    const endpoint = error.config.url;

    // Ignorar errores del endpoint de login
    if (endpoint?.includes('/api/usuarios/login')) {
      return Promise.reject(error); // Deja que el componente maneje el error directamente
    }

    // Caso de no autorización (401) genérico
    if (status === 401) {
      console.warn('Usuario no autorizado. Redirigiendo...');
      localStorage.removeItem('token'); // Elimina el token si no es válido
    }

    // Caso de error interno del servidor
    if (status === 500) {
      console.error('Error interno del servidor. Por favor, intenta más tarde.');
    }

    return Promise.reject(error); // Rechaza el error para que el frontend lo maneje
  }
);

export default apiUser;
