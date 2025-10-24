import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap, Activity, AlertCircle, CheckCircle2, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useDatasets } from "@/hooks/useDatasets";
import { useTraining } from "@/hooks/useTraining";
import { ModelType } from "@/types/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export default function Train() {
  const [selectedDataset, setSelectedDataset] = useState("");
  const [datasetInfo, setDatasetInfo] = useState<any>(null);
  const [targetColumn, setTargetColumn] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [modelType, setModelType] = useState<ModelType>("regression");
  const [algorithm, setAlgorithm] = useState("");
  const [testSize, setTestSize] = useState([20]);
  const [suggestions, setSuggestions] = useState<any>(null);
  const [trainedModels, setTrainedModels] = useState<any[]>([]);

  const { datasets, isLoading: loadingDatasets, getDataset } = useDatasets();
  const { trainModel, isTraining, getSuggestions, models } = useTraining(selectedDataset);

  // Modelos disponibles por tipo
  const modelsByType = {
    regression: [
      { value: "linear_regression", label: "Regresión Lineal", library: "Scikit-learn" },
      { value: "random_forest_regressor", label: "Random Forest", library: "Scikit-learn" },
      { value: "gradient_boosting_regressor", label: "Gradient Boosting", library: "Scikit-learn" },
      { value: "svr", label: "Support Vector Regression", library: "Scikit-learn" },
      { value: "neural_network", label: "Red Neuronal", library: "PyTorch" },
    ],
    classification: [
      { value: "logistic_regression", label: "Regresión Logística", library: "Scikit-learn" },
      { value: "random_forest_classifier", label: "Random Forest", library: "Scikit-learn" },
      { value: "gradient_boosting_classifier", label: "Gradient Boosting", library: "Scikit-learn" },
      { value: "svc", label: "Support Vector Machine", library: "Scikit-learn" },
      { value: "neural_network", label: "Red Neuronal", library: "PyTorch" },
    ],
    clustering: [
      { value: "kmeans", label: "K-Means", library: "Scikit-learn" },
      { value: "dbscan", label: "DBSCAN", library: "Scikit-learn" },
    ],
    neural_network: [
      { value: "neural_network", label: "Red Neuronal Personalizada", library: "PyTorch" },
    ],
  };

  // Cargar información del dataset cuando se selecciona
  useEffect(() => {
    if (selectedDataset) {
      getDataset(selectedDataset).then(data => {
        setDatasetInfo(data);
        setTargetColumn("");
        setSelectedFeatures([]);
        setSuggestions(null);
      }).catch(() => {
        setDatasetInfo(null);
      });
    }
  }, [selectedDataset]);

  // Obtener sugerencias cuando se selecciona target column
  useEffect(() => {
    if (selectedDataset && targetColumn) {
      getSuggestions(selectedDataset, targetColumn).then(data => {
        if (data.success && data.suggestions) {
          setSuggestions(data.suggestions);
          setModelType(data.suggestions.recommended_type as ModelType);
          if (data.suggestions.recommended_algorithms?.length > 0) {
            setAlgorithm(data.suggestions.recommended_algorithms[0]);
          }
        }
      });
    }
  }, [targetColumn, selectedDataset]);

  // Cargar modelos entrenados
  useEffect(() => {
    if (models && models.length > 0) {
      setTrainedModels(models);
    }
  }, [models]);

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleTrain = async () => {
    if (!selectedDataset) {
      toast.error("Selecciona un dataset");
      return;
    }

    if (!targetColumn) {
      toast.error("Selecciona la columna objetivo");
      return;
    }

    if (selectedFeatures.length === 0) {
      toast.error("Selecciona al menos una característica");
      return;
    }

    if (!algorithm) {
      toast.error("Selecciona un algoritmo");
      return;
    }

    trainModel({
      file_id: selectedDataset,
      model_type: modelType,
      target_column: targetColumn,
      feature_columns: selectedFeatures,
      test_size: testSize[0] / 100,
      algorithm: algorithm,
    });
  };

  const availableColumns = datasetInfo?.dataset?.column_types 
    ? Object.keys(datasetInfo.dataset.column_types) 
    : [];

  const availableFeatures = availableColumns.filter(col => col !== targetColumn);

  const currentModels = modelsByType[modelType] || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
          Entrenar Modelo
        </h1>
        <p className="mt-2 text-muted-foreground">
          Configura y entrena modelos con PyTorch y Scikit-learn
        </p>
      </div>

      {/* Sugerencias del Agente */}
      {suggestions && (
        <Alert className="border-primary/50 bg-primary/10">
          <Sparkles className="h-4 w-4 text-primary" />
          <AlertDescription>
            <strong className="text-primary">Sugerencia del Agente:</strong>
            <p className="mt-2 text-sm">{suggestions.explanation}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestions.recommended_algorithms?.map((alg: string) => (
                <Badge key={alg} variant="outline">{alg}</Badge>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dataset Selection */}
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-soft">
            <CardHeader>
              <CardTitle>Seleccionar Dataset</CardTitle>
              <CardDescription>Elige el conjunto de datos a entrenar</CardDescription>
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
                    No hay datasets disponibles. Sube y limpia uno primero.
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

          {/* Target Column */}
          {datasetInfo && (
            <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-soft">
              <CardHeader>
                <CardTitle>Columna Objetivo (Target)</CardTitle>
                <CardDescription>Variable que deseas predecir</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={targetColumn} onValueChange={setTargetColumn}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la columna objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableColumns.map((col) => (
                      <SelectItem key={col} value={col}>
                        {col} ({datasetInfo.dataset.column_types[col]})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {/* Features Selection */}
          {targetColumn && (
            <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-soft">
              <CardHeader>
                <CardTitle>Características (Features)</CardTitle>
                <CardDescription>Variables para entrenar el modelo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableFeatures.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-lg">
                      <Checkbox
                        id={feature}
                        checked={selectedFeatures.includes(feature)}
                        onCheckedChange={() => handleFeatureToggle(feature)}
                      />
                      <Label htmlFor={feature} className="flex-1 cursor-pointer">
                        {feature} ({datasetInfo.dataset.column_types[feature]})
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  {selectedFeatures.length} de {availableFeatures.length} seleccionadas
                </div>
              </CardContent>
            </Card>
          )}

          {/* Model Configuration */}
          {selectedFeatures.length > 0 && (
            <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-soft">
              <CardHeader>
                <CardTitle>Configuración del Modelo</CardTitle>
                <CardDescription>Tipo de modelo y algoritmo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo de Modelo</Label>
                  <Select value={modelType} onValueChange={(value) => {
                    setModelType(value as ModelType);
                    setAlgorithm("");
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regression">Regresión</SelectItem>
                      <SelectItem value="classification">Clasificación</SelectItem>
                      <SelectItem value="clustering">Clustering</SelectItem>
                      <SelectItem value="neural_network">Red Neuronal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                  <Label>Algoritmo</Label>
                  <Select value={algorithm} onValueChange={setAlgorithm}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un algoritmo" />
                  </SelectTrigger>
                  <SelectContent>
                      {currentModels.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                          {model.label} ({model.library})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label>Tamaño del Test Set</Label>
                    <span className="text-sm font-bold text-primary">{testSize[0]}%</span>
                </div>
                <Slider
                    value={testSize}
                    onValueChange={setTestSize}
                  min={10}
                    max={40}
                    step={5}
                  className="w-full"
                />
                  <p className="text-xs text-muted-foreground">
                    Train: {100 - testSize[0]}% | Test: {testSize[0]}%
                  </p>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Training Progress */}
          {isTraining && (
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-soft animate-in fade-in slide-in-from-bottom duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  Entrenamiento en Progreso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span className="text-sm">Procesando con {algorithm === 'neural_network' ? 'PyTorch' : 'Scikit-learn'}...</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Train Button */}
          <Button
            onClick={handleTrain}
            disabled={!selectedDataset || !targetColumn || selectedFeatures.length === 0 || !algorithm || isTraining}
            className="w-full bg-gradient-to-r from-secondary to-emerald-400 hover:shadow-glow transition-all duration-300"
            size="lg"
          >
            {isTraining ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Entrenando...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-5 w-5" />
                Iniciar Entrenamiento
              </>
            )}
          </Button>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          {/* Dataset Info */}
          {datasetInfo && (
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-soft">
            <CardHeader>
                <CardTitle className="text-lg">Info del Dataset</CardTitle>
            </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Filas</span>
                  <span className="font-bold text-foreground">{datasetInfo.dataset.rows.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Columnas</span>
                  <span className="font-bold text-foreground">{datasetInfo.dataset.columns}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estado</span>
                  <Badge variant="outline">{datasetInfo.dataset.status}</Badge>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Frameworks */}
          <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-accent" />
                Frameworks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-accent/20 bg-card/50 p-3">
                <p className="text-sm font-medium text-foreground">PyTorch</p>
                <p className="text-xs text-muted-foreground">Deep Learning</p>
              </div>
              <div className="rounded-lg border border-secondary/20 bg-card/50 p-3">
                <p className="text-sm font-medium text-foreground">Scikit-learn</p>
                <p className="text-xs text-muted-foreground">Machine Learning</p>
              </div>
            </CardContent>
          </Card>

          {/* Models Trained */}
          {trainedModels.length > 0 && (
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 shadow-soft">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-secondary" />
                  Modelos Entrenados
                </CardTitle>
            </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  {trainedModels.length} modelo(s) disponible(s)
              </div>
                {trainedModels.slice(0, 3).map((model, i) => (
                  <div key={i} className="text-xs p-2 bg-muted/30 rounded">
                    <div className="font-medium">{model.model_name}</div>
                    <div className="text-muted-foreground">{model.model_type}</div>
              </div>
                ))}
                <div className="pt-2 border-t border-border/50">
                  <Button 
                    onClick={() => window.location.href = '/charts'} 
                    className="w-full"
                    variant="outline"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Ver Análisis y Gráficos
                  </Button>
              </div>
            </CardContent>
          </Card>
          )}
        </div>
      </div>
    </div>
  );
}
