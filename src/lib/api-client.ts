/**
 * Cliente de API con Axios
 */

import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '@/config/api';
import { toast } from 'sonner';

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2 minutos para operaciones largas
});

// Interceptor para requests
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    
    // Manejo de errores
    const errorMessage = handleApiError(error);
    
    // No mostrar toast automáticamente, dejar que cada servicio lo maneje
    // toast.error(errorMessage);
    
    return Promise.reject(error);
  }
);

// Función para manejar errores
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Error del servidor
    const detail = error.response.data?.detail;
    const message = error.response.data?.message;
    
    if (detail) {
      return typeof detail === 'string' ? detail : JSON.stringify(detail);
    }
    
    if (message) {
      return message;
    }
    
    switch (error.response.status) {
      case 400:
        return 'Solicitud inválida. Verifica los datos enviados.';
      case 404:
        return 'Recurso no encontrado.';
      case 500:
        return 'Error interno del servidor. Intenta de nuevo.';
      default:
        return `Error del servidor: ${error.response.status}`;
    }
  } else if (error.request) {
    // Error de red
    return 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en http://localhost:8000';
  } else {
    // Otro error
    return error.message || 'Error desconocido';
  }
};

export default apiClient;



