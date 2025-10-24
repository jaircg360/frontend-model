/**
 * Hook para limpieza de datos
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cleanService } from '@/services/cleanService';
import { CleaningRequest } from '@/types/api';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api-client';

export const useCleaning = (fileId?: string) => {
  const queryClient = useQueryClient();
  
  // Obtener recomendaciones
  const { data: recommendations, isLoading: loadingRecommendations } = useQuery({
    queryKey: ['cleaning-recommendations', fileId],
    queryFn: () => cleanService.getRecommendations(fileId!),
    enabled: !!fileId,
    retry: 1,
  });
  
  // Obtener historial
  const { data: history } = useQuery({
    queryKey: ['cleaning-history', fileId],
    queryFn: () => cleanService.getHistory(fileId!),
    enabled: !!fileId,
    retry: 1,
  });
  
  // Limpiar dataset
  const cleanMutation = useMutation({
    mutationFn: (request: CleaningRequest) => cleanService.cleanDataset(request),
    onSuccess: (data) => {
      toast.success('Dataset limpiado exitosamente', {
        description: `${data.original_rows} → ${data.cleaned_rows} filas`,
      });
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
      queryClient.invalidateQueries({ queryKey: ['cleaning-history', fileId] });
    },
    onError: (error: any) => {
      toast.error('Error al limpiar dataset', {
        description: handleApiError(error),
      });
    },
  });
  
  // Preview de limpieza
  const previewMutation = useMutation({
    mutationFn: ({ fileId, request }: { fileId: string; request: CleaningRequest }) =>
      cleanService.previewCleaning(fileId, request),
  });
  
  return {
    recommendations,
    loadingRecommendations,
    history: history?.history || [],
    cleanDataset: cleanMutation.mutate,
    cleanAsync: cleanMutation.mutateAsync,
    isCleaning: cleanMutation.isPending,
    previewCleaning: previewMutation.mutate,
    previewAsync: previewMutation.mutateAsync,
    isPreviewing: previewMutation.isPending,
  };
};



