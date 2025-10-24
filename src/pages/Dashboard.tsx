import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, TrendingUp, Activity, Zap, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "@/hooks/useDashboard";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function Dashboard() {
  const navigate = useNavigate();
  const { stats, loadingStats, activity, loadingActivity, isBackendOnline } = useDashboard();

  // Preparar stats
  const statsData = [
    {
      title: "Datasets Cargados",
      value: stats?.total_datasets?.toString() || "0",
      change: `${stats?.total_cleaned_datasets || 0} limpios`,
      icon: Database,
      gradient: "from-primary to-primary-glow",
    },
    {
      title: "Modelos Entrenados",
      value: stats?.total_models?.toString() || "0",
      change: "Disponibles",
      icon: TrendingUp,
      gradient: "from-secondary to-emerald-400",
    },
    {
      title: "Almacenamiento",
      value: `${stats?.storage_used_mb?.toFixed(1) || "0"}MB`,
      change: "Usado",
      icon: Activity,
      gradient: "from-accent to-purple-400",
    },
    {
      title: "Estado Backend",
      value: isBackendOnline ? "Online" : "Offline",
      change: isBackendOnline ? "Conectado" : "Desconectado",
      icon: Zap,
      gradient: isBackendOnline ? "from-green-500 to-emerald-500" : "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          Dashboard ML
        </h1>
        <p className="mt-2 text-muted-foreground">
          Sistema de gestión y entrenamiento de modelos de Machine Learning
        </p>
      </div>

      {/* Backend Status Alert */}
      {!isBackendOnline && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No se puede conectar con el backend. Asegúrate de que esté ejecutándose en http://localhost:8000
          </AlertDescription>
        </Alert>
      )}

      {isBackendOnline && (
        <Alert className="border-green-500/50 bg-green-500/10">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700 dark:text-green-400">
            Backend conectado correctamente
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loadingStats ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border-border/50 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-3">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))
        ) : (
          statsData.map((stat, index) => (
            <Card
              key={stat.title}
              className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-lg bg-gradient-to-br ${stat.gradient} p-2 shadow-glow`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-soft">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Comienza tu flujo de trabajo ML</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => navigate("/upload")}
              className="w-full justify-start bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300"
              size="lg"
            >
              <Database className="mr-2 h-5 w-5" />
              Cargar Nuevo Dataset
            </Button>
            <Button
              onClick={() => navigate("/clean")}
              variant="secondary"
              className="w-full justify-start"
              size="lg"
            >
              <Activity className="mr-2 h-5 w-5" />
              Limpiar y Preprocesar
            </Button>
            <Button
              onClick={() => navigate("/train")}
              variant="outline"
              className="w-full justify-start border-accent/50 hover:bg-accent/10 hover:border-accent"
              size="lg"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Entrenar Modelo
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-soft">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas operaciones del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingActivity ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : activity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay actividad reciente
              </div>
            ) : (
              <div className="space-y-4">
                {activity.slice(0, 5).map((act, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/30 p-3 transition-all hover:bg-muted/50"
                  >
                    <div className={`rounded-full bg-gradient-to-br ${
                      act.type === 'dataset' ? 'from-primary to-accent' : 'from-secondary to-emerald-400'
                    } p-2`}>
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-foreground">{act.name}</p>
                      <p className="text-xs text-muted-foreground">{act.action}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {act.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {act.timestamp && formatDistanceToNow(new Date(act.timestamp), { 
                        addSuffix: true, 
                        locale: es 
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Technology Stack Info */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Stack Tecnológico
          </CardTitle>
          <CardDescription>Librerías de Python integradas en el backend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {["Pandas", "NumPy", "PyTorch", "Scikit-learn"].map((tech) => (
              <div
                key={tech}
                className="rounded-lg border border-border/50 bg-card/50 p-4 text-center backdrop-blur-sm transition-all hover:scale-105 hover:border-primary/50"
              >
                <p className="font-semibold text-foreground">{tech}</p>
                <p className="mt-1 text-xs text-muted-foreground">Integrado</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
