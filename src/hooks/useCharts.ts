/**
 * Hook personalizado para manejar gráficos de modelos
 */

import { useState, useEffect, useCallback } from 'react';
import { chartService, ModelCharts, ModelSummary, ChartData } from '../services/chartService';

export interface UseChartsReturn {
  // Estado
  charts: Record<string, string> | null;
  modelInfo: any | null;
  loading: boolean;
  error: string | null;
  
  // Métodos
  loadModelCharts: (modelId: string) => Promise<void>;
  loadSpecificChart: (modelId: string, chartType: string) => Promise<string>;
  regenerateCharts: (modelId: string) => Promise<void>;
  clearCharts: () => void;
  
  // Utilidades
  getChartUrl: (chartType: string) => string;
  getChartDisplayName: (chartType: string) => string;
  getChartIcon: (chartType: string) => string;
  getChartDescription: (chartType: string) => string;
}

export function useCharts(): UseChartsReturn {
  const [charts, setCharts] = useState<Record<string, string> | null>(null);
  const [modelInfo, setModelInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga todos los gráficos para un modelo específico
   */
  const loadModelCharts = useCallback(async (modelId: string) => {
    if (!modelId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await chartService.getModelCharts(modelId);
      
      if (result.success) {
        setCharts(result.charts);
        setModelInfo(result.model_info);
      } else {
        setError('Error al cargar los gráficos del modelo');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error cargando gráficos: ${errorMessage}`);
      console.error('Error cargando gráficos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carga un gráfico específico
   */
  const loadSpecificChart = useCallback(async (modelId: string, chartType: string): Promise<string> => {
    if (!modelId || !chartType) return '';

    try {
      const result = await chartService.getSpecificChart(modelId, chartType);
      
      if (result.success) {
        return chartService.base64ToImageUrl(result.chart_data);
      } else {
        throw new Error('Error al cargar el gráfico específico');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Error cargando gráfico específico:', err);
      throw new Error(`Error cargando gráfico: ${errorMessage}`);
    }
  }, []);

  /**
   * Regenera todos los gráficos para un modelo
   */
  const regenerateCharts = useCallback(async (modelId: string) => {
    if (!modelId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await chartService.regenerateModelCharts(modelId);
      
      if (result.success) {
        setCharts(result.charts);
        setModelInfo(result.model_info);
      } else {
        setError('Error al regenerar los gráficos del modelo');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error regenerando gráficos: ${errorMessage}`);
      console.error('Error regenerando gráficos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Limpia los gráficos cargados
   */
  const clearCharts = useCallback(() => {
    setCharts(null);
    setModelInfo(null);
    setError(null);
  }, []);

  /**
   * Obtiene la URL de imagen para un tipo de gráfico
   */
  const getChartUrl = useCallback((chartType: string): string => {
    if (!charts || !charts[chartType]) return '';
    return chartService.base64ToImageUrl(charts[chartType]);
  }, [charts]);

  /**
   * Obtiene el nombre descriptivo de un tipo de gráfico
   */
  const getChartDisplayName = useCallback((chartType: string): string => {
    return chartService.getChartDisplayName(chartType);
  }, []);

  /**
   * Obtiene el icono para un tipo de gráfico
   */
  const getChartIcon = useCallback((chartType: string): string => {
    return chartService.getChartIcon(chartType);
  }, []);

  /**
   * Obtiene la descripción de un tipo de gráfico
   */
  const getChartDescription = useCallback((chartType: string): string => {
    return chartService.getChartDescription(chartType);
  }, []);

  return {
    // Estado
    charts,
    modelInfo,
    loading,
    error,
    
    // Métodos
    loadModelCharts,
    loadSpecificChart,
    regenerateCharts,
    clearCharts,
    
    // Utilidades
    getChartUrl,
    getChartDisplayName,
    getChartIcon,
    getChartDescription
  };
}

/**
 * Hook para obtener resumen de todos los modelos
 */
export function useModelsSummary() {
  const [models, setModels] = useState<ModelSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadModelsSummary = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await chartService.getAllModelsSummary();
      setModels(result.models);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error cargando resumen: ${errorMessage}`);
      console.error('Error cargando resumen de modelos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadModelsSummary();
  }, [loadModelsSummary]);

  return {
    models,
    loading,
    error,
    reload: loadModelsSummary
  };
}


