/**
 * Servicio de Entrenamiento
 */

import apiClient from '@/lib/api-client';
import { API_CONFIG } from '@/config/api';
import { TrainingRequest, TrainingResponse, Model, ModelSuggestions } from '@/types/api';

export const trainService = {
  /**
   * Entrenar modelo
   */
  trainModel: async (request: TrainingRequest): Promise<TrainingResponse> => {
    const response = await apiClient.post<TrainingResponse>(
      API_CONFIG.ENDPOINTS.TRAIN,
      request
    );
    return response.data;
  },
  
  /**
   * Obtener sugerencias de modelo
   */
  getSuggestions: async (fileId: string, targetColumn: string): Promise<ModelSuggestions> => {
    const response = await apiClient.get<ModelSuggestions>(
      `${API_CONFIG.ENDPOINTS.TRAIN_SUGGESTIONS(fileId)}?target_column=${targetColumn}`
    );
    return response.data;
  },
  
  /**
   * Listar modelos de un dataset
   */
  getModelsByDataset: async (fileId: string): Promise<{ success: boolean; file_id: string; models: Model[] }> => {
    const response = await apiClient.get(
      API_CONFIG.ENDPOINTS.MODELS_BY_DATASET(fileId)
    );
    return response.data;
  },
  
  /**
   * Obtener info de modelo
   */
  getModel: async (modelId: string): Promise<{ success: boolean; model: Model }> => {
    const response = await apiClient.get(
      API_CONFIG.ENDPOINTS.GET_MODEL(modelId)
    );
    return response.data;
  },
  
  /**
   * Eliminar modelo
   */
  deleteModel: async (modelId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(
      API_CONFIG.ENDPOINTS.DELETE_MODEL(modelId)
    );
    return response.data;
  },
};



