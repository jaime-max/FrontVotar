import axios from 'axios';

const apiUser = axios.create({
  baseURL: 'http://localhost:8080',
})

// Interceptor para añadir el token a las solicitudes protegidas
apiUser.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Obtén el token del localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Añade el token al encabezado
  }
  return config;
});

// Interceptor para manejar respuestas y errores
apiUser.interceptors.response.use(
  (response) => response, // Deja pasar las respuestas exitosas
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token'); // Limpia el token
      alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      window.location.href = '/login'; // Redirige a la página de login
    }
    return Promise.reject(error); // Rechaza otras respuestas de error
  }
);
export default apiUser
