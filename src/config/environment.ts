interface EnvironmentConfig {
  apiBaseUrl: string;
  signalrHubUrl: string;
  appName: string;
  appVersion: string;
  enableSignalR: boolean;
  enableDebugLogs: boolean;
  dashboardRefreshInterval: number;
  alertsRefreshInterval: number;
  defaultChartHours: number;
  maxChartPoints: number;
  sessionTimeout: number;
  tokenRefreshInterval: number;
}

class Environment {
  private static instance: Environment;
  private config: EnvironmentConfig;

  private constructor() {
    this.config = {
      // Change to HTTPS and correct port
      apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'https://localhost:7001',
      signalrHubUrl: process.env.REACT_APP_SIGNALR_HUB_URL || 'https://localhost:7001/auditHub',
      appName: process.env.REACT_APP_NAME || 'SQL Server Audit Dashboard',
      appVersion: process.env.REACT_APP_VERSION || '1.0.0',
      enableSignalR: process.env.REACT_APP_ENABLE_SIGNALR === 'true' || true,
      enableDebugLogs: process.env.NODE_ENV === 'development' || process.env.REACT_APP_ENABLE_DEBUG_LOGS === 'true',
      dashboardRefreshInterval: parseInt(process.env.REACT_APP_DASHBOARD_REFRESH_INTERVAL || '30000'),
      alertsRefreshInterval: parseInt(process.env.REACT_APP_ALERTS_REFRESH_INTERVAL || '15000'),
      defaultChartHours: parseInt(process.env.REACT_APP_DEFAULT_CHART_HOURS || '24'),
      maxChartPoints: parseInt(process.env.REACT_APP_MAX_CHART_POINTS || '100'),
      sessionTimeout: parseInt(process.env.REACT_APP_SESSION_TIMEOUT || '1800000'), // 30 minutes
      tokenRefreshInterval: parseInt(process.env.REACT_APP_TOKEN_REFRESH_INTERVAL || '300000'), // 5 minutes
    };
  }

  public static getInstance(): Environment {
    if (!Environment.instance) {
      Environment.instance = new Environment();
    }
    return Environment.instance;
  }

  public get apiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }

  public get signalrHubUrl(): string {
    return this.config.signalrHubUrl;
  }

  public get appName(): string {
    return this.config.appName;
  }

  public get appVersion(): string {
    return this.config.appVersion;
  }

  public get enableSignalR(): boolean {
    return this.config.enableSignalR;
  }

  public get enableDebugLogs(): boolean {
    return this.config.enableDebugLogs;
  }

  public get dashboardRefreshInterval(): number {
    return this.config.dashboardRefreshInterval;
  }

  public get alertsRefreshInterval(): number {
    return this.config.alertsRefreshInterval;
  }

  public get defaultChartHours(): number {
    return this.config.defaultChartHours;
  }

  public get maxChartPoints(): number {
    return this.config.maxChartPoints;
  }

  public get sessionTimeout(): number {
    return this.config.sessionTimeout;
  }

  public get tokenRefreshInterval(): number {
    return this.config.tokenRefreshInterval;
  }

  public isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  public isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }
}

export const environment = Environment.getInstance();