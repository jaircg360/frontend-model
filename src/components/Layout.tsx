import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Database, FileUp, Sparkles, BarChart3, TrendingUp, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import FloatingChat from "@/components/FloatingChat";

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: Database },
  { name: "Cargar Datos", href: "/upload", icon: FileUp },
  { name: "Limpiar Datos", href: "/clean", icon: Sparkles },
  { name: "Entrenar Modelo", href: "/train", icon: BarChart3 },
  { name: "Análisis", href: "/charts", icon: TrendingUp },
  { name: "Configuración", href: "/settings", icon: Settings },
];

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar shadow-medium">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-glow">
              <Database className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">ML System</h1>
              <p className="text-xs text-sidebar-foreground/60">Data Pipeline</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-soft"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4">
            <div className="rounded-lg bg-sidebar-accent/50 p-3">
              <p className="text-xs font-medium text-sidebar-foreground">API Status</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-secondary animate-pulse"></div>
                <span className="text-xs text-sidebar-foreground/60">Connected</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="pl-64">
        <div className="min-h-screen p-8">{children}</div>
      </main>

      {/* Floating Chat */}
      <FloatingChat />
    </div>
  );
};
