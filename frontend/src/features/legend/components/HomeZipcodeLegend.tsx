import { useMemo } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import LegendItem from './LegendItem';
import { useDataStore } from '../../../store/useDataStore';
import { useMapStateStore } from '../../../store/useMapStateStore';
import { ZIPCODE_PERCENTILE_COLORS } from '../../../config/colors';
import { calculateQuintileThresholds } from '../../../utils/math';

const HomeZipcodeLegend = () => {
  const { homeZipcodes, loading } = useDataStore();
  const { visibleHomeZipcodeId } = useMapStateStore();

  const activeZipcodes = visibleHomeZipcodeId
    ? homeZipcodes[visibleHomeZipcodeId]
    : [];

  const quintileThresholds = useMemo(() => {
    if (!activeZipcodes || activeZipcodes.length === 0) return {};
    return calculateQuintileThresholds(activeZipcodes);
  }, [activeZipcodes]);

  if (loading && !activeZipcodes?.length) {
    return <CircularProgress size={24} />;
  }

  if (!visibleHomeZipcodeId) {
    return (
      <Typography variant="caption" color="text.secondary">
        Select a location from the map and click the button to see customer zip code data.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Customer Zip Codes
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        sx={{ mb: 1.5 }}
      >
        Customer Density (Percentile)
      </Typography>
      {Object.entries(quintileThresholds).map(([range, label]) => (
        <LegendItem
          key={range}
          color={`rgb(${ZIPCODE_PERCENTILE_COLORS[range].join(',')})`}
          label={label}
        />
      ))}
    </Box>
  );
};

export default HomeZipcodeLegend;
