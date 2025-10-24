/**
 * Hook para el dashboard
 */

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';

export const useDashboard = () => {
  // Estadísticas
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats,
    refetchInterval: 30000, // Refrescar cada 30 segundos
    retry: 1,
  });
  
  // Actividad reciente
  const { data: activity, isLoading: loadingActivity } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: dashboardService.getRecentActivity,
    refetchInterval: 30000,
    retry: 1,
  });
  
  // Info del sistema
  const { data: systemInfo } = useQuery({
    queryKey: ['system-info'],
    queryFn: dashboardService.getSystemInfo,
    retry: 1,
  });
  
  // Health check
  const { data: health } = useQuery({
    queryKey: ['health'],
    queryFn: dashboardService.healthCheck,
    refetchInterval: 60000, // Cada minuto
    retry: 2,
  });
  
  return {
    stats: stats?.stats,
    loadingStats,
    activity: activity?.activities || [],
    loadingActivity,
    systemInfo: systemInfo?.info,
    health,
    isBackendOnline: !!health?.status,
  };
};



