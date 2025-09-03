import { environment } from '../config/environment';
import {
  LoginRequest,
  LoginResponse,
  DashboardOverview,
  ServerOverview,
  ActiveAlert,
  SecurityEvent,
  AlertDefinition,
  MetricSummary,
} from '../types';

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = environment.apiBaseUrl;
    this.token = localStorage.getItem('authToken');
    
    if (environment.enableDebugLogs) {
      console.log('🔧 ApiService: Initialized with baseUrl:', this.baseUrl);
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    if (environment.enableDebugLogs) {
      console.log(`📡 API Request: ${options.method || 'GET'} ${url}`);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (environment.enableDebugLogs) {
        console.log(`📡 API Response: ${response.status} ${response.statusText} for ${url}`);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error: ${response.status}`, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (environment.enableDebugLogs) {
        console.log(`✅ API Success: ${url}`, data);
      }
      
      return data;
    } catch (error) {
      console.error(`❌ API Request Failed: ${url}`, error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/api/Auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.token) {
      this.token = response.token;
      localStorage.setItem('authToken', response.token);
    }

    return response;
  }

  async refreshToken(): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/api/Auth/refresh', {
      method: 'POST',
    });

    if (response.token) {
      this.token = response.token;
      localStorage.setItem('authToken', response.token);
    }

    return response;
  }

  async logout(): Promise<void> {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Dashboard endpoints
  async getDashboardOverview(serverId?: number): Promise<DashboardOverview> {
    const params = serverId ? `?serverId=${serverId}` : '';
    return this.request<DashboardOverview>(`/api/Dashboard/overview${params}`);
  }

  async getServers(): Promise<ServerOverview[]> {
    return this.request<ServerOverview[]>('/api/Dashboard/servers');
  }

  async getServerById(serverId: number): Promise<ServerOverview> {
    return this.request<ServerOverview>(`/api/Dashboard/servers/${serverId}`);
  }

  async getServerMetrics(serverId: number): Promise<MetricSummary[]> {
    return this.request<MetricSummary[]>(`/api/Dashboard/metrics/${serverId}`);
  }

  // Alert endpoints
  async getActiveAlerts(serverId?: number): Promise<ActiveAlert[]> {
    const params = serverId ? `?serverId=${serverId}` : '';
    return this.request<ActiveAlert[]>(`/api/Alerts${params}`);
  }

  async getAlertDefinitions(): Promise<AlertDefinition[]> {
    return this.request<AlertDefinition[]>('/api/Alerts/definitions');
  }

  async acknowledgeAlert(alertId: number): Promise<void> {
    return this.request<void>(`/api/Alerts/${alertId}/acknowledge`, {
      method: 'POST',
    });
  }

  // Security events
  async getSecurityEvents(serverId?: number): Promise<SecurityEvent[]> {
    const params = serverId ? `?serverId=${serverId}` : '';
    return this.request<SecurityEvent[]>(`/api/security/events${params}`);
  }

  // Test endpoint
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.request<any>('/api/Dashboard/servers');
      return {
        success: true,
        message: `Connection successful! Found ${Array.isArray(response) ? response.length : 0} servers.`
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const apiService = new ApiService();