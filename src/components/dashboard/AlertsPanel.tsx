import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { AlertsPanelProps, SeverityLevel } from '../../types';

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, serverId, onAcknowledge }) => {
  const getSeverityIcon = (severity: SeverityLevel) => {
    switch (severity) {
      case 'Critical':
        return <ErrorIcon color="error" />;
      case 'High':
        return <WarningIcon color="warning" />;
      case 'Medium':
        return <InfoIcon color="info" />;
      case 'Low':
        return <InfoIcon color="primary" />;
      default:
        return <InfoIcon />;
    }
  };

  const getSeverityColor = (severity: SeverityLevel) => {
    switch (severity) {
      case 'Critical':
        return 'error';
      case 'High':
        return 'warning';
      case 'Medium':
        return 'info';
      case 'Low':
        return 'primary';
      default:
        return 'default';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!alerts || alerts.length === 0) {
    return (
      <Card sx={{ height: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Active Alerts (0)
          </Typography>
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height={300}
          >
            <Box textAlign="center">
              <CheckIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" color="success.main" gutterBottom>
                All Clear!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No active alerts at this time
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Active Alerts ({alerts.length})
        </Typography>
        
        <Box sx={{ height: 320, overflowY: 'auto' }}>
          <List dense>
            {alerts.map((alert) => (
              <ListItem
                key={alert.alertID}
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  mb: 1,
                  backgroundColor: alert.isAcknowledged ? '#f5f5f5' : 'white',
                }}
              >
                <Box sx={{ mr: 2 }}>
                  {getSeverityIcon(alert.severity)}
                </Box>
                
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {alert.alertName}
                      </Typography>
                      <Chip 
                        label={alert.severity} 
                        size="small" 
                        color={getSeverityColor(alert.severity) as any}
                      />
                      {alert.isAcknowledged && (
                        <Chip 
                          label="Acknowledged" 
                          size="small" 
                          color="success"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {alert.serverName} • {alert.alertType}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {alert.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTimestamp(alert.timestamp)}
                      </Typography>
                    </Box>
                  }
                />
                
                {!alert.isAcknowledged && onAcknowledge && (
                  <ListItemSecondaryAction>
                    <Tooltip title="Acknowledge Alert">
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => onAcknowledge(alert.alertID)}
                      >
                        <CheckIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;