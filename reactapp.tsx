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

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Server Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <ComputerIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Monitored Servers
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            <Chip
              label="All Servers"
              variant={selectedServerId === undefined ? "filled" : "outlined"}
              onClick={() => setSelectedServerId(undefined)}
              color="primary"
            />
            {servers.map((server) => (
              <Chip
                key={server.serverID}
                label={server.serverName}
                variant={selectedServerId === server.serverID ? "filled" : "outlined"}
                onClick={() => setSelectedServerId(server.serverID)}
                color={getServerStatusColor(server.status) as any}
                icon={server.alertCount > 0 ? <WarningIcon /> : undefined}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {overview && (
        <>
          {/* Server Status Overview */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <ServerStatusCard
                title="Total Servers"
                value={overview.serverStatus.totalServers}
                icon={<ComputerIcon />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ServerStatusCard
                title="Online"
                value={overview.serverStatus.onlineServers}
                icon={<ComputerIcon />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ServerStatusCard
                title="Warning"
                value={overview.serverStatus.warningServers}
                icon={<WarningIcon />}
                color="warning"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ServerStatusCard
                title="Offline"
                value={overview.serverStatus.offlineServers}
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
                    Performance Metrics
                  </Typography>
                  <MetricsChart 
                    metrics={overview.latestMetrics}
                    serverId={selectedServerId}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Active Alerts */}
            <Grid item xs={12} lg={4}>
              <AlertsPanel 
                alerts={overview.activeAlerts}
                serverId={selectedServerId}
              />
            </Grid>

            {/* Database Overview */}
            <Grid item xs={12} md={6}>
              <DatabasePanel 
                databases={overview.topDatabases}
                serverId={selectedServerId}
              />
            </Grid>

            {/* Slow Queries */}
            <Grid item xs={12} md={6}>
              <SlowQueriesPanel 
                queries={overview.slowQueries}
                serverId={selectedServerId}
              />
            </Grid>

            {/* Security Events */}
            <Grid item xs={12}>
              <SecurityEventsPanel 
                events={overview.recentSecurityEvents}
                serverId={selectedServerId}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard;

// ============================================================================
// SERVER STATUS CARD COMPONENT (src/components/dashboard/ServerStatusCard.tsx)
// ============================================================================

import React from 'react';
import { Card, CardContent, Typography, Box, SvgIconProps } from '@mui/material';

interface ServerStatusCardProps {
  title: string;
  value: number;
  icon: React.ReactElement<SvgIconProps>;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const ServerStatusCard: React.FC<ServerStatusCardProps> = ({
  title,
  value,
  icon,
  color,
}) => {
  const getColorValue = (colorName: string) => {
    const colors = {
      primary: '#1976d2',
      secondary: '#dc004e',
      success: '#2e7d32',
      warning: '#ed6c02',
      error: '#d32f2f',
    };
    return colors[colorName as keyof typeof colors] || colors.primary;
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" component="div" sx={{ color: getColorValue(color) }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
          <Box sx={{ color: getColorValue(color) }}>
            {React.cloneElement(icon, { fontSize: 'large' })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ServerStatusCard;

// ============================================================================
// METRICS CHART COMPONENT (src/components/dashboard/MetricsChart.tsx)
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { apiService } from '../../services/apiService';
import { MetricSummary } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface MetricsChartProps {
  metrics: MetricSummary[];
  serverId?: number;
}

const MetricsChart: React.FC<MetricsChartProps> = ({ metrics, serverId }) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('CPU');
  const [timeSeriesData, setTimeSeriesData] = useState<MetricSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (serverId) {
      fetchTimeSeriesData();
    }
  }, [serverId, selectedMetric]);

  const fetchTimeSeriesData = async () => {
    if (!serverId) return;

    setIsLoading(true);
    try {
      const data = await apiService.getServerMetrics(serverId, 24);
      const filteredData = data.filter(m => m.metricType === selectedMetric);
      setTimeSeriesData(filteredData);
    } catch (error) {
      console.error('Error fetching time series data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableMetricTypes = () => {
    const types = [...new Set(metrics.map(m => m.metricType))];
    return types;
  };

  const chartData = {
    labels: timeSeriesData.map(m => new Date(m.timestamp)),
    datasets: [
      {
        label: `${selectedMetric} Usage`,
        data: timeSeriesData.map(m => m.value),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${selectedMetric} Performance Over Time`,
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'hour' as const,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box sx={{ height: 300 }}>
      <Box sx={{ mb: 2, minWidth: 120 }}>
        <FormControl size="small">
          <InputLabel>Metric Type</InputLabel>
          <Select
            value={selectedMetric}
            label="Metric Type"
            onChange={(e) => setSelectedMetric(e.target.value)}
          >
            {getAvailableMetricTypes().map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={250}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ height: 250 }}>
          <Line data={chartData} options={chartOptions} />
        </Box>
      )}
    </Box>
  );
};

export default MetricsChart;

// ============================================================================
// ALERTS PANEL COMPONENT (src/components/dashboard/AlertsPanel.tsx)
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { apiService } from '../../services/apiService';
import { AlertSummary, ActiveAlert } from '../../types';

interface AlertsPanelProps {
  alerts: AlertSummary[];
  serverId?: number;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, serverId }) => {
  const [activeAlerts, setActiveAlerts] = useState<ActiveAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<ActiveAlert | null>(null);
  const [acknowledgeNotes, setAcknowledgeNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchActiveAlerts();
  }, [serverId]);

  const fetchActiveAlerts = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getActiveAlerts(serverId);
      setActiveAlerts(data.slice(0, 10)); // Show top 10 alerts
    } catch (error) {
      console.error('Error fetching active alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcknowledgeAlert = async () => {
    if (!selectedAlert) return;

    try {
      await apiService.acknowledgeAlert(selectedAlert.alertID, acknowledgeNotes);
      await fetchActiveAlerts(); // Refresh alerts
      setIsDialogOpen(false);
      setSelectedAlert(null);
      setAcknowledgeNotes('');
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'info':
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Active Alerts
        </Typography>

        {/* Alert Summary */}
        <List dense>
          {alerts.map((alert, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                {getSeverityIcon(alert.severity)}
              </ListItemIcon>
              <ListItemText
                primary={alert.severity}
                secondary={`${alert.count} alerts`}
              />
              <Chip
                label={alert.count}
                size="small"
                color={getSeverityColor(alert.severity) as any}
              />
            </ListItem>
          ))}
        </List>

        {/* Active Alerts List */}
        {isLoading ? (
          <CircularProgress size={24} />
        ) : (
          <List sx={{ maxHeight: 200, overflow: 'auto' }}>
            {activeAlerts.map((alert) => (
              <ListItem
                key={alert.alertID}
                button
                onClick={() => {
                  setSelectedAlert(alert);
                  setIsDialogOpen(true);
                }}
              >
                <ListItemIcon>
                  {getSeverityIcon(alert.severity)}
                </ListItemIcon>
                <ListItemText
                  primary={alert.alertMessage}
                  secondary={`${alert.occurrenceCount} occurrences - ${new Date(alert.lastOccurrence).toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>

      {/* Alert Details Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Alert Details</DialogTitle>
        <DialogContent>
          {selectedAlert && (
            <>
              <Alert severity={getSeverityColor(selectedAlert.severity) as any} sx={{ mb: 2 }}>
                {selectedAlert.alertMessage}
              </Alert>
              
              <Typography variant="body2" gutterBottom>
                <strong>First Occurrence:</strong> {new Date(selectedAlert.firstOccurrence).toLocaleString()}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Last Occurrence:</strong> {new Date(selectedAlert.lastOccurrence).toLocaleString()}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Occurrence Count:</strong> {selectedAlert.occurrenceCount}
              </Typography>
              {selectedAlert.currentValue && (
                <Typography variant="body2" gutterBottom>
                  <strong>Current Value:</strong> {selectedAlert.currentValue}
                </Typography>
              )}
              {selectedAlert.thresholdValue && (
                <Typography variant="body2" gutterBottom>
                  <strong>Threshold:</strong> {selectedAlert.thresholdValue}
                </Typography>
              )}

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Acknowledgment Notes"
                value={acknowledgeNotes}
                onChange={(e) => setAcknowledgeNotes(e.target.value)}
                sx={{ mt: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAcknowledgeAlert} variant="contained">
            Acknowledge Alert
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default AlertsPanel;

// ============================================================================
// DATABASE PANEL COMPONENT (src/components/dashboard/DatabasePanel.tsx)
// ============================================================================

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Box,
} from '@mui/material';
import { Storage as StorageIcon } from '@mui/icons-material';
import { DatabaseSummary } from '../../types';

interface DatabasePanelProps {
  databases: DatabaseSummary[];
  serverId?: number;
}

const DatabasePanel: React.FC<DatabasePanelProps> = ({ databases }) => {
  const formatSize = (sizeInMB: number): string => {
    if (sizeInMB >= 1024) {
      return `${(sizeInMB / 1024).toFixed(2)} GB`;
    }
    return `${sizeInMB.toFixed(2)} MB`;
  };

  const getUsagePercentage = (used: number, total: number): number => {
    return total > 0 ? (used / total) * 100 : 0;
  };

  return (
    <Card sx={{ height: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <StorageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Database Overview
        </Typography>

        <TableContainer sx={{ maxHeight: 320 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Database</TableCell>
                <TableCell align="right">Size</TableCell>
                <TableCell align="center">Usage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {databases.map((db) => (
                <TableRow key={db.databaseName} hover>
                  <TableCell component="th" scope="row">
                    {db.databaseName}
                  </TableCell>
                  <TableCell align="right">
                    {formatSize(db.sizeMB)}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ width: '100%' }}>
                      <LinearProgress
                        variant="determinate"
                        value={getUsagePercentage(db.usedMB, db.sizeMB)}
                        sx={{ height: 8, borderRadius: 5 }}
                        color={getUsagePercentage(db.usedMB, db.sizeMB) > 80 ? 'warning' : 'primary'}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {getUsagePercentage(db.usedMB, db.sizeMB).toFixed(1)}%
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default DatabasePanel;

// ============================================================================
// SLOW QUERIES PANEL COMPONENT (src/components/dashboard/SlowQueriesPanel.tsx)
// ============================================================================

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
} from '@mui/material';
import { Speed as SpeedIcon } from '@mui/icons-material';
import { QueryPerformanceSummary } from '../../types';

interface SlowQueriesPanelProps {
  queries: QueryPerformanceSummary[];
  serverId?: number;
}

const SlowQueriesPanel: React.FC<SlowQueriesPanelProps> = ({ queries }) => {
  const formatDuration = (durationMs: number): string => {
    if (durationMs >= 1000) {
      return `${(durationMs / 1000).toFixed(2)}s`;
    }
    return `${durationMs.toFixed(0)}ms`;
  };

  const getDurationColor = (durationMs: number): 'default' | 'warning' | 'error' => {
    if (durationMs >= 5000) return 'error';
    if (durationMs >= 1000) return 'warning';
    return 'default';
  };

  return (
    <Card sx={{ height: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <SpeedIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Slow Queries
        </Typography>

        <List sx={{ maxHeight: 320, overflow: 'auto' }}>
          {queries.map((query, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        maxWidth: '70%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {query.queryPreview}
                    </Typography>
                    <Chip
                      label={formatDuration(query.avgDurationMs)}
                      size="small"
                      color={getDurationColor(query.avgDurationMs)}
                    />
                  </Box>
                }
                secondary={
                  <Box display="flex" justifyContent="space-between" sx={{ mt: 1 }}>
                    <Typography variant="caption">
                      Executions: {query.executionCount.toLocaleString()}
                    </Typography>
                    <Typography variant="caption">
                      Last: {new Date(query.lastExecution).toLocaleString()}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default SlowQueriesPanel;

// ============================================================================
// SECURITY EVENTS PANEL COMPONENT (src/components/dashboard/SecurityEventsPanel.tsx)
// ============================================================================

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Collapse,
  Box,
} from '@mui/material';
import {
  Security as SecurityIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { SecurityEventSummary } from '../../types';

interface SecurityEventsPanelProps {
  events: SecurityEventSummary[];
  serverId?: number;
}

const SecurityEventsPanel: React.FC<SecurityEventsPanelProps> = ({ events }) => {
  const [expanded, setExpanded] = useState(true);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    // You could add different icons for different event types
    return '🔐';
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Recent Security Events
          </Typography>
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={expanded}>
          <TableContainer sx={{ maxHeight: 300, mt: 2 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Event Type</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell align="right">Count</TableCell>
                  <TableCell>Last Occurrence</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <span style={{ marginRight: 8 }}>
                          {getEventTypeIcon(event.eventType)}
                        </span>
                        {event.eventType.replace('_', ' ')}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={event.severity}
                        size="small"
                        color={getSeverityColor(event.severity) as any}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {event.count.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(event.lastOccurrence).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default SecurityEventsPanel;

// ============================================================================
// APP LAYOUT COMPONENT (src/components/Layout.tsx)
// ============================================================================

import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Security as SecurityIcon,
  Warning as AlertIcon,
  Storage as DatabaseIcon,
  Settings as SettingsIcon,
  AccountCircle,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 240;

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleProfileMenuClose();
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Security', icon: <SecurityIcon />, path: '/security' },
    { text: 'Alerts', icon: <AlertIcon />, path: '/alerts' },
    { text: 'Databases', icon: <DatabaseIcon />, path: '/databases' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Audit Dashboard
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            SQL Server Audit Dashboard
          </Typography>

          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.fullName?.charAt(0) || <AccountCircle />}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            onClick={handleProfileMenuClose}
          >
            <MenuItem disabled>
              <Typography variant="body2">
                {user?.fullName} ({user?.role})
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>// ============================================================================
// SQL SERVER AUDIT DASHBOARD - REACT FRONTEND APPLICATION
// ============================================================================
// Complete React TypeScript application with Material-UI and Chart.js
// ============================================================================

// package.json
/*
{
  "name": "audit-dashboard-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "@mui/icons-material": "^5.14.19",
    "@mui/material": "^5.14.20",
    "@mui/x-charts": "^6.18.1",
    "@mui/x-data-grid": "^6.18.1",
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.39",
    "@types/react-dom": "^18.2.17",
    "axios": "^1.6.2",
    "chart.js": "^4.4.0",
    "chartjs-adapter-date-fns": "^3.0.0",
    "date-fns": "^2.30.0",
    "react": "^18.2.0",
    "react-chartjs-2": "^5.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "react-scripts": "5.0.1",
    "typescript": "^5.3.2",
    "@microsoft/signalr": "^8.0.0",
    "recharts": "^2.8.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@types/chartjs": "^0.0.31"
  }
}
*/

// ============================================================================
// TYPES AND INTERFACES (src/types/index.ts)
// ============================================================================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  message: string;
  user?: UserInfo;
}

export interface UserInfo {
  userID: number;
  username: string;
  fullName: string;
  role: string;
  email: string;
}

export interface ServerOverview {
  serverID: number;
  serverName: string;
  status: 'Online' | 'Warning' | 'Offline';
  lastHeartbeat?: string;
  minutesSinceLastHeartbeat: number;
  cpuUsage?: number;
  memoryUsage?: number;
  activeConnections: number;
  alertCount: number;
}

export interface DashboardOverview {
  serverStatus: ServerStatusSummary;
  latestMetrics: MetricSummary[];
  activeAlerts: AlertSummary[];
  topDatabases: DatabaseSummary[];
  slowQueries: QueryPerformanceSummary[];
  recentSecurityEvents: SecurityEventSummary[];
}

export interface ServerStatusSummary {
  totalServers: number;
  onlineServers: number;
  warningServers: number;
  offlineServers: number;
}

export interface MetricSummary {
  metricType: string;
  metricName: string;
  value: number;
  unit: string;
  timestamp: string;
}

export interface AlertSummary {
  severity: string;
  count: number;
}

export interface DatabaseSummary {
  databaseName: string;
  sizeMB: number;
  usedMB: number;
  growthPercentage?: number;
}

export interface QueryPerformanceSummary {
  queryPreview: string;
  avgDurationMs: number;
  executionCount: number;
  lastExecution: string;
}

export interface SecurityEventSummary {
  eventType: string;
  severity: string;
  count: number;
  lastOccurrence: string;
}

export interface ActiveAlert {
  alertID: number;
  alertDefinitionID: number;
  serverID: number;
  alertMessage: string;
  currentValue?: number;
  thresholdValue?: number;
  severity: string;
  status: string;
  firstOccurrence: string;
  lastOccurrence: string;
  occurrenceCount: number;
  acknowledgedBy?: string;
  acknowledgedDate?: string;
  notes?: string;
}

export interface SecurityEvent {
  securityEventID: number;
  serverID: number;
  eventType: string;
  eventSubType?: string;
  loginName?: string;
  databaseName?: string;
  clientIP?: string;
  applicationName?: string;
  eventTime: string;
  severity: string;
  success: boolean;
}

// ============================================================================
// API SERVICE (src/services/apiService.ts)
// ============================================================================

import axios, { AxiosInstance, AxiosResponse } from 'axios';

class ApiService {
  private api: AxiosInstance;
  private baseURL = 'http://localhost:7001'; // Update with your API URL

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userInfo');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.api.post('/api/auth/login', credentials);
    return response.data;
  }

  async refreshToken(): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.api.post('/api/auth/refresh');
    return response.data;
  }

  // Dashboard
  async getDashboardOverview(serverId?: number): Promise<DashboardOverview> {
    const params = serverId ? { serverId } : {};
    const response: AxiosResponse<DashboardOverview> = await this.api.get('/api/dashboard/overview', { params });
    return response.data;
  }

  async getServers(): Promise<ServerOverview[]> {
    const response: AxiosResponse<ServerOverview[]> = await this.api.get('/api/dashboard/servers');
    return response.data;
  }

  async getServerMetrics(serverId: number, hours: number = 24): Promise<MetricSummary[]> {
    const response: AxiosResponse<MetricSummary[]> = await this.api.get(`/api/dashboard/servers/${serverId}/metrics`, {
      params: { hours }
    });
    return response.data;
  }

  // Alerts
  async getActiveAlerts(serverId?: number): Promise<ActiveAlert[]> {
    const params = serverId ? { serverId } : {};
    const response: AxiosResponse<ActiveAlert[]> = await this.api.get('/api/alerts', { params });
    return response.data;
  }

  async acknowledgeAlert(alertId: number, notes?: string): Promise<void> {
    await this.api.post(`/api/alerts/${alertId}/acknowledge`, { notes });
  }

  // Security
  async getSecurityEvents(serverId?: number, hours: number = 24, page: number = 1, pageSize: number = 50): Promise<SecurityEvent[]> {
    const params = { serverId, hours, page, pageSize };
    const response: AxiosResponse<SecurityEvent[]> = await this.api.get('/api/security/events', { params });
    return response.data;
  }

  async getSecurityEventsSummary(serverId?: number, hours: number = 24): Promise<SecurityEventSummary[]> {
    const params = { serverId, hours };
    const response: AxiosResponse<SecurityEventSummary[]> = await this.api.get('/api/security/events/summary', { params });
    return response.data;
  }
}

export const apiService = new ApiService();

// ============================================================================
// SIGNALR SERVICE (src/services/signalrService.ts)
// ============================================================================

import * as signalR from '@microsoft/signalr';

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private baseURL = 'http://localhost:7001'; // Update with your API URL

  async startConnection(): Promise<void> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseURL}/dashboardHub`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    try {
      await this.connection.start();
      console.log('SignalR connection started');
    } catch (error) {
      console.error('Error starting SignalR connection:', error);
      throw error;
    }
  }

  async stopConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      console.log('SignalR connection stopped');
    }
  }

  onDashboardUpdate(callback: (data: any) => void): void {
    if (this.connection) {
      this.connection.on('DashboardUpdate', callback);
    }
  }

  onAlertUpdate(callback: (alert: ActiveAlert) => void): void {
    if (this.connection) {
      this.connection.on('AlertUpdate', callback);
    }
  }

  onServerStatusUpdate(callback: (serverStatus: ServerOverview) => void): void {
    if (this.connection) {
      this.connection.on('ServerStatusUpdate', callback);
    }
  }

  async joinGroup(groupName: string): Promise<void> {
    if (this.connection) {
      await this.connection.invoke('JoinGroup', groupName);
    }
  }

  async leaveGroup(groupName: string): Promise<void> {
    if (this.connection) {
      await this.connection.invoke('LeaveGroup', groupName);
    }
  }
}

export const signalrService = new SignalRService();

// ============================================================================
// AUTHENTICATION CONTEXT (src/contexts/AuthContext.tsx)
// ============================================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/apiService';
import { UserInfo, LoginRequest } from '../types';

interface AuthContextType {
  user: UserInfo | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    const userInfo = localStorage.getItem('userInfo');
    
    if (token && userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user info:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      const response = await apiService.login(credentials);
      
      if (response.success && response.user) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userInfo', JSON.stringify(response.user));
        setUser(response.user);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ============================================================================
// LOGIN COMPONENT (src/components/Login.tsx)
// ============================================================================

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Avatar,
  CssBaseline,
} from '@mui/material';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login({ username, password });
      
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h4" gutterBottom>
          SQL Server Audit Dashboard
        </Typography>
        <Typography component="h2" variant="h6" color="text.secondary" gutterBottom>
          Sign in to continue
        </Typography>
        
        <Card sx={{ mt: 2, width: '100%' }}>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>
          </CardContent>
        </Card>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Default credentials: admin / password
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;

// ============================================================================
// MAIN DASHBOARD COMPONENT (src/components/Dashboard.tsx)
// ============================================================================

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
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Computer as ComputerIcon,
  Warning as WarningIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import { apiService } from '../services/apiService';
import { DashboardOverview, ServerOverview } from '../types';
import ServerStatusCard from './dashboard/ServerStatusCard';
import MetricsChart from './dashboard/MetricsChart';
import AlertsPanel from './dashboard/AlertsPanel';
import DatabasePanel from './dashboard/DatabasePanel';
import SlowQueriesPanel from './dashboard/SlowQueriesPanel';
import SecurityEventsPanel from './dashboard/SecurityEventsPanel';

const Dashboard: React.FC = () => {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [servers, setServers] = useState<ServerOverview[]>([]);
  const [selectedServerId, setSelectedServerId] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      setError(null);
      const [overviewData, serversData] = await Promise.all([
        apiService.getDashboardOverview(selectedServerId),
        apiService.getServers(),
      ]);

      setOverview(overviewData);
      setServers(serversData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, [selectedServerId]);

  const handleRefresh = () => {
    setIsLoading(true);
    fetchData();
  };

  const getServerStatusColor = (status: string) => {
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

  if (isLoading && !overview) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (