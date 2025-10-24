/**
 * Componente para mostrar gráficos de modelos entrenados
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RefreshCw, Download, Eye, BarChart3, TrendingUp, Target, Brain, FileText } from 'lucide-react';
import { useCharts } from '../hooks/useCharts';

interface ModelChartsProps {
  modelId: string;
  modelType?: string;
  onClose?: () => void;
}

export function ModelCharts({ modelId, modelType, onClose }: ModelChartsProps) {
  const {
    charts,
    modelInfo,
    loading,
    error,
    loadModelCharts,
    regenerateCharts,
    getChartUrl,
    getChartDisplayName,
    getChartIcon,
    getChartDescription
  } = useCharts();

  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [showFullscreen, setShowFullscreen] = useState(false);

  useEffect(() => {
    if (modelId) {
      loadModelCharts(modelId);
    }
  }, [modelId, loadModelCharts]);

  const handleRegenerateCharts = async () => {
    await regenerateCharts(modelId);
  };

  const handleDownloadChart = (chartType: string) => {
    const chartUrl = getChartUrl(chartType);
    if (chartUrl) {
      const link = document.createElement('a');
      link.href = chartUrl;
      link.download = `${modelId}_${chartType}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getChartCategory = (chartType: string): string => {
    const regressionCharts = ['prediction_vs_actual', 'residuals', 'error_distribution'];
    const classificationCharts = ['confusion_matrix', 'roc_curve', 'probability_distribution'];
    const clusteringCharts = ['clusters_2d', 'cluster_distribution'];
    const commonCharts = ['feature_importance', 'model_metrics', 'training_summary'];

    if (regressionCharts.includes(chartType)) return 'regression';
    if (classificationCharts.includes(chartType)) return 'classification';
    if (clusteringCharts.includes(chartType)) return 'clustering';
    if (commonCharts.includes(chartType)) return 'common';
    return 'other';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'regression': return <TrendingUp className="h-4 w-4" />;
      case 'classification': return <Target className="h-4 w-4" />;
      case 'clustering': return <Brain className="h-4 w-4" />;
      case 'common': return <BarChart3 className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'regression': return 'Regresión';
      case 'classification': return 'Clasificación';
      case 'clustering': return 'Clustering';
      case 'common': return 'Análisis General';
      default: return 'Otros';
    }
  };

  // Agrupar gráficos por categoría
  const groupedCharts = charts ? Object.keys(charts).reduce((acc, chartType) => {
    const category = getChartCategory(chartType);
    if (!acc[category]) acc[category] = [];
    acc[category].push(chartType);
    return acc;
  }, {} as Record<string, string[]>) : {};

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Generando gráficos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!charts || Object.keys(charts).length === 0) {
    return (
      <div className="text-center p-8">
        <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No hay gráficos disponibles</h3>
        <p className="text-muted-foreground mb-4">
          Los gráficos se generarán automáticamente después del entrenamiento del modelo.
        </p>
        <Button onClick={handleRegenerateCharts} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Generar Gráficos
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con información del modelo */}
      {modelInfo && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Análisis del Modelo</span>
                </CardTitle>
                <CardDescription>
                  Modelo: {modelInfo.model_type || 'Desconocido'} | 
                  Dataset: {modelInfo.dataset_name || 'N/A'} | 
                  Creado: {new Date(modelInfo.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleRegenerateCharts} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerar
                </Button>
                {onClose && (
                  <Button onClick={onClose} variant="outline" size="sm">
                    Cerrar
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Tabs para diferentes categorías de gráficos */}
      <Tabs defaultValue={Object.keys(groupedCharts)[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {Object.keys(groupedCharts).map((category) => (
            <TabsTrigger key={category} value={category} className="flex items-center space-x-2">
              {getCategoryIcon(category)}
              <span>{getCategoryName(category)}</span>
              <Badge variant="secondary">{groupedCharts[category].length}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(groupedCharts).map(([category, chartTypes]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chartTypes.map((chartType) => (
                <Card key={chartType} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getChartIcon(chartType)}</span>
                        <CardTitle className="text-sm">
                          {getChartDisplayName(chartType)}
                        </CardTitle>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedChart(chartType)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadChart(chartType)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="aspect-video bg-muted rounded-md overflow-hidden">
                      <img
                        src={getChartUrl(chartType)}
                        alt={getChartDisplayName(chartType)}
                        className="w-full h-full object-contain"
                        onClick={() => setSelectedChart(chartType)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {getChartDescription(chartType)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Modal para vista completa */}
      {selectedChart && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {getChartIcon(selectedChart)} {getChartDisplayName(selectedChart)}
              </h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadChart(selectedChart)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedChart(null)}
                >
                  Cerrar
                </Button>
              </div>
            </div>
            <div className="p-4">
              <img
                src={getChartUrl(selectedChart)}
                alt={getChartDisplayName(selectedChart)}
                className="w-full h-auto"
              />
              <p className="text-sm text-muted-foreground mt-4">
                {getChartDescription(selectedChart)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


