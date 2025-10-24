/**
 * Servicio del Agente Inteligente
 */

import apiClient from '@/lib/api-client';
import { API_CONFIG } from '@/config/api';
import { AgentRequest, AgentResponse, ConversationMessage } from '@/types/api';

export const agentService = {
  /**
   * Chat con el agente
   */
  chat: async (request: AgentRequest): Promise<AgentResponse> => {
    const response = await apiClient.post<AgentResponse>(
      API_CONFIG.ENDPOINTS.AGENT_CHAT,
      request
    );
    return response.data;
  },
  
  /**
   * Analizar dataset
   */
  analyzeDataset: async (fileId: string) => {
    const response = await apiClient.get(
      API_CONFIG.ENDPOINTS.AGENT_ANALYZE(fileId)
    );
    return response.data;
  },
  
  /**
   * Obtener historial
   */
  getHistory: async (): Promise<{ success: boolean; history: ConversationMessage[]; total_messages: number }> => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.AGENT_HISTORY);
    return response.data;
  },
  
  /**
   * Obtener ayuda
   */
  getHelp: async () => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.AGENT_HELP);
    return response.data;
  },
  
  /**
   * Sugerir modelo
   */
  suggestModel: async (fileId: string, targetColumn: string) => {
    const response = await apiClient.post(
      API_CONFIG.ENDPOINTS.AGENT_SUGGEST_MODEL(fileId),
      null,
      {
        params: { target_column: targetColumn }
      }
    );
    return response.data;
  },
  
  /**
   * Limpiar historial
   */
  clearHistory: async () => {
    const response = await apiClient.delete(API_CONFIG.ENDPOINTS.AGENT_HISTORY);
    return response.data;
  },
};



