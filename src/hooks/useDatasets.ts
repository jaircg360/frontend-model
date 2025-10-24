/**
 * Hook para gestionar datasets
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadService } from '@/services/uploadService';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api-client';

export const useDatasets = () => {
  const queryClient = useQueryClient();
  
  // Listar datasets
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['datasets'],
    queryFn: uploadService.listDatasets,
    retry: 1,
  });
  
  // Subir archivo
  const uploadMutation = useMutation({
    mutationFn: uploadService.uploadFile,
    onSuccess: (data) => {
      toast.success('Archivo subido exitosamente', {
        description: `${data.file_name} - ${data.rows} filas, ${data.columns} columnas`,
      });
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
    },
    onError: (error: any) => {
      toast.error('Error al subir archivo', {
        description: handleApiError(error),
      });
    },
  });
  
  // Eliminar dataset
  const deleteMutation = useMutation({
    mutationFn: uploadService.deleteDataset,
    onSuccess: () => {
      toast.success('Dataset eliminado');
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
    },
    onError: (error: any) => {
      toast.error('Error al eliminar', {
        description: handleApiError(error),
      });
    },
  });
  
  // Obtener dataset
  const getDataset = async (fileId: string) => {
    try {
      return await uploadService.getDataset(fileId);
    } catch (error: any) {
      toast.error('Error al obtener dataset', {
        description: handleApiError(error),
      });
      throw error;
    }
  };
  
  return {
    datasets: data?.datasets || [],
    isLoading,
    error,
    refetch,
    uploadDataset: uploadMutation.mutate,
    uploadAsync: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    deleteDataset: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    getDataset,
  };
};



