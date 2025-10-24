/**
 * Servicio de Dashboard
 */

import apiClient from '@/lib/api-client';
import { API_CONFIG } from '@/config/api';
import { DashboardStats, Activity, SystemInfo } from '@/types/api';

export const dashboardService = {
  /**
   * Obtener estadísticas
   */
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>(
      API_CONFIG.ENDPOINTS.DASHBOARD_STATS
    );
    return response.data;
  },
  
  /**
   * Actividad reciente
   */
  getRecentActivity: async (): Promise<{ success: boolean; activities: Activity[] }> => {
    const response = await apiClient.get(
      API_CONFIG.ENDPOINTS.RECENT_ACTIVITY
    );
    return response.data;
  },
  
  /**
   * Resumen de datasets
   */
  getDatasetsSummary: async () => {
    const response = await apiClient.get(
      API_CONFIG.ENDPOINTS.DATASETS_SUMMARY
    );
    return response.data;
  },
  
  /**
   * Resumen de modelos
   */
  getModelsSummary: async () => {
    const response = await apiClient.get(
      API_CONFIG.ENDPOINTS.MODELS_SUMMARY
    );
    return response.data;
  },
  
  /**
   * Info del sistema
   */
  getSystemInfo: async (): Promise<SystemInfo> => {
    const response = await apiClient.get<SystemInfo>(
      API_CONFIG.ENDPOINTS.SYSTEM_INFO
    );
    return response.data;
  },
  
  /**
   * Health check
   */
  healthCheck: async () => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.HEALTH);
    return response.data;
  },
};



