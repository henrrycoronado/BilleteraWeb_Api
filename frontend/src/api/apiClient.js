// src/api/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  // En un futuro, aquí pondrás la URL base de tu backend real
  // baseURL: 'https://api.tu-billetera.com/v1', 
  timeout: 5000, // Tiempo de espera de 5 segundos
});

// --- Interceptor de Petición ---
// Se ejecuta ANTES de que cada petición sea enviada.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Añade el token a la cabecera de autorización
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Maneja errores en la configuración de la petición
    return Promise.reject(error);
  }
);

// --- Interceptor de Respuesta ---
// Se ejecuta DESPUÉS de recibir cada respuesta.
apiClient.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente la devuelve
    return response;
  },
  (error) => {
    // Si la respuesta es un error...
    if (error.response && error.response.status === 401) {
      // Error 401: Token inválido o expirado
      console.error("Token expirado o inválido. Cerrando sesión.");
      localStorage.removeItem('authToken');
      
      // Recarga la página para redirigir al usuario al login
      window.location.href = '/login'; 
      // En una app con React Router, usaríamos history.push('/login')
    }
    
    // Devuelve el error para que el componente que hizo la llamada también pueda manejarlo
    return Promise.reject(error);
  }
);

export default apiClient;