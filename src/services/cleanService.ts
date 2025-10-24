/**
 * Servicio de Limpieza
 */

import apiClient from '@/lib/api-client';
import { API_CONFIG } from '@/config/api';
import { CleaningRequest, CleaningResponse, CleaningRecommendations } from '@/types/api';

export const cleanService = {
  /**
   * Limpiar dataset
   */
  cleanDataset: async (request: CleaningRequest): Promise<CleaningResponse> => {
    const response = await apiClient.post<CleaningResponse>(
      API_CONFIG.ENDPOINTS.CLEAN,
      request
    );
    return response.data;
  },
  
  /**
   * Obtener recomendaciones
   */
  getRecommendations: async (fileId: string): Promise<CleaningRecommendations> => {
    const response = await apiClient.get<CleaningRecommendations>(
      API_CONFIG.ENDPOINTS.CLEAN_RECOMMENDATIONS(fileId)
    );
    return response.data;
  },
  
  /**
   * Ver historial
   */
  getHistory: async (fileId: string) => {
    const response = await apiClient.get(
      API_CONFIG.ENDPOINTS.CLEAN_HISTORY(fileId)
    );
    return response.data;
  },
  
  /**
   * Preview de limpieza
   */
  previewCleaning: async (fileId: string, request: CleaningRequest) => {
    const response = await apiClient.post(
      API_CONFIG.ENDPOINTS.CLEAN_PREVIEW(fileId),
      request
    );
    return response.data;
  },
};



