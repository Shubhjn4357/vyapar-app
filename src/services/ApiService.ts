import OfflineService from './OfflineService';
import { API_BASE_URL } from '../config/api';

export interface ApiRequestConfig {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  headers?: Record<string, string>;
  token?: string;
  cacheKey?: string;
  cacheExpirationMinutes?: number;
  offlineAction?: {
    type: 'CREATE' | 'UPDATE' | 'DELETE';
    maxRetries?: number;
  };
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  fromCache?: boolean;
}

class ApiService {
  private static instance: ApiService;
  private offlineService: OfflineService;

  private constructor() {
    this.offlineService = OfflineService.getInstance();
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  async request<T = any>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    const {
      endpoint,
      method,
      data,
      headers = {},
      token,
      cacheKey,
      cacheExpirationMinutes,
      offlineAction,
    } = config;

    const url = `${API_BASE_URL}${endpoint}`;
    const isOnline = this.offlineService.getNetworkStatus();

    // Add authorization header if token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    headers['Content-Type'] = 'application/json';

    // Handle offline scenarios
    if (!isOnline) {
      // For GET requests, try to return cached data
      if (method === 'GET' && cacheKey) {
        const cachedData = this.offlineService.getCachedData(cacheKey);
        if (cachedData) {
          return {
            data: cachedData,
            status: 200,
            fromCache: true,
          };
        }
      }

      // For write operations, queue them for later
      if (offlineAction && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
        await this.offlineService.addPendingAction({
          type: offlineAction.type,
          endpoint: url,
          method: method as 'POST' | 'PUT' | 'DELETE' | 'PATCH',
          data,
          maxRetries: offlineAction.maxRetries || 3,
        });

        // Return a mock success response for offline actions
        return {
          data: data || {},
          status: 202, // Accepted - will be processed later
          message: 'Action queued for when online',
        };
      }

      throw new Error('No internet connection and no cached data available');
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();

      // Cache successful GET responses
      if (method === 'GET' && cacheKey && responseData) {
        await this.offlineService.cacheData(cacheKey, responseData, cacheExpirationMinutes);
      }

      return {
        data: responseData,
        status: response.status,
      };
    } catch (error) {
      // If request fails and we have cached data for GET requests, return it
      if (method === 'GET' && cacheKey) {
        const cachedData = this.offlineService.getCachedData(cacheKey);
        if (cachedData) {
          return {
            data: cachedData,
            status: 200,
            fromCache: true,
            message: 'Returned cached data due to network error',
          };
        }
      }

      throw error;
    }
  }

  // Convenience methods
  async get<T = any>(
    endpoint: string,
    token?: string,
    cacheKey?: string,
    cacheExpirationMinutes?: number
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      endpoint,
      method: 'GET',
      token,
      cacheKey,
      cacheExpirationMinutes,
    });
  }

  async post<T = any>(
    endpoint: string,
    data: any,
    token?: string,
    offlineAction?: { type: 'CREATE'; maxRetries?: number }
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      endpoint,
      method: 'POST',
      data,
      token,
      offlineAction,
    });
  }

  async put<T = any>(
    endpoint: string,
    data: any,
    token?: string,
    offlineAction?: { type: 'UPDATE'; maxRetries?: number }
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      endpoint,
      method: 'PUT',
      data,
      token,
      offlineAction,
    });
  }

  async delete<T = any>(
    endpoint: string,
    token?: string,
    offlineAction?: { type: 'DELETE'; maxRetries?: number }
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      endpoint,
      method: 'DELETE',
      token,
      offlineAction,
    });
  }

  async patch<T = any>(
    endpoint: string,
    data: any,
    token?: string,
    offlineAction?: { type: 'UPDATE'; maxRetries?: number }
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      endpoint,
      method: 'PATCH',
      data,
      token,
      offlineAction,
    });
  }
}

export default ApiService;