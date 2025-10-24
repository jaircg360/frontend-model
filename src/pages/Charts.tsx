/**
 * Página para visualizar gráficos y análisis de modelos entrenados
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  BarChart3, 
  Search, 
  Filter, 
  Calendar, 
  TrendingUp, 
  Target, 
  Brain,
  RefreshCw,
  Download,
  Eye,
  FileText,
  Clock
} from 'lucide-react';
import { ModelCharts } from '../components/ModelCharts';
import { useModelsSummary } from '../hooks/useCharts';

function ChartsPage() {
  const { models, loading, error, reload } = useModelsSummary();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');

  // Filtrar y ordenar modelos
  const filteredModels = models
    .filter(model => {
      const matchesSearch = model.model_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.dataset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.model_type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterType === 'all' || model.model_type.toLowerCase().includes(filterType.toLowerCase());
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'model_type':
          return a.model_type.localeCompare(b.model_type);
        case 'chart_count':
          return b.chart_count - a.chart_count;
        case 'dataset_name':
          return a.dataset_name.localeCompare(b.dataset_name);
        default:
          return 0;
      }
    });

  const getModelTypeIcon = (modelType: string) => {
    if (modelType.toLowerCase().includes('regression')) return <TrendingUp className="h-4 w-4" />;
    if (modelType.toLowerCase().includes('classification')) return <Target className="h-4 w-4" />;
    if (modelType.toLowerCase().includes('clustering')) return <Brain className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const getModelTypeColor = (modelType: string) => {
    if (modelType.toLowerCase().includes('regression')) return 'bg-blue-100 text-blue-800';
    if (modelType.toLowerCase().includes('classification')) return 'bg-green-100 text-green-800';
    if (modelType.toLowerCase().includes('clustering')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMainMetric = (metrics: Record<string, number>) => {
    if (metrics.accuracy) return `Accuracy: ${(metrics.accuracy * 100).toFixed(1)}%`;
    if (metrics.r2_score) return `R²: ${metrics.r2_score.toFixed(3)}`;
    if (metrics.mse) return `MSE: ${metrics.mse.toFixed(3)}`;
    return 'Métricas disponibles';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Cargando modelos...</span>
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <BarChart3 className="h-8 w-8" />
            <span>Análisis de Modelos</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Visualiza gráficos, métricas y análisis detallados de tus modelos entrenados
          </p>
        </div>
        <Button onClick={reload} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros y Búsqueda</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar modelos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de modelo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="regression">Regresión</SelectItem>
                <SelectItem value="classification">Clasificación</SelectItem>
                <SelectItem value="clustering">Clustering</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Fecha de creación</SelectItem>
                <SelectItem value="model_type">Tipo de modelo</SelectItem>
                <SelectItem value="chart_count">Número de gráficos</SelectItem>
                <SelectItem value="dataset_name">Nombre del dataset</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{filteredModels.length} modelos encontrados</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de modelos o vista de gráficos */}
      {selectedModel ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setSelectedModel(null)}
              className="flex items-center space-x-2"
            >
              ← Volver a la lista
            </Button>
            <Badge variant="outline" className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Modelo seleccionado</span>
            </Badge>
          </div>
          <ModelCharts modelId={selectedModel} />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredModels.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay modelos disponibles</h3>
                <p className="text-muted-foreground mb-4">
                  Entrena algunos modelos primero para ver sus análisis y gráficos.
                </p>
                <Button onClick={() => window.location.href = '/train'}>
                  Ir a Entrenar Modelos
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredModels.map((model) => (
                <Card 
                  key={model.model_id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedModel(model.model_id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getModelTypeIcon(model.model_type)}
                        <CardTitle className="text-sm">
                          {model.model_type}
                        </CardTitle>
                      </div>
                      <Badge className={getModelTypeColor(model.model_type)}>
                        {model.chart_count} gráficos
                      </Badge>
                    </div>
                    <CardDescription>
                      Dataset: {model.dataset_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Creado:</span>
                      <span>{formatDate(model.created_at)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Métrica principal:</span>
                      <span className="font-medium">{getMainMetric(model.metrics)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Gráficos disponibles:</span>
                      <div className="flex space-x-1">
                        {model.available_charts.slice(0, 3).map((chartType) => (
                          <Badge key={chartType} variant="outline" className="text-xs">
                            {chartType.replace('_', ' ')}
                          </Badge>
                        ))}
                        {model.available_charts.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{model.available_charts.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedModel(model.model_id);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Análisis
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChartsPage;
