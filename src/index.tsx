// ============================================================================
// TYPE DEFINITIONS (src/types/index.ts)
// ============================================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

console.log('🏁 Index: Starting React app...');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Authentication Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresAt: string;
}

export interface User {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  lastLoginDate?: string;
}

// Server Types
export interface ServerOverview {
  serverID: number;
  serverName: string;
  status: 'Online' | 'Warning' | 'Offline';
  environment: string;
  alertCount: number;
  lastUpdated: string;
}

export interface ServerStatus {
  totalServers: number;
  onlineServers: number;
  warningServers: number;
  offlineServers: number;
}

// Dashboard Types
export interface DashboardOverview {
  totalServers: number;
  activeServers: number;
  totalAlerts: number;
  criticalAlerts: number;
  serverStatus: ServerStatus;
  serverStatuses: ServerOverview[];
  recentAlerts: ActiveAlert[];
  activeAlerts: ActiveAlert[];
  latestMetrics: MetricSummary[];
  metricSummaries: MetricSummary[];
  topDatabases: DatabaseSummary[];
  databaseSummaries: DatabaseSummary[];
  slowQueries: SlowQuery[];
  recentSecurityEvents: SecurityEventSummary[];
}

// Metric Types
export interface MetricSummary {
  metricID: number;
  serverID: number;
  serverName: string;
  metricName: string;
  metricType: string;
  value: number;
  unit: string;
  timestamp: string;
  threshold?: number;
  status?: 'Normal' | 'Warning' | 'Critical';
}

// Alert Types
export interface ActiveAlert {
  alertId: number;
  alertName: string;
  serverName: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  message: string;
  timestamp: string;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

// Database Types
export interface DatabaseSummary {
  databaseID: number;
  databaseName: string;
  serverName: string;
  sizeGB: number;
  usedSpaceGB: number;
  freeSpaceGB: number;
  growthRate: number;
  lastUpdated: string;
}

// Security Types
export interface SecurityEvent {
  eventID: number;
  serverName: string;
  databaseName: string;
  eventType: string;
  severity: string;
  userPrincipal: string;
  timestamp: string;
  details: string;
}

export interface SecurityEventSummary {
  eventType: string;
  severity: string;
  count: number;
  lastOccurrence: string;
}

// Query Types
export interface SlowQuery {
  queryID: number;
  serverName: string;
  databaseName: string;
  queryText: string;
  durationMs: number;
  executionTime: string;
  userPrincipal: string;
  cpuTime: number;
  logicalReads: number;
}

// Chart Types
export interface ChartDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Environment Types
export interface EnvironmentConfig {
  apiBaseUrl: string;
  signalrHubUrl: string;
  appName: string;
  appVersion: string;
  enableSignalR: boolean;
  enableDebugLogs: boolean;
  dashboardRefreshInterval: number;
  alertsRefreshInterval: number;
}