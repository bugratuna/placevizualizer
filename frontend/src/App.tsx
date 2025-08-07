import { useEffect } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import LeftSidebar from './features/sidebar/LeftSidebar';
import RightSidebar from './features/legend/RightSidebar';
import MapController from './features/map/MapController';
import { useDataStore } from './store/useDataStore';

function App() {
  const fetchMyPlaces = useDataStore((state) => state.fetchMyPlaces);
  const loading = useDataStore((state) => state.loading);
  const error = useDataStore((state) => state.error);
  const clearError = useDataStore((state) => state.clearError);

  useEffect(() => {
    fetchMyPlaces();
  }, [fetchMyPlaces]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <LeftSidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, height: '100vh', position: 'relative' }}
      >
        <MapController />
        {error && (
          <Alert
            severity="error"
            onClose={clearError}
            sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1200 }}
          >
            {error}
          </Alert>
        )}
        {loading && (
          <CircularProgress
            sx={{ position: 'absolute', top: '50%', left: '50%' }}
          />
        )}
      </Box>
      <RightSidebar />
    </Box>
  );
}
export default App;
