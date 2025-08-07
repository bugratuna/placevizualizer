import { Paper, Typography, Box } from '@mui/material';
import TradeAreaLegend from './components/TradeAreaLegend';
import HomeZipcodeLegend from './components/HomeZipcodeLegend';
import { useCustomerAnalysis } from '../../store/useCustomerAnalysis.ts';

const RightSidebar = () => {
  const dataType = useCustomerAnalysis((state) => state.dataType);

  return (
    <Paper
      elevation={4}
      sx={{
        width: 280,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
        borderLeft: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" component="h2">
          Staging
        </Typography>
      </Box>
      <Box sx={{ p: 2, flexGrow: 1, overflowY: 'auto' }}>
        {dataType === 'Trade Area' ? (
          <TradeAreaLegend />
        ) : (
          <HomeZipcodeLegend />
        )}
      </Box>
    </Paper>
  );
};

export default RightSidebar;
