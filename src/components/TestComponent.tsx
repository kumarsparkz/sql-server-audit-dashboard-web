import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const TestComponent: React.FC = () => {
  console.log('🧪 TestComponent: Rendering...');
  
  const handleClick = () => {
    console.log('🖱️ Button clicked!');
    alert('React is working!');
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom>
        🧪 Test Component
      </Typography>
      <Typography variant="h6" gutterBottom>
        If you can see this, React is working!
      </Typography>
      <Typography variant="body1" paragraph>
        Current time: {new Date().toLocaleString()}
      </Typography>
      <Button variant="contained" onClick={handleClick}>
        Test Button
      </Button>
      <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="body2">
          Debug Info:
        </Typography>
        <ul>
          <li>React: ✅ Working</li>
          <li>Material-UI: ✅ Working</li>
          <li>Routing: ✅ Working</li>
          <li>Console logs: Check browser console</li>
        </ul>
      </Box>
    </Box>
  );
};

export default TestComponent;