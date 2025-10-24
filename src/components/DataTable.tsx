import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Search, 
  Download, 
  RefreshCw, 
  Eye, 
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react";
import { toast } from "sonner";

interface DataTableProps {
  data: Record<string, any>[];
  columns: string[];
  title?: string;
  description?: string;
  isLoading?: boolean;
  onRefresh?: () => void;
  showPagination?: boolean;
  pageSize?: number;
  className?: string;
  loadMoreData?: () => Promise<void>;
  hasMoreData?: boolean;
  loadingMore?: boolean;
}

export default function DataTable({
  data,
  columns,
  title = "Datos del Dataset",
  description = "Vista previa de los datos cargados",
  isLoading = false,
  onRefresh,
  showPagination = true,
  pageSize = 10,
  className = "",
  loadMoreData,
  hasMoreData = false,
  loadingMore = false
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllColumns, setShowAllColumns] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(columns.slice(0, 5));
  const [displayedRows, setDisplayedRows] = useState(10); // Mostrar solo 10 filas inicialmente
  const [isSearching, setIsSearching] = useState(false);

  // Filtrar datos basado en el término de búsqueda
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      return data.slice(0, displayedRows); // Solo mostrar las filas cargadas cuando no hay búsqueda
    }
    
    setIsSearching(true);
    // Cuando hay búsqueda, buscar en todos los datos disponibles
    return data.filter(row => 
      Object.values(row).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, displayedRows]);

  // Calcular paginación solo cuando hay búsqueda activa
  const totalPages = isSearching ? Math.ceil(filteredData.length / pageSize) : 1;
  const startIndex = isSearching ? (currentPage - 1) * pageSize : 0;
  const endIndex = isSearching ? startIndex + pageSize : filteredData.length;
  const paginatedData = isSearching ? filteredData.slice(startIndex, endIndex) : filteredData;

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Cargar más filas
  const handleLoadMore = async () => {
    if (loadMoreData) {
      await loadMoreData();
      setDisplayedRows(prev => prev + 10);
    }
  };

  // Resetear filas mostradas cuando cambian los datos
  useEffect(() => {
    setDisplayedRows(10);
    setCurrentPage(1);
  }, [data.length]);

  // Alternar visibilidad de columnas
  const toggleColumnVisibility = (column: string) => {
    if (visibleColumns.includes(column)) {
      setVisibleColumns(prev => prev.filter(col => col !== column));
    } else {
      setVisibleColumns(prev => [...prev, column]);
    }
  };

  // Mostrar todas las columnas
  const toggleAllColumns = () => {
    if (showAllColumns) {
      setVisibleColumns(columns.slice(0, 5));
      setShowAllColumns(false);
    } else {
      setVisibleColumns(columns);
      setShowAllColumns(true);
    }
  };

  // Exportar datos filtrados
  const exportData = () => {
    try {
      const csvContent = [
        visibleColumns.join(','),
        ...filteredData.map(row => 
          visibleColumns.map(col => `"${row[col] || ''}"`).join(',')
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `datos_filtrados_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Datos exportados exitosamente');
    } catch (error) {
      toast.error('Error al exportar datos');
    }
  };

  if (isLoading) {
    return (
      <Card className={`border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-soft ${className}`}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <span className="ml-3 text-muted-foreground">Cargando datos...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className={`border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-soft ${className}`}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <EyeOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay datos para mostrar</p>
            <p className="text-sm mt-2">
              {isLoading ? 'Cargando datos...' : 'Selecciona un dataset para ver los datos aquí'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-soft ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              {title}
            </CardTitle>
            <CardDescription>
              {description} • {data.length.toLocaleString()} filas • {columns.length} columnas
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Actualizar
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={exportData}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Barra de búsqueda y controles */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en todos los datos..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset a la primera página al buscar
              }}
              className="pl-10"
            />
            {searchTerm && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="h-6 w-6 p-0 hover:bg-muted"
                >
                  ×
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAllColumns}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              {showAllColumns ? 'Ocultar' : 'Mostrar'} Columnas
            </Button>
            
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                <Filter className="h-3 w-3" />
                {filteredData.length} de {data.length}
              </Badge>
            )}
          </div>
        </div>

        {/* Selector de columnas visibles */}
        {!showAllColumns && (
          <div className="flex flex-wrap gap-2">
            {columns.map(column => (
              <Button
                key={column}
                variant={visibleColumns.includes(column) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleColumnVisibility(column)}
                className="text-xs"
              >
                {column}
              </Button>
            ))}
          </div>
        )}

        {/* Tabla de datos */}
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  {visibleColumns.map(column => (
                    <TableHead key={column} className="font-semibold">
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Search className="h-8 w-8 opacity-50" />
                        <p className="font-medium">No se encontraron resultados</p>
                        <p className="text-sm">
                          {searchTerm ? `No hay datos que coincidan con "${searchTerm}"` : 'No hay datos para mostrar'}
                        </p>
                        {searchTerm && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSearchTerm("")}
                            className="mt-2"
                          >
                            Limpiar búsqueda
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row, index) => (
                    <TableRow key={startIndex + index} className="hover:bg-muted/20">
                      {visibleColumns.map(column => (
                        <TableCell key={column} className="max-w-xs truncate">
                          <span title={String(row[column] || '')}>
                            {String(row[column] || '')}
                          </span>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Paginación y Cargar más */}
        {!isSearching ? (
          // Botón "Cargar más" cuando no hay búsqueda
          <div className="flex items-center justify-center">
            {hasMoreData && loadMoreData && (
              <Button
                onClick={loadMoreData}
                disabled={loadingMore}
                variant="outline"
                className="gap-2"
              >
                {loadingMore ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Cargando...
                  </>
                ) : (
                  <>
                    <ChevronRight className="h-4 w-4" />
                    Cargar más filas (10 más)
                  </>
                )}
              </Button>
            )}
            <div className="text-sm text-muted-foreground ml-4">
              Mostrando {data.length} filas
            </div>
          </div>
        ) : (
          // Paginación tradicional cuando hay búsqueda
          showPagination && totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredData.length)} de {filteredData.length} resultados
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
