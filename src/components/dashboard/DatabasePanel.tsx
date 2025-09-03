import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Storage as StorageIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { DatabasePanelProps } from '../../types';

const DatabasePanel: React.FC<DatabasePanelProps> = ({ databases, serverId }) => {
  const formatFileSize = (sizeGB: number) => {
    if (sizeGB >= 1024) {
      return `${(sizeGB / 1024).toFixed(1)} TB`;
    }
    return `${sizeGB.toFixed(1)} GB`;
  };

  const formatLastBackup = (lastBackup: string) => {
    const backupDate = new Date(lastBackup);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - backupDate.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    }
  };

  const getBackupStatus = (lastBackup: string) => {
    const backupDate = new Date(lastBackup);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - backupDate.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) return 'success';
    if (diffHours < 48) return 'warning';
    return 'error';
  };

  const getGrowthColor = (growthRate: number) => {
    if (growthRate > 10) return 'error';
    if (growthRate > 5) return 'warning';
    return 'success';
  };

  if (!databases || databases.length === 0) {
    return (
      <Card sx={{ height: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <StorageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Database Overview (0)
          </Typography>
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height={300}
          >
            <Typography variant="body2" color="text.secondary">
              No database information available
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <StorageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Database Overview ({databases.length})
        </Typography>
        
        <Box sx={{ height: 320, overflowY: 'auto' }}>
          <List dense>
            {databases.map((database) => (
              <ListItem
                key={database.databaseID}
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
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="subtitle2" fontWeight="bold">
                        {database.databaseName}
                      </Typography>
                      <Chip 
                        label={database.status} 
                        size="small" 
                        color={database.status === 'Online' ? 'success' : 'warning'}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {database.serverName}
                      </Typography>
                      
                      {/* Database Size */}
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Typography variant="caption">Size:</Typography>
                        <Typography variant="caption" fontWeight="bold">
                          {formatFileSize(database.sizeGB)}
                        </Typography>
                      </Box>
                      
                      {/* Growth Rate */}
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Typography variant="caption">Growth Rate:</Typography>
                        <Box display="flex" alignItems="center">
                          {database.growthRate > 0 ? (
                            <TrendingUpIcon 
                              sx={{ fontSize: 14, color: getGrowthColor(database.growthRate) + '.main' }} 
                            />
                          ) : (
                            <TrendingDownIcon 
                              sx={{ fontSize: 14, color: 'success.main' }} 
                            />
                          )}
                          <Typography 
                            variant="caption" 
                            fontWeight="bold"
                            color={getGrowthColor(database.growthRate) + '.main'}
                          >
                            {database.growthRate}%
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Last Backup */}
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="caption">Last Backup:</Typography>
                        <Chip
                          label={formatLastBackup(database.lastBackup)}
                          size="small"
                          color={getBackupStatus(database.lastBackup) as any}
                          variant="outlined"
                        />
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

export default DatabasePanel;