import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Computer as ComputerIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';
import { apiService } from '../services/apiService';
import { environment } from '../config/environment';
import { DashboardOverview, ServerOverview, ServerStatusType } from '../types';
import ServerStatusCard from './dashboard/ServerStatusCard';
import MetricsChart from './dashboard/MetricsChart';
import AlertsPanel from './dashboard/AlertsPanel';
import DatabasePanel from './dashboard/DatabasePanel';
import SlowQueriesPanel from './dashboard/SlowQueriesPanel';
import SecurityEventsPanel from './dashboard/SecurityEventsPanel';

// API Test Panel Component
const ApiTestPanel: React.FC = () => {
  const [testResult, setTestResult] = useState<{success: boolean; message: string} | null>(null);
  const [testing, setTesting] = useState(false);

  const testApiConnection = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      console.log('🧪 Testing API connection to:', environment.apiBaseUrl);
      const result = await apiService.testConnection();
      setTestResult(result);
      console.log('🧪 API Test Result:', result);
    } catch (error) {
      console.error('🧪 API Test Error:', error);
      setTestResult({
        success: false,
        message: `Connection failed: ${error instanceof Error ? error.message : String(error)}`
      });
    } finally {
      setTesting(false);
    }
  };

  const testDashboardEndpoint = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      console.log('🧪 Testing Dashboard servers endpoint...');
      const serversResult = await apiService.getServers();
      
      console.log('🧪 Testing Dashboard overview endpoint...');
      const overviewResult = await apiService.getDashboardOverview();
      
      console.log('🧪 Testing Alerts endpoint...');
      let alertsResult;
      try {
        alertsResult = await apiService.getActiveAlerts();
        console.log('🚨 Alerts data loaded successfully:', alertsResult);
      } catch (alertError) {
        console.warn('⚠️ Alerts endpoint failed:', alertError);
        alertsResult = `Failed: ${alertError}`;
      }
      
      setTestResult({
        success: true,
        message: `Dashboard endpoints working! 
        
Servers: ${Array.isArray(serversResult) ? serversResult.length : 0} found
Overview: ${overviewResult ? 'Available' : 'Not Available'}
Alerts: ${Array.isArray(alertsResult) ? `${alertsResult.length} alerts` : alertsResult}

Detailed data logged to console.`
      });
    } catch (error) {
      console.error('🧪 Dashboard Test Error:', error);
      setTestResult({
        success: false,
        message: `Dashboard endpoint failed: ${error instanceof Error ? error.message : String(error)}`
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Accordion sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          <ScienceIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          API Connection Test
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            API Base URL: <strong>{environment.apiBaseUrl}</strong>
          </Typography>
          
          <Box display="flex" gap={2} mb={2}>
            <Button
              variant="contained"
              onClick={testApiConnection}
              disabled={testing}
              startIcon={testing ? <CircularProgress size={20} /> : <CheckIcon />}
              size="small"
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </Button>
            
            <Button
              variant="outlined"
              onClick={testDashboardEndpoint}
              disabled={testing}
              startIcon={testing ? <CircularProgress size={20} /> : <CheckIcon />}
              size="small"
            >
              {testing ? 'Testing...' : 'Test Dashboard API'}
            </Button>
          </Box>
          
          {testResult && (
            <Alert 
              severity={testResult.success ? 'success' : 'error'}
              icon={testResult.success ? <CheckIcon /> : <ErrorIcon />}
            >
              <Typography variant="subtitle2">
                {testResult.success ? 'API Test Successful!' : 'API Test Failed'}
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {testResult.message}
              </Typography>
            </Alert>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [servers, setServers] = useState<ServerOverview[]>([]);
  const [selectedServerId, setSelectedServerId] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async () => {
    console.log('🔄 Dashboard: Starting data fetch...');
    console.log('📍 Dashboard: Selected Server ID:', selectedServerId);
    console.log('🌐 Dashboard: API Base URL:', environment.apiBaseUrl);
    
    try {
      setError(null);
      setIsLoading(true);
      
      console.log('📡 Dashboard: Calling APIs...');
      
      // Call the main APIs
      const [overviewData, serversData] = await Promise.all([
        apiService.getDashboardOverview(selectedServerId),
        apiService.getServers(),
      ]);

      console.log('📊 Dashboard Overview Data:', overviewData);
      console.log('🖥️ Dashboard Servers Data:', serversData);

      // Ensure activeAlerts is at least an empty array to prevent UI errors
      if (overviewData && !overviewData.activeAlerts) {
        overviewData.activeAlerts = [];
      }

      setOverview(overviewData);
      setServers(Array.isArray(serversData) ? serversData : []);
      setLastUpdated(new Date());
      
      console.log('✅ Dashboard: Data loaded successfully');
    } catch (error) {
      console.error('❌ Dashboard fetch error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(`Failed to load dashboard data: ${errorMessage}`);
      setServers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 Dashboard: Component mounted, fetching data...');
    fetchData();
    
    // Set up auto-refresh
    const interval = setInterval(fetchData, environment.dashboardRefreshInterval);
    
    return () => {
      console.log('🛑 Dashboard: Component unmounting, clearing interval');
      clearInterval(interval);
    };
  }, [selectedServerId]);

  const handleRefresh = () => {
    console.log('🔄 Dashboard: Manual refresh triggered');
    setIsLoading(true);
    fetchData();
  };

  const getServerStatusColor = (status: ServerStatusType) => {
    switch (status) {
      case 'Online':
        return 'success';
      case 'Warning':
        return 'warning';
      case 'Offline':
        return 'error';
      default:
        return 'default';
    }
  };

  // Enhanced loading state
  if (isLoading && !overview) {
    console.log('⏳ Dashboard: Showing loading state');
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        sx={{ p: 3 }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Dashboard...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Please wait while we fetch your data
        </Typography>
      </Box>
    );
  }

  // Enhanced error state
  if (error && !overview) {
    console.log('❌ Dashboard: Showing error state:', error);
    return (
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          SQL Server Audit Dashboard
        </Typography>
        
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Dashboard Loading Error
          </Typography>
          <Typography paragraph>
            {error}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              onClick={handleRefresh}
              disabled={isLoading}
              startIcon={<RefreshIcon />}
            >
              {isLoading ? 'Retrying...' : 'Retry Loading'}
            </Button>
          </Box>
        </Alert>
        
        {/* API Test Panel for debugging */}
        <ApiTestPanel />
        
        {/* Debug Information */}
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Debug Information
            </Typography>
            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {`API Base URL: ${environment.apiBaseUrl}
Selected Server ID: ${selectedServerId || 'All Servers'}
Loading: ${isLoading ? 'Yes' : 'No'}
Overview Data: ${overview ? 'Available' : 'Not Available'}
Servers Count: ${servers.length}
Environment: ${environment.isDevelopment() ? 'Development' : 'Production'}
Debug Logs Enabled: ${environment.enableDebugLogs ? 'Yes' : 'No'}`}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // No data state
  if (!overview && !isLoading) {
    console.log('📭 Dashboard: No overview data available');
    return (
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          SQL Server Audit Dashboard
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            No Dashboard Data
          </Typography>
          <Typography paragraph>
            Dashboard data is not available at the moment.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              onClick={handleRefresh}
              startIcon={<RefreshIcon />}
            >
              Refresh Data
            </Button>
          </Box>
        </Alert>
        
        <ApiTestPanel />
      </Box>
    );
  }

  console.log('🎨 Dashboard: Rendering dashboard with data');

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          SQL Server Audit Dashboard
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Typography>
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefresh} disabled={isLoading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Show error as warning if we have data but there was an issue */}
      {error && overview && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Data Refresh Warning
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
      )}

      {/* API Test Panel - Only show in development */}
      {environment.isDevelopment() && (
        <ApiTestPanel />
      )}

      {/* Server Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <ComputerIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Monitored Servers ({servers?.length || 0})
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            <Chip
              label="All Servers"
              variant={selectedServerId === undefined ? "filled" : "outlined"}
              onClick={() => setSelectedServerId(undefined)}
              color="primary"
            />
            {servers && servers.length > 0 ? (
              servers.map((server) => (
                <Chip
                  key={server?.serverID || Math.random()}
                  label={server?.serverName || 'Unknown Server'}
                  variant={selectedServerId === server?.serverID ? "filled" : "outlined"}
                  onClick={() => setSelectedServerId(server?.serverID)}
                  color={getServerStatusColor(server?.status || 'Offline') as any}
                  icon={(server?.alertCount || 0) > 0 ? <WarningIcon /> : undefined}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No servers found
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Server Status Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <ServerStatusCard
            title="Total Servers"
            value={overview?.serverStatus?.totalServers || 0}
            icon={<ComputerIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ServerStatusCard
            title="Online"
            value={overview?.serverStatus?.onlineServers || 0}
            icon={<ComputerIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ServerStatusCard
            title="Warning"
            value={overview?.serverStatus?.warningServers || 0}
            icon={<WarningIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ServerStatusCard
            title="Offline"
            value={overview?.serverStatus?.offlineServers || 0}
            icon={<ComputerIcon />}
            color="error"
          />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Performance Metrics Chart */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Metrics ({overview?.latestMetrics?.length || 0})
              </Typography>
              <MetricsChart 
                metrics={overview?.latestMetrics || []}
                serverId={selectedServerId}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Active Alerts */}
        <Grid item xs={12} lg={4}>
          <AlertsPanel 
            alerts={overview?.activeAlerts || []}
            serverId={selectedServerId}
          />
        </Grid>

        {/* Database Overview */}
        <Grid item xs={12} md={6}>
          <DatabasePanel 
            databases={overview?.topDatabases || []}
            serverId={selectedServerId}
          />
        </Grid>

        {/* Slow Queries */}
        <Grid item xs={12} md={6}>
          <SlowQueriesPanel 
            queries={overview?.slowQueries || []}
            serverId={selectedServerId}
          />
        </Grid>

        {/* Security Events */}
        <Grid item xs={12}>
          <SecurityEventsPanel 
            events={overview?.recentSecurityEvents || []}
            serverId={selectedServerId}
          />
        </Grid>
      </Grid>

      {/* Debug Footer (only show in development) */}
      {environment.isDevelopment() && environment.enableDebugLogs && (
        <Card sx={{ mt: 3, backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Debug Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">
                  <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}<br/>
                  <strong>Error:</strong> {error || 'None'}<br/>
                  <strong>Selected Server:</strong> {selectedServerId || 'All'}<br/>
                  <strong>Servers Count:</strong> {servers.length}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">
                  <strong>Overview Data:</strong> {overview ? 'Available' : 'Not Available'}<br/>
                  <strong>Metrics:</strong> {overview?.latestMetrics?.length || 0}<br/>
                  <strong>Alerts:</strong> {overview?.activeAlerts?.length || 0}<br/>
                  <strong>Databases:</strong> {overview?.topDatabases?.length || 0}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Dashboard;