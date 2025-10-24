/**
 * Servicio para manejar gráficos y visualizaciones de modelos
 */

import apiClient from '@/lib/api-client';
import { API_CONFIG } from '@/config/api';

export interface ChartData {
  chart_type: string;
  chart_data: string; // base64
}

export interface ModelCharts {
  success: boolean;
  model_id: string;
  model_info: any;
  charts: Record<string, string>; // chart_name -> base64
  chart_count: number;
}

export interface ModelSummary {
  model_id: string;
  model_type: string;
  dataset_name: string;
  created_at: string;
  metrics: Record<string, number>;
  available_charts: string[];
  chart_count: number;
}

export interface ChartTypes {
  regression: string[];
  classification: string[];
  clustering: string[];
  common: string[];
}

export interface ChartDescriptions {
  [key: string]: string;
}

class ChartService {
  /**
   * Obtiene todos los gráficos para un modelo específico
   */
  async getModelCharts(modelId: string): Promise<ModelCharts> {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.MODEL_CHARTS(modelId));
      return response.data;
    } catch (error) {
      console.error('Error obteniendo gráficos del modelo:', error);
      throw error;
    }
  }

  /**
   * Obtiene un gráfico específico de un modelo
   */
  async getSpecificChart(modelId: string, chartType: string): Promise<ChartData> {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.SPECIFIC_CHART(modelId, chartType));
      return response.data;
    } catch (error) {
      console.error('Error obteniendo gráfico específico:', error);
      throw error;
    }
  }

  /**
   * Obtiene resumen de todos los modelos con sus gráficos
   */
  async getAllModelsSummary(): Promise<{ models: ModelSummary[]; total_models: number }> {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.MODELS_SUMMARY_CHARTS);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo resumen de modelos:', error);
      throw error;
    }
  }

  /**
   * Regenera todos los gráficos para un modelo
   */
  async regenerateModelCharts(modelId: string): Promise<ModelCharts> {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.REGENERATE_CHARTS(modelId));
      return response.data;
    } catch (error) {
      console.error('Error regenerando gráficos:', error);
      throw error;
    }
  }

  /**
   * Obtiene los tipos de gráficos disponibles
   */
  async getAvailableChartTypes(): Promise<{
    chart_types: ChartTypes;
    descriptions: ChartDescriptions;
  }> {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.CHART_TYPES);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo tipos de gráficos:', error);
      throw error;
    }
  }

  /**
   * Convierte base64 a URL de imagen
   */
  base64ToImageUrl(base64: string): string {
    if (!base64) return '';
    return `data:image/png;base64,${base64}`;
  }

  /**
   * Obtiene el nombre descriptivo de un tipo de gráfico
   */
  getChartDisplayName(chartType: string): string {
    const chartNames: Record<string, string> = {
      'prediction_vs_actual': 'Predicciones vs Valores Reales',
      'residuals': 'Análisis de Residuos',
      'error_distribution': 'Distribución de Errores',
      'confusion_matrix': 'Matriz de Confusión',
      'roc_curve': 'Curva ROC',
      'probability_distribution': 'Distribución de Probabilidades',
      'clusters_2d': 'Visualización 2D de Clusters',
      'cluster_distribution': 'Distribución de Clusters',
      'feature_importance': 'Importancia de Características',
      'model_metrics': 'Métricas del Modelo',
      'training_summary': 'Resumen del Entrenamiento'
    };

    return chartNames[chartType] || chartType;
  }

  /**
   * Obtiene el icono para un tipo de gráfico
   */
  getChartIcon(chartType: string): string {
    const chartIcons: Record<string, string> = {
      'prediction_vs_actual': '📊',
      'residuals': '📈',
      'error_distribution': '📉',
      'confusion_matrix': '🎯',
      'roc_curve': '📈',
      'probability_distribution': '📊',
      'clusters_2d': '🔮',
      'cluster_distribution': '📊',
      'feature_importance': '⭐',
      'model_metrics': '📋',
      'training_summary': '📄'
    };

    return chartIcons[chartType] || '📊';
  }

  /**
   * Obtiene la descripción detallada de un tipo de gráfico
   */
  getChartDescription(chartType: string): string {
    const descriptions: Record<string, string> = {
      'prediction_vs_actual': 'Muestra la relación entre las predicciones del modelo y los valores reales. Una línea diagonal perfecta indica predicciones exactas.',
      'residuals': 'Analiza los residuos (diferencias entre valores reales y predicciones) para detectar patrones o sesgos en el modelo.',
      'error_distribution': 'Visualiza la distribución de errores para verificar si siguen una distribución normal.',
      'confusion_matrix': 'Matriz que muestra la precisión del modelo de clasificación comparando predicciones con valores reales.',
      'roc_curve': 'Curva ROC que muestra el rendimiento del modelo de clasificación binaria en diferentes umbrales.',
      'probability_distribution': 'Distribución de las probabilidades predichas por el modelo de clasificación.',
      'clusters_2d': 'Visualización bidimensional de los clusters encontrados por el algoritmo de clustering.',
      'cluster_distribution': 'Distribución del número de elementos en cada cluster.',
      'feature_importance': 'Muestra qué características son más importantes para las predicciones del modelo.',
      'model_metrics': 'Visualización de las métricas principales del modelo (accuracy, precision, recall, etc.).',
      'training_summary': 'Resumen completo del entrenamiento del modelo con información detallada.'
    };

    return descriptions[chartType] || 'Gráfico de análisis del modelo';
  }
}

export const chartService = new ChartService();
