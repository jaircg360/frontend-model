import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Server, Database, Key } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const handleSave = () => {
    toast.success("Configuración guardada", {
      description: "Conexiones actualizadas exitosamente",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Configuración
        </h1>
        <p className="mt-2 text-muted-foreground">
          Gestiona las conexiones al backend y base de datos externa
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* API Configuration */}
        <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              Conexión Backend
            </CardTitle>
            <CardDescription>Configuración del servidor de procesamiento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-url">URL del API</Label>
              <Input
                id="api-url"
                placeholder="https://api.tu-servidor.com"
                defaultValue="https://api.ml-system.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="••••••••••••••••"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-3">
              <div>
                <p className="text-sm font-medium">Conexión SSL</p>
                <p className="text-xs text-muted-foreground">Encriptación de datos</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Database Configuration */}
        <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-secondary" />
              Base de Datos Externa
            </CardTitle>
            <CardDescription>Configuración de almacenamiento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="db-host">Host</Label>
              <Input
                id="db-host"
                placeholder="db.tu-servidor.com"
                defaultValue="db.ml-system.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="db-port">Puerto</Label>
                <Input id="db-port" placeholder="5432" defaultValue="5432" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-name">Base de Datos</Label>
                <Input id="db-name" placeholder="ml_data" defaultValue="ml_data" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="db-user">Usuario</Label>
              <Input id="db-user" placeholder="admin" defaultValue="ml_admin" />
            </div>
          </CardContent>
        </Card>

        {/* Python Libraries */}
        <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-accent" />
              Librerías Python
            </CardTitle>
            <CardDescription>Versiones instaladas en el backend</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-3">
              <div>
                <p className="font-medium text-foreground">pandas</p>
                <p className="text-xs text-muted-foreground">Manipulación de datos</p>
              </div>
              <span className="text-sm font-mono text-primary">2.1.4</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-3">
              <div>
                <p className="font-medium text-foreground">NumPy</p>
                <p className="text-xs text-muted-foreground">Cálculo numérico</p>
              </div>
              <span className="text-sm font-mono text-primary">1.26.2</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-3">
              <div>
                <p className="font-medium text-foreground">PyTorch</p>
                <p className="text-xs text-muted-foreground">Deep Learning</p>
              </div>
              <span className="text-sm font-mono text-primary">2.1.0</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-3">
              <div>
                <p className="font-medium text-foreground">Scikit-learn</p>
                <p className="text-xs text-muted-foreground">Machine Learning</p>
              </div>
              <span className="text-sm font-mono text-primary">1.3.2</span>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-secondary/10 shadow-soft">
          <CardHeader>
            <CardTitle>Estado del Sistema</CardTitle>
            <CardDescription>Monitoreo de conexiones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-3">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-secondary animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-foreground">Backend API</p>
                  <p className="text-xs text-muted-foreground">Operativo</p>
                </div>
              </div>
              <span className="text-xs font-mono text-muted-foreground">200ms</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-3">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-secondary animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-foreground">Base de Datos</p>
                  <p className="text-xs text-muted-foreground">Conectada</p>
                </div>
              </div>
              <span className="text-xs font-mono text-muted-foreground">45ms</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-3">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-secondary animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-foreground">Python Runtime</p>
                  <p className="text-xs text-muted-foreground">Activo</p>
                </div>
              </div>
              <span className="text-xs font-mono text-muted-foreground">Python 3.11</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300"
          size="lg"
        >
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
}
