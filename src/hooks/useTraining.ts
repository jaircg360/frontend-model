/**
 * Hook para entrenamiento de modelos
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trainService } from '@/services/trainService';
import { TrainingRequest } from '@/types/api';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api-client';

export const useTraining = (fileId?: string) => {
  const queryClient = useQueryClient();
  
  // Obtener modelos del dataset
  const { data: models, isLoading: loadingModels } = useQuery({
    queryKey: ['models', fileId],
    queryFn: () => trainService.getModelsByDataset(fileId!),
    enabled: !!fileId,
    retry: 1,
  });
  
  // Entrenar modelo
  const trainMutation = useMutation({
    mutationFn: (request: TrainingRequest) => trainService.trainModel(request),
    onSuccess: (data) => {
      const mainMetric = data.metrics ? Object.entries(data.metrics)[0] : null;
      toast.success('Modelo entrenado exitosamente', {
        description: mainMetric 
          ? `${mainMetric[0]}: ${mainMetric[1].toFixed(4)}`
          : `Entrenado en ${data.training_time?.toFixed(2)}s`,
      });
      queryClient.invalidateQueries({ queryKey: ['models'] });
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
    },
    onError: (error: any) => {
      toast.error('Error al entrenar modelo', {
        description: handleApiError(error),
      });
    },
  });
  
  // Obtener sugerencias
  const getSuggestions = async (fileId: string, targetColumn: string) => {
    try {
      return await trainService.getSuggestions(fileId, targetColumn);
    } catch (error: any) {
      toast.error('Error al obtener sugerencias', {
        description: handleApiError(error),
      });
      throw error;
    }
  };
  
  // Eliminar modelo
  const deleteMutation = useMutation({
    mutationFn: trainService.deleteModel,
    onSuccess: () => {
      toast.success('Modelo eliminado');
      queryClient.invalidateQueries({ queryKey: ['models'] });
    },
    onError: (error: any) => {
      toast.error('Error al eliminar modelo', {
        description: handleApiError(error),
      });
    },
  });
  
  return {
    models: models?.models || [],
    loadingModels,
    trainModel: trainMutation.mutate,
    trainAsync: trainMutation.mutateAsync,
    isTraining: trainMutation.isPending,
    getSuggestions,
    deleteModel: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};



