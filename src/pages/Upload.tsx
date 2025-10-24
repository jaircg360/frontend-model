import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload as UploadIcon, FileJson, FileText, CheckCircle2, Trash2, Table } from "lucide-react";
import { toast } from "sonner";
import { useDatasets } from "@/hooks/useDatasets";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/DataTable";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<string>("");
  const [datasetData, setDatasetData] = useState<Record<string, any>[]>([]);
  const [datasetColumns, setDatasetColumns] = useState<string[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  
  const { datasets, isLoading, uploadDataset, isUploading, deleteDataset, getDataset } = useDatasets();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Por favor selecciona un archivo");
      return;
    }

    uploadDataset(file, {
      onSuccess: () => {
        setFile(null);
        // Reset input
        const input = document.getElementById('file') as HTMLInputElement;
        if (input) input.value = '';
      }
    });
  };

  // Cargar datos del dataset seleccionado
  const handleDatasetClick = async (datasetId: string) => {
    setSelectedDataset(datasetId);
    setLoadingData(true);
    
    try {
      const response = await getDataset(datasetId);
      if (response.success && response.preview) {
        // Cargar solo las primeras 10 filas
        const initialData = response.preview.slice(0, 10);
        setDatasetData(initialData);
        setDatasetColumns(Object.keys(response.preview[0] || {}));
      } else {
        setDatasetData([]);
        setDatasetColumns([]);
      }
    } catch (error) {
      console.error('Error al cargar dataset:', error);
      setDatasetData([]);
      setDatasetColumns([]);
    } finally {
      setLoadingData(false);
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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Cargar Datos
        </h1>
        <p className="mt-2 text-muted-foreground">
          Sube tus datasets en formato CSV o JSON para procesamiento
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Card */}
        <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-soft">
          <CardHeader>
            <CardTitle>Seleccionar Archivo</CardTitle>
            <CardDescription>Formatos soportados: CSV, JSON</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="file">Archivo de Datos</Label>
              <Input
                id="file"
                type="file"
                accept=".csv,.json"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>

            {file && (
              <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                {file.name.endsWith('.json') ? (
                  <FileJson className="h-8 w-8 text-primary" />
                ) : (
                  <FileText className="h-8 w-8 text-primary" />
                )}
                <div className="flex-1">
                  <p className="font-medium text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300"
              size="lg"
            >
              {isUploading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Cargando...
                </>
              ) : (
                <>
                  <UploadIcon className="mr-2 h-5 w-5" />
                  Cargar Dataset
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-soft">
          <CardHeader>
            <CardTitle>Proceso de Carga</CardTitle>
            <CardDescription>Qué sucede al cargar tus datos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow">
                <span className="text-sm font-bold text-white">1</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Validación del Archivo</p>
                <p className="text-sm text-muted-foreground">
                  Se verifica el formato y estructura
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-purple-500">
                <span className="text-sm font-bold text-white">2</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Transferencia Segura</p>
                <p className="text-sm text-muted-foreground">
                  Datos enviados al backend encriptados
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-emerald-400">
                <span className="text-sm font-bold text-white">3</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Almacenamiento</p>
                <p className="text-sm text-muted-foreground">
                  Se guarda en la base de datos externa
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-secondary/20 bg-secondary/5 p-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Pandas & NumPy</p>
                  <p className="text-sm text-muted-foreground">
                    El backend procesará automáticamente con pandas y NumPy para análisis inicial
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Datasets Cargados */}
      <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-soft">
        <CardHeader>
          <CardTitle>Datasets Cargados</CardTitle>
          <CardDescription>
            {isLoading ? 'Cargando...' : `${datasets.length} datasets disponibles`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : datasets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay datasets cargados aún
            </div>
          ) : (
            <div className="space-y-3">
              {datasets.map((dataset) => (
                <div
                  key={dataset.id}
                  className={`flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-4 transition-all hover:bg-muted/50 cursor-pointer ${
                    selectedDataset === dataset.id ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handleDatasetClick(dataset.id)}
                >
                  <div className="rounded-lg bg-gradient-to-br from-primary to-accent p-2">
                    <Table className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{dataset.file_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {dataset.rows} filas × {dataset.columns} columnas
                    </p>
                  </div>
                  <Badge variant={dataset.status === 'trained' ? 'default' : 'secondary'}>
                    {dataset.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDataset(dataset.id);
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabla de Datos */}
      {selectedDataset && (
        <DataTable
          data={datasetData}
          columns={datasetColumns}
          title="Vista de Datos"
          description={`Datos del dataset seleccionado`}
          isLoading={loadingData}
          onRefresh={handleRefresh}
          showPagination={false}
          pageSize={10}
        />
      )}
    </div>
  );
}
