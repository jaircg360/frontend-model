/**
 * Configuración de la API Backend
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  
  ENDPOINTS: {
    // Upload
    UPLOAD: '/api/upload',
    LIST_DATASETS: '/api/upload/list',
    GET_DATASET: (id: string) => `/api/upload/${id}`,
    DELETE_DATASET: (id: string) => `/api/upload/${id}`,
    
    // Clean
    CLEAN: '/api/clean',
    CLEAN_RECOMMENDATIONS: (id: string) => `/api/clean/recommendations/${id}`,
    CLEAN_HISTORY: (id: string) => `/api/clean/history/${id}`,
    CLEAN_PREVIEW: (id: string) => `/api/clean/preview/${id}`,
    
    // Train
    TRAIN: '/api/train',
    TRAIN_SUGGESTIONS: (id: string) => `/api/train/suggestions/${id}`,
    MODELS_BY_DATASET: (id: string) => `/api/train/models/${id}`,
    GET_MODEL: (id: string) => `/api/train/model/${id}`,
    DELETE_MODEL: (id: string) => `/api/train/model/${id}`,
    
    // Agent
    AGENT_CHAT: '/api/agent/chat',
    AGENT_ANALYZE: (id: string) => `/api/agent/analyze/${id}`,
    AGENT_HISTORY: '/api/agent/history',
    AGENT_HELP: '/api/agent/help',
    AGENT_SUGGEST_MODEL: (id: string) => `/api/agent/suggest-model/${id}`,
    
    // Dashboard
    DASHBOARD_STATS: '/api/dashboard/stats',
    RECENT_ACTIVITY: '/api/dashboard/recent-activity',
    DATASETS_SUMMARY: '/api/dashboard/datasets-summary',
    MODELS_SUMMARY: '/api/dashboard/models-summary',
    SYSTEM_INFO: '/api/dashboard/system-info',
    
    // Charts
    MODEL_CHARTS: (id: string) => `/api/charts/model/${id}`,
    SPECIFIC_CHART: (id: string, chartType: string) => `/api/charts/model/${id}/chart/${chartType}`,
    MODELS_SUMMARY_CHARTS: '/api/charts/models/summary',
    REGENERATE_CHARTS: (id: string) => `/api/charts/model/${id}/regenerate`,
    CHART_TYPES: '/api/charts/chart-types',
    
    // Health
    HEALTH: '/health',
  }
};

