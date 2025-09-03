// Authentication Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: number;
  success?: boolean;
}

export interface User {
  userID: number;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

// Server Types
export interface ServerOverview {
  serverID: number;
  serverName: string;
  status: ServerStatusType; // Use the type alias
  lastSeen: string;
  alertCount: number;
  connectionString?: string;
  description?: string;
  isActive: boolean;
}

export interface ServerStatusSummary {
  totalServers: number;
  onlineServers: number;
  warningServers: number;
  offlineServers: number;
}

// Alert Types
export interface ActiveAlert {
  alertID: number;
  alertName: string;
  serverName: string;
  severity: SeverityLevel;
  message: string;
  timestamp: string;
  isAcknowledged: boolean;
  alertType?: string;
  serverID?: number;
}

export interface AlertSummary {
  alertID: number;
  alertName: string;
  serverName: string;
  alertType: string;
  severity: SeverityLevel;
  message: string;
  timestamp: string;
  isAcknowledged: boolean;
}

export interface AlertDefinition {
  alertID: number;
  alertName: string;
  alertType: AlertType;
  description: string;
  severity: SeverityLevel;
  isEnabled: boolean;
  conditions: AlertCondition[];
}

export interface AlertCondition {
  conditionID: number;
  metricName: string;
  operator: 'GreaterThan' | 'LessThan' | 'Equals' | 'NotEquals';
  threshold: number;
  timeWindow: number;
}

// Metric Types
export interface MetricSummary {
  metricID: number;
  metricName: string;
  metricType: string;
  value: number;
  unit: string;
  timestamp: string;
  serverName: string;
  serverID: number;
}

export interface PerformanceMetric {
  metricID: number;
  serverID: number;
  metricName: string;
  metricType: string;
  value: number;
  unit: string;
  timestamp: string;
  thresholdValue?: number;
  isAlert: boolean;
}

// Security Types
export interface SecurityEvent {
  eventID: number;
  serverName: string;
  eventType: string;
  severity: SeverityLevel;
  description: string;
  timestamp: string;
  sourceIP?: string;
  userName?: string;
  databaseName?: string;
}

// Database Types
export interface DatabaseSummary {
  databaseID: number;
  databaseName: string;
  serverName: string;
  sizeGB: number;
  status: string;
  lastBackup: string;
  growthRate: number;
}

export interface SlowQuery {
  queryID: number;
  serverName: string;
  databaseName: string;
  queryText: string;
  executionTime: number;
  timestamp: string;
  frequency: number;
  avgCPU: number;
  avgIO: number;
}

// Dashboard Types
export interface DashboardOverview {
  serverStatus: ServerStatusSummary;
  activeAlerts: AlertSummary[];
  latestMetrics: MetricSummary[];
  topDatabases: DatabaseSummary[];
  slowQueries: SlowQuery[];
  recentSecurityEvents: SecurityEvent[];
  lastUpdated: string;
}

// Chart and UI Types
export interface ChartDataPoint {
  timestamp: string;
  value: number;
  label?: string;
  color?: string;
}

export interface MetricChartData {
  metricName: string;
  data: ChartDataPoint[];
  unit: string;
  color: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Filter and Search Types
export interface ServerFilter {
  status?: ServerStatusType[];
  search?: string;
  sortBy?: 'serverName' | 'status' | 'lastSeen' | 'alertCount';
  sortDirection?: 'asc' | 'desc';
}

export interface AlertFilter {
  severity?: SeverityLevel[];
  acknowledged?: boolean;
  serverID?: number;
  alertType?: AlertType[];
  dateFrom?: string;
  dateTo?: string;
}

export interface MetricFilter {
  serverID?: number;
  metricType?: string[];
  dateFrom?: string;
  dateTo?: string;
  timeRange?: '1h' | '6h' | '24h' | '7d' | '30d';
}

// Utility Types
export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
export type ServerStatusType = 'Online' | 'Warning' | 'Offline'; // Renamed to avoid conflict
export type AlertType = 'Performance' | 'Security' | 'Backup' | 'Space' | 'Connection' | 'Custom';
export type UserInfo = User;

// Component Props Types
export interface ServerStatusCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface AlertsPanelProps {
  alerts: AlertSummary[];
  serverId?: number;
  onAcknowledge?: (alertId: number) => void;
}

export interface MetricsChartProps {
  metrics: MetricSummary[];
  serverId?: number;
  height?: number;
}

export interface DatabasePanelProps {
  databases: DatabaseSummary[];
  serverId?: number;
}

export interface SlowQueriesPanelProps {
  queries: SlowQuery[];
  serverId?: number;
}

export interface SecurityEventsPanelProps {
  events: SecurityEvent[];
  serverId?: number;
}

// Form Types
export interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface AlertConfigFormData {
  alertName: string;
  alertType: AlertType;
  severity: SeverityLevel;
  description: string;
  isEnabled: boolean;
  conditions: AlertCondition[];
}

// SignalR Types
export interface SignalRConnection {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  invoke: (methodName: string, ...args: any[]) => Promise<void>;
  on: (methodName: string, callback: (...args: any[]) => void) => void;
  off: (methodName: string, callback?: (...args: any[]) => void) => void;
}

export interface RealTimeUpdate {
  type: 'alert' | 'metric' | 'server_status' | 'security_event';
  data: any;
  timestamp: string;
  serverID?: number;
}

// Error Types
export interface ApiError {
  message: string;
  statusCode: number;
  details?: string;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Settings Types
export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  refreshInterval: number;
  defaultTimeRange: string;
  notifications: {
    email: boolean;
    browser: boolean;
    criticalOnly: boolean;
  };
}

export interface SystemSettings {
  retentionPeriod: number;
  maxAlertsPerServer: number;
  alertCooldown: number;
  metricCollectionInterval: number;
}