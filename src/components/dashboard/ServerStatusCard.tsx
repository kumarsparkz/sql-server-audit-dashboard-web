import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { ServerStatusCardProps } from '../../types';

const ServerStatusCard: React.FC<ServerStatusCardProps> = ({
  title,
  value,
  icon,
  color,
  trend
}) => {
  const getColorCode = (color: string) => {
    switch (color) {
      case 'primary': return '#1976d2';
      case 'success': return '#2e7d32';
      case 'warning': return '#ed6c02';
      case 'error': return '#d32f2f';
      default: return '#757575';
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        border: `2px solid ${getColorCode(color)}`,
        borderRadius: 2,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        }
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Box sx={{ color: getColorCode(color) }}>
            {icon}
          </Box>
        </Box>
        
        <Typography variant="h3" component="div" color={getColorCode(color)} fontWeight="bold">
          {value}
        </Typography>
        
        {trend && (
          <Box display="flex" alignItems="center" mt={1}>
            <Typography 
              variant="body2" 
              color={trend.isPositive ? 'success.main' : 'error.main'}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              vs last period
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ServerStatusCard;