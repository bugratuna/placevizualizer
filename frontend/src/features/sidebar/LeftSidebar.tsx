import { Box, Paper, Typography, Divider } from '@mui/material';
import PlaceAnalysis from './components/PlaceAnalysis';
import CustomerAnalysis from './components/CustomerAnalysis';

const LeftSidebar = () => {
  return (
    <Paper
      elevation={4}
      sx={{
        width: 360,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" component="h1">
          Analysis Controls
        </Typography>
      </Box>

      <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
        <PlaceAnalysis />
        <Divider />
        <CustomerAnalysis />
      </Box>
    </Paper>
  );
};

export default LeftSidebar;
