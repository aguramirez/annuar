// src/common/services/statsService.ts
import { apiRequest } from './apiClient';

export interface SalesStatsResponse {
  totalSales: number;
  ticketSales: number;
  productSales: number;
  salesByDay: {
    date: string;
    sales: number;
    tickets: number;
  }[];
  averageTicketPrice: number;
}

export interface AttendanceStatsResponse {
  totalAttendance: number;
  attendanceByDay: {
    date: string;
    attendance: number;
  }[];
  attendanceByMovie: {
    movieId: string;
    movieTitle: string;
    attendance: number;
  }[];
  occupancyRate: number;
}

export interface MovieStatsResponse {
  movieId: string;
  movieTitle: string;
  ticketsSold: number;
  revenue: number;
  showCount: number;
  averageOccupancy: number;
}

export interface ProductStatsResponse {
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
}

export interface TimeAnalysisResponse {
  busyDays: {
    day: string;
    attendance: number;
  }[];
  busyHours: {
    hour: string;
    attendance: number;
  }[];
}

const statsService = {
  // Obtener estadísticas de ventas
  getSalesStats: async (cinemaId: string, startDate: string, endDate: string): Promise<SalesStatsResponse> => {
    return apiRequest<SalesStatsResponse>({
      method: 'GET',
      url: '/admin/stats/sales',
      params: { cinemaId, startDate, endDate },
    });
  },

  // Obtener estadísticas de asistencia
  getAttendanceStats: async (cinemaId: string, startDate: string, endDate: string): Promise<AttendanceStatsResponse> => {
    return apiRequest<AttendanceStatsResponse>({
      method: 'GET',
      url: '/admin/stats/attendance',
      params: { cinemaId, startDate, endDate },
    });
  },

  // Obtener estadísticas de películas
  getTopMoviesStats: async (cinemaId: string, startDate: string, endDate: string, limit: number = 10): Promise<MovieStatsResponse[]> => {
    return apiRequest<MovieStatsResponse[]>({
      method: 'GET',
      url: '/admin/stats/movies',
      params: { cinemaId, startDate, endDate, limit },
    });
  },

  // Obtener estadísticas de productos
  getTopProductsStats: async (cinemaId: string, startDate: string, endDate: string, limit: number = 10): Promise<ProductStatsResponse[]> => {
    return apiRequest<ProductStatsResponse[]>({
      method: 'GET',
      url: '/admin/stats/products',
      params: { cinemaId, startDate, endDate, limit },
    });
  },

  // Obtener análisis de tiempo
  getTimeAnalysis: async (cinemaId: string, startDate: string, endDate: string): Promise<TimeAnalysisResponse> => {
    return apiRequest<TimeAnalysisResponse>({
      method: 'GET',
      url: '/admin/stats/time-analysis',
      params: { cinemaId, startDate, endDate },
    });
  },

  // Obtener datos para exportar
  getExportData: async (cinemaId: string, startDate: string, endDate: string, type: string): Promise<any[]> => {
    return apiRequest<any[]>({
      method: 'GET',
      url: '/admin/stats/export',
      params: { cinemaId, startDate, endDate, type },
    });
  },
};

export default statsService;