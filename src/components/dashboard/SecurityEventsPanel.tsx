import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Person as PersonIcon,
  Computer as ComputerIcon,
  Storage as StorageIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { SecurityEventsPanelProps, SeverityLevel } from '../../types';

const SecurityEventsPanel: React.FC<SecurityEventsPanelProps> = ({ events, serverId }) => {
  const getSeverityIcon = (severity: SeverityLevel) => {
    switch (severity) {
      case 'Critical':
        return <ErrorIcon color="error" />;
      case 'High':
        return <WarningIcon color="warning" />;
      case 'Medium':
        return <InfoIcon color="info" />;
      case 'Low':
        return <InfoIcon color="success" />;
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
        return 'success';
      default:
        return 'default';
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case 'login':
      case 'authentication':
        return <PersonIcon />;
      case 'database':
        return <StorageIcon />;
      default:
        return <SecurityIcon />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!events || events.length === 0) {
    return (
      <Card sx={{ height: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Recent Security Events (0)
          </Typography>
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height={300}
          >
            <Box textAlign="center">
              <SecurityIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" color="success.main" gutterBottom>
                No Security Events
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No recent security events detected
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
          <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Recent Security Events ({events.length})
        </Typography>
        
        <Box sx={{ height: 320, overflowY: 'auto' }}>
          <List dense>
            {events.map((event, index) => (
              <ListItem
                key={index}
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  mb: 1,
                  backgroundColor: 'white',
                }}
              >
                <Avatar sx={{ mr: 2, bgcolor: 'primary.light' }}>
                  {getEventTypeIcon(event.eventType)}
                </Avatar>
                
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {event.eventType}
                      </Typography>
                      <Chip 
                        label={event.severity} 
                        size="small" 
                        color={getSeverityColor(event.severity) as any}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        {event.description || 'Security event detected'}
                      </Typography>
                      
                      <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                        <Chip
                          label={event.serverName || 'Unknown Server'}
                          size="small"
                          icon={<ComputerIcon />}
                          variant="outlined"
                        />
                        
                        {event.userName && (
                          <Chip
                            label={event.userName}
                            size="small"
                            icon={<PersonIcon />}
                            variant="outlined"
                          />
                        )}
                        
                        {event.databaseName && (
                          <Chip
                            label={event.databaseName}
                            size="small"
                            icon={<StorageIcon />}
                            variant="outlined"
                          />
                        )}
                        
                        {event.sourceIP && (
                          <Chip
                            label={event.sourceIP}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                      
                      <Typography variant="caption" color="text.secondary">
                        {formatTimestamp(event.timestamp)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SecurityEventsPanel;