import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5183/api', // Asegúrate que el puerto sea el de tu VS
});

// Este código se ejecuta ANTES de cada petición al backend
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Busca el token guardado
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Lo adjunta a la cabecera
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
// Este código se ejecuta cuando el backend responde
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente la pasamos
    return response;
  },
  (error) => {
    // Si el servidor responde con 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      console.error("Sesión expirada o token inválido.");
      
      // 1. Borramos el token para que no intente usarlo más
      localStorage.removeItem('token');
      
      // 2. Redirigimos al Login (esto recargará la página en /login)
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export default api;