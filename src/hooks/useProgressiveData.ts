import { useState, useCallback } from 'react';
import { uploadService } from '@/services/uploadService';

export const useProgressiveData = () => {
  const [datasetData, setDatasetData] = useState<Record<string, any>[]>([]);
  const [datasetColumns, setDatasetColumns] = useState<string[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [totalRows, setTotalRows] = useState(0);

  const loadInitialData = useCallback(async (datasetId: string) => {
    if (!datasetId) return;
    
    console.log('useProgressiveData: Iniciando carga de datos para:', datasetId);
    setLoadingData(true);
    setCurrentOffset(0);
    
    try {
      const response = await uploadService.getDataset(datasetId);
      console.log('useProgressiveData: Respuesta del servicio:', response);
      if (response.success && response.preview) {
        // Cargar solo las primeras 10 filas
        const initialData = response.preview.slice(0, 10);
        console.log('useProgressiveData: Datos iniciales cargados:', initialData.length, 'filas');
        setDatasetData(initialData);
        setDatasetColumns(Object.keys(response.preview[0] || {}));
        setTotalRows(response.preview.length);
        setHasMoreData(response.preview.length > 10);
        setCurrentOffset(10);
      }
    } catch (error) {
      console.error('useProgressiveData: Error al cargar datos:', error);
      setDatasetData([]);
      setDatasetColumns([]);
      setHasMoreData(false);
    } finally {
      setLoadingData(false);
      console.log('useProgressiveData: Carga completada');
    }
  }, []);

  const loadMoreData = useCallback(async (datasetId: string) => {
    if (!datasetId || !hasMoreData) return;
    
    setLoadingMore(true);
    
    try {
      const response = await uploadService.getDataset(datasetId);
      if (response.success && response.preview) {
        const nextBatch = response.preview.slice(currentOffset, currentOffset + 10);
        setDatasetData(prev => [...prev, ...nextBatch]);
        setCurrentOffset(prev => prev + 10);
        setHasMoreData(currentOffset + 10 < response.preview.length);
      }
    } catch (error) {
      console.error('Error al cargar más datos:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMoreData, currentOffset]);

  const refreshData = useCallback(async (datasetId: string) => {
    await loadInitialData(datasetId);
  }, [loadInitialData]);

  const resetData = useCallback(() => {
    setDatasetData([]);
    setDatasetColumns([]);
    setCurrentOffset(0);
    setHasMoreData(false);
    setTotalRows(0);
  }, []);

  return {
    datasetData,
    datasetColumns,
    loadingData,
    loadingMore,
    hasMoreData,
    totalRows,
    loadInitialData,
    loadMoreData,
    refreshData,
    resetData
  };
};
