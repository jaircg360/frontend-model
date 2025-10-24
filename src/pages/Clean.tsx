import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useDatasets } from "@/hooks/useDatasets";
import { useCleaning } from "@/hooks/useCleaning";
import { CleaningAction } from "@/types/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DataTable from "@/components/DataTable";

export default function Clean() {
  const [selectedDataset, setSelectedDataset] = useState("");
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [datasetInfo, setDatasetInfo] = useState<any>(null);
  const [datasetData, setDatasetData] = useState<Record<string, any>[]>([]);
  const [datasetColumns, setDatasetColumns] = useState<string[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  
  const { datasets, isLoading: loadingDatasets, getDataset } = useDatasets();
  const { 
    recommendations, 
    loadingRecommendations, 
    cleanDataset, 
    isCleaning,
    cleanAsync
  } = useCleaning(selectedDataset);

  const cleaningOptions = [
    { id: "remove_duplicates", label: "Eliminar duplicados", description: "Registros repetidos" },
    { id: "fill_nulls_mean", label: "Rellenar nulos con media", description: "Para columnas numéricas" },
    { id: "fill_nulls_median", label: "Rellenar nulos con mediana", description: "Para columnas numéricas" },
    { id: "drop_nulls", label: "Eliminar filas con nulos", description: "Eliminar filas con valores faltantes" },
    { id: "normalize", label: "Normalizar datos", description: "Escalado 0-1 con MinMaxScaler" },
    { id: "standardize", label: "Estandarizar datos", description: "Media 0, desviación 1" },
    { id: "encode_categorical", label: "Codificar categóricas", description: "Convertir texto a números" },
    { id: "remove_outliers", label: "Eliminar outliers", description: "Valores atípicos estadísticos" },
  ];

  // Cargar información del dataset cuando se selecciona
  // IMPORTANTE: Solo incluir selectedDataset en las dependencias para evitar bucle infinito
  useEffect(() => {
    if (selectedDataset) {
      setLoadingData(true);
      
      getDataset(selectedDataset).then(data => {
        setDatasetInfo(data);
        if (data.success && data.preview) {
          // Cargar solo las primeras 10 filas
          const initialData = data.preview.slice(0, 10);
          setDatasetData(initialData);
          setDatasetColumns(Object.keys(data.preview[0] || {}));
        } else {
          setDatasetData([]);
          setDatasetColumns([]);
        }
      }).catch((error) => {
        console.error('Error al cargar dataset:', error);
        setDatasetInfo(null);
        setDatasetData([]);
        setDatasetColumns([]);
      }).finally(() => {
        setLoadingData(false);
      });
    } else {
      setDatasetData([]);
      setDatasetColumns([]);
      setDatasetInfo(null);
    }
  }, [selectedDataset]); // Solo selectedDataset para evitar bucle infinito

  const handleActionToggle = (actionId: string) => {
    setSelectedActions(prev => 
      prev.includes(actionId) 
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };

  const handleClean = async () => {
    if (!selectedDataset) {
      toast.error("Selecciona un dataset primero");
      return;
    }

    if (selectedActions.length === 0) {
      toast.error("Selecciona al menos una acción de limpieza");
      return;
    }

    try {
      await cleanAsync({
        file_id: selectedDataset,
        actions: selectedActions as CleaningAction[],
      });
      // Recargar los datos después de la limpieza exitosa
      setTimeout(() => {
        handleRefresh();
      }, 1000);
    } catch (error) {
      // El error ya se maneja en el hook
    }
  };

  // Función para refrescar los datos
  const handleRefresh = async () => {
    if (selectedDataset) {
      setLoadingData(true);
      try {
        const response = await getDataset(selectedDataset);
        if (response.success && response.preview) {
          const initialData = response.preview.slice(0, 10);
          setDatasetData(initialData);
          setDatasetColumns(Object.keys(response.preview[0] || {}));
          setDatasetInfo(response);
        }
      } catch (error) {
        console.error('Error al refrescar datos:', error);
      } finally {
        setLoadingData(false);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
          Limpieza de Datos
        </h1>
        <p className="mt-2 text-muted-foreground">
          Preprocesamiento y transformación con pandas y NumPy
        </p>
      </div>

      {/* Mostrar recomendaciones del agente */}
      {recommendations && recommendations.suggestions && recommendations.suggestions.length > 0 && (
        <Alert className="border-primary/50 bg-primary/10">
          <Sparkles className="h-4 w-4 text-primary" />
          <AlertDescription>
            <strong className="text-primary">Sugerencias del Agente:</strong>
            <ul className="mt-2 space-y-1">
              {recommendations.suggestions.slice(0, 3).map((suggestion, i) => (
                <li key={i} className="text-sm">{suggestion}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-soft">
            <CardHeader>
              <CardTitle>Seleccionar Dataset</CardTitle>
              <CardDescription>Elige el conjunto de datos a procesar</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingDatasets ? (
                <div className="flex items-center justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : datasets.length === 0 ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No hay datasets disponibles. Sube uno primero en la página de Upload.
                  </AlertDescription>
                </Alert>
              ) : (
                <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un dataset" />
                  </SelectTrigger>
                  <SelectContent>
                    {datasets.map((dataset) => (
                      <SelectItem key={dataset.id} value={dataset.id}>
                        {dataset.file_name} - {dataset.rows} filas
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-soft">
            <CardHeader>
              <CardTitle>Opciones de Limpieza</CardTitle>
              <CardDescription>Selecciona las operaciones a realizar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cleaningOptions.map((option) => (
                <div key={option.id} className="flex items-start space-x-3 rounded-lg border border-border/50 bg-muted/30 p-4 hover:bg-muted/50 transition-colors">
                  <Checkbox 
                    id={option.id} 
                    className="mt-1"
                    checked={selectedActions.includes(option.id)}
                    onCheckedChange={() => handleActionToggle(option.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={option.id} className="font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button
            onClick={handleClean}
            disabled={!selectedDataset || selectedActions.length === 0 || isCleaning}
            className="w-full bg-gradient-to-r from-accent to-purple-500 hover:shadow-glow transition-all duration-300"
            size="lg"
          >
            {isCleaning ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Procesando con pandas...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Ejecutar Limpieza ({selectedActions.length} acciones)
              </>
            )}
          </Button>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Vista Previa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {datasetInfo ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Filas totales</span>
                    <span className="font-bold text-foreground">{datasetInfo.dataset.rows.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Columnas</span>
                    <span className="font-bold text-foreground">{datasetInfo.dataset.columns}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valores nulos</span>
                    <span className="font-bold text-destructive">
                      {Object.values(datasetInfo.dataset.missing_values || {}).reduce((a: any, b: any) => a + b, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estado</span>
                    <span className="font-bold text-foreground capitalize">{datasetInfo.dataset.status}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  Selecciona un dataset para ver detalles
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-secondary" />
                Librerías
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-3">
                <p className="text-sm font-medium text-foreground">pandas</p>
                <p className="text-xs text-muted-foreground">Manipulación de datos</p>
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <p className="text-sm font-medium text-foreground">NumPy</p>
                <p className="text-xs text-muted-foreground">Operaciones numéricas</p>
              </div>
              <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
                <p className="text-sm font-medium text-foreground">Scikit-learn</p>
                <p className="text-xs text-muted-foreground">Normalización y escalado</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabla de Datos */}
      {selectedDataset && (
        <DataTable
          data={datasetData}
          columns={datasetColumns}
          title="Datos del Dataset"
          description={`Vista previa de los datos antes y después de la limpieza`}
          isLoading={loadingData}
          onRefresh={handleRefresh}
          showPagination={false}
          pageSize={10}
        />
      )}
    </div>
  );
}
