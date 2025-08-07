import { Box, Typography } from '@mui/material';
import LegendItem from './LegendItem';
import { TRADE_AREA_COLORS } from '../../../config/colors';
import { useCustomerAnalysis } from '../../../store/useCustomerAnalysis.ts';

const TradeAreaLegend = () => {
  const selectedPercentages = useCustomerAnalysis(
    (state) => state.selectedTradeAreaPercentages
  );

  const descriptions: Record<string, string> = {
    '70': '%70 Customer (Widest Area)',
    '50': '%50 Customer',
    '30': '%30 Customer (Narrowest Area)',
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Trade Area
      </Typography>
      {Object.entries(TRADE_AREA_COLORS)
        .sort(([p1], [p2]) => Number(p2) - Number(p1))
        .map(([percentage, rgba]) => {
          if (!selectedPercentages.includes(Number(percentage))) return null;

          return (
            <LegendItem
              key={percentage}
              color={`rgba(${rgba.join(',')})`}
              label={descriptions[percentage]}
            />
          );
        })}
    </Box>
  );
};

export default TradeAreaLegend;
