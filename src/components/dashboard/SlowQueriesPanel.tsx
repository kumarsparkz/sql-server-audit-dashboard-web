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
  Tooltip,
} from '@mui/material';
import {
  QueryStats as QueryStatsIcon,
  Timer as TimerIcon,
  Computer as ComputerIcon,
} from '@mui/icons-material';
import { SlowQueriesPanelProps } from '../../types';

const SlowQueriesPanel: React.FC<SlowQueriesPanelProps> = ({ queries, serverId }) => {
  const formatExecutionTime = (timeMs: number) => {
    if (timeMs >= 1000) {
      return `${(timeMs / 1000).toFixed(2)}s`;
    }
    return `${timeMs}ms`;
  };

  const formatQueryText = (queryText: string, maxLength: number = 100) => {
    if (queryText.length <= maxLength) {
      return queryText;
    }
    return queryText.substring(0, maxLength) + '...';
  };

  const getPerformanceColor = (executionTime: number) => {
    if (executionTime >= 10000) return 'error'; // 10+ seconds
    if (executionTime >= 5000) return 'warning'; // 5+ seconds
    if (executionTime >= 1000) return 'info'; // 1+ second
    return 'success';
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!queries || queries.length === 0) {
    return (
      <Card sx={{ height: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <QueryStatsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Slow Queries (0)
          </Typography>
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height={300}
          >
            <Box textAlign="center">
              <QueryStatsIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" color="success.main" gutterBottom>
                No Slow Queries
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All queries are performing well
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
          <QueryStatsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Slow Queries ({queries.length})
        </Typography>
        
        <Box sx={{ height: 320, overflowY: 'auto' }}>
          <List dense>
            {queries.map((query) => (
              <ListItem
                key={query.queryID}
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  mb: 1,
                  flexDirection: 'column',
                  alignItems: 'stretch',
                }}
              >
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                      <Chip 
                        label={formatExecutionTime(query.executionTime)}
                        size="small" 
                        color={getPerformanceColor(query.executionTime) as any}
                        icon={<TimerIcon />}
                      />
                      <Chip 
                        label={`${query.frequency}x`}
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      {/* Server and Database */}
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <ComputerIcon sx={{ fontSize: 14 }} />
                        <Typography variant="caption" color="text.secondary">
                          {query.serverName} • {query.databaseName}
                        </Typography>
                      </Box>
                      
                      {/* Query Text */}
                      <Tooltip title={query.queryText} arrow placement="top">
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'monospace',
                            backgroundColor: '#f5f5f5',
                            p: 1,
                            borderRadius: 1,
                            mb: 1,
                            cursor: 'help'
                          }}
                        >
                          {formatQueryText(query.queryText)}
                        </Typography>
                      </Tooltip>
                      
                      {/* Performance Metrics */}
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            CPU: {query.avgCPU}% • I/O: {query.avgIO}%
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {formatTimestamp(query.timestamp)}
                        </Typography>
                      </Box>
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

export default SlowQueriesPanel;