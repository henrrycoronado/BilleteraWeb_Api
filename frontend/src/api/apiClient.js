// src/api/apiClient.js
import axios from 'axios';

// Creamos una instancia de axios con configuración base.
const apiClient = axios.create({
  // IMPORTANTE: Reemplaza esto con la URL base de tu backend real.
  // Si tu backend corre localmente en el puerto 5000, por ejemplo, sería:
  baseURL: 'http://localhost:5110', 
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de Petición (Request)
 * Esta función se ejecuta ANTES de que cada petición sea enviada.
 * Su trabajo es tomar el token del localStorage y añadirlo a las cabeceras.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Si el token existe, lo añadimos a la cabecera 'Authorization'
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Si hay un error al configurar la petición, lo rechazamos.
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Respuesta (Response)
 * Esta función se ejecuta DESPUÉS de recibir una respuesta.
 * Su trabajo es revisar si hay errores globales, como un token expirado.
 */
apiClient.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa (status 2xx), simplemente la devolvemos.
    return response;
  },
  (error) => {
    // Si la respuesta es un error...
    if (error.response && error.response.status === 401) {
      // Error 401 significa 'No Autorizado' (token inválido o expirado).
      console.error("AUTENTICACIÓN FALLIDA (TOKEN EXPIRADO/INVÁLIDO). CERRANDO SESIÓN.");
      // Limpiamos el token del almacenamiento.
      localStorage.removeItem('authToken');
      // Forzamos un refresco de la página. Como el token ya no existe,
      // nuestro componente App redirigirá al usuario a la pantalla de login.
      window.location.reload();
    }
    
    // Devolvemos el error para que el componente que hizo la llamada (ej: LoginPage)
    // también pueda manejarlo y mostrar un mensaje específico.
    return Promise.reject(error);
  }
);

export default apiClient;