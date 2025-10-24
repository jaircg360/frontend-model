/**
 * Servicio de Upload
 */

import apiClient from '@/lib/api-client';
import { API_CONFIG } from '@/config/api';
import { UploadResponse, Dataset } from '@/types/api';

export const uploadService = {
  /**
   * Subir archivo
   */
  uploadFile: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post<UploadResponse>(
      API_CONFIG.ENDPOINTS.UPLOAD,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  },
  
  /**
   * Listar datasets
   */
  listDatasets: async (): Promise<{ success: boolean; datasets: Dataset[] }> => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.LIST_DATASETS);
    return response.data;
  },
  
  /**
   * Obtener dataset
   */
  getDataset: async (fileId: string): Promise<{ success: boolean; dataset: Dataset; preview: any[] }> => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.GET_DATASET(fileId));
    return response.data;
  },
  
  /**
   * Eliminar dataset
   */
  deleteDataset: async (fileId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.DELETE_DATASET(fileId));
    return response.data;
  },
};



