/**
 * Hook para el agente inteligente
 */

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { agentService } from '@/services/agentService';
import { AgentRequest, ConversationMessage } from '@/types/api';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api-client';

export const useAgent = () => {
  const [localHistory, setLocalHistory] = useState<ConversationMessage[]>([]);
  
  // Obtener historial del servidor
  const { data: serverHistory } = useQuery({
    queryKey: ['agent-history'],
    queryFn: agentService.getHistory,
    retry: 1,
  });
  
  // Chat con el agente
  const chatMutation = useMutation({
    mutationFn: (request: AgentRequest) => agentService.chat(request),
    onSuccess: (data, variables) => {
      // Agregar al historial local
      setLocalHistory(prev => [
        ...prev,
        { role: 'user', message: variables.message },
        { role: 'assistant', message: data.message },
      ]);
    },
    onError: (error: any) => {
      toast.error('Error en el chat', {
        description: handleApiError(error),
      });
    },
  });
  
  // Analizar dataset
  const analyzeMutation = useMutation({
    mutationFn: (fileId: string) => agentService.analyzeDataset(fileId),
    onError: (error: any) => {
      toast.error('Error al analizar', {
        description: handleApiError(error),
      });
    },
  });
  
  // Limpiar historial
  const clearHistoryMutation = useMutation({
    mutationFn: agentService.clearHistory,
    onSuccess: () => {
      setLocalHistory([]);
      toast.success('Historial limpiado');
    },
  });
  
  // Método simplificado para preguntas directas
  const askQuestion = async (message: string): Promise<{ response: string; success: boolean }> => {
    try {
      const result = await chatMutation.mutateAsync({ message });
      return {
        response: result.message || "Lo siento, no pude procesar tu pregunta.",
        success: result.success !== false,
      };
    } catch (error: any) {
      console.error('Error al hacer pregunta al agente:', error);
      return {
        response: "Lo siento, hubo un error al comunicarme con el servidor. Por favor, intenta de nuevo.",
        success: false,
      };
    }
  };
  
  return {
    sendMessage: chatMutation.mutate,
    sendMessageAsync: chatMutation.mutateAsync,
    isLoading: chatMutation.isPending,
    analyzeDataset: analyzeMutation.mutate,
    analyzeAsync: analyzeMutation.mutateAsync,
    isAnalyzing: analyzeMutation.isPending,
    history: localHistory.length > 0 ? localHistory : (serverHistory?.history || []),
    clearHistory: clearHistoryMutation.mutate,
    askQuestion,
  };
};

