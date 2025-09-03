import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { MetricSummary } from '../../types';

interface MetricsChartProps {
  metrics?: MetricSummary[];
  serverId?: number;
}

const MetricsChart: React.FC<MetricsChartProps> = ({ metrics = [], serverId }) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('CPU');
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Available metric types
  const metricTypes = [
    { value: 'CPU', label: 'CPU Usage (%)', color: '#8884d8' },
    { value: 'Memory', label: 'Memory Usage (%)', color: '#82ca9d' },
    { value: 'Disk', label: 'Disk Usage (%)', color: '#ffc658' },
    { value: 'Network', label: 'Network I/O', color: '#ff7300' },
    { value: 'Connections', label: 'Active Connections', color: '#8dd1e1' },
  ];

  useEffect(() => {
    if (metrics && metrics.length > 0) {
      processMetricsData();
    }
  }, [metrics, selectedMetric]);

  const processMetricsData = () => {
    try {
      setLoading(true);
      setError(null);

      // Filter metrics by selected type
      const filteredMetrics = metrics.filter(
        m => m.metricType?.toLowerCase() === selectedMetric.toLowerCase()
      );

      // Sort by timestamp
      const sortedMetrics = filteredMetrics.sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      // Format for chart - group by time intervals
      const chartData = sortedMetrics.map((metric, index) => ({
        timestamp: new Date(metric.timestamp).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        value: metric.value,
        unit: metric.unit,
        name: metric.metricName || selectedMetric,
        fullTimestamp: metric.timestamp,
      }));

      // If we have too many data points, sample them
      const maxPoints = 20;
      if (chartData.length > maxPoints) {
        const step = Math.ceil(chartData.length / maxPoints);
        const sampledData = chartData.filter((_, index) => index % step === 0);
        setChartData(sampledData);
      } else {
        setChartData(chartData);
      }

    } catch (err) {
      console.error('Error processing metrics data:', err);
      setError('Failed to process metrics data');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentMetricType = () => {
    return metricTypes.find(type => type.value === selectedMetric) || metricTypes[0];
  };

  const formatTooltipValue = (value: any, name: any, props: any) => {
    const unit = props.payload?.unit || '';
    return [`${value}${unit}`, getCurrentMetricType().label];
  };

  // If no metrics data, show placeholder
  if (!metrics || metrics.length === 0) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        height={300}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          📊 No Metrics Data
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Metrics will appear here once data is collected
        </Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        <Typography variant="subtitle2">Chart Error</Typography>
        <Typography variant="body2">{error}</Typography>
      </Alert>
    );
  }

  return (
    <Box>
      {/* Metric Type Selector */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Metric Type</InputLabel>
          <Select
            value={selectedMetric}
            label="Metric Type"
            onChange={(e) => setSelectedMetric(e.target.value)}
          >
            {metricTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      backgroundColor: type.color, 
                      borderRadius: '2px' 
                    }} 
                  />
                  {type.label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Current Value Display */}
        {chartData.length > 0 && (
          <Card variant="outlined" sx={{ p: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Current {selectedMetric}
            </Typography>
            <Typography variant="h6" color={getCurrentMetricType().color}>
              {chartData[chartData.length - 1]?.value}
              {chartData[chartData.length - 1]?.unit || ''}
            </Typography>
          </Card>
        )}
      </Box>

      {/* Chart */}
      <Box sx={{ height: 220 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id={`gradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getCurrentMetricType().color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={getCurrentMetricType().color} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <Tooltip 
                formatter={formatTooltipValue}
                labelStyle={{ color: '#333' }}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={getCurrentMetricType().color}
                strokeWidth={2}
                fill={`url(#gradient-${selectedMetric})`}
                name={getCurrentMetricType().label}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <Box 
            display="flex" 
            flexDirection="column"
            justifyContent="center" 
            alignItems="center" 
            height="100%"
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              📈 No {selectedMetric.toLowerCase()} data available
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Data will appear as metrics are collected
            </Typography>
          </Box>
        )}
      </Box>

      {/* Summary Stats */}
      {chartData.length > 0 && (
        <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            📊 {selectedMetric} Statistics
          </Typography>
          <Box display="flex" justifyContent="space-between">
            <Box textAlign="center">
              <Typography variant="caption" color="text.secondary">
                Current
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {chartData[chartData.length - 1]?.value}
                {chartData[chartData.length - 1]?.unit || ''}
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="caption" color="text.secondary">
                Average
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {(chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length).toFixed(1)}
                {chartData[0]?.unit || ''}
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="caption" color="text.secondary">
                Peak
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {Math.max(...chartData.map(d => d.value)).toFixed(1)}
                {chartData[0]?.unit || ''}
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="caption" color="text.secondary">
                Data Points
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {chartData.length}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MetricsChart;