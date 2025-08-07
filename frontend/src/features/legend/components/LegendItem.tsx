import { Box, Typography } from '@mui/material';

interface LegendItemProps {
  color: string;
  label: string;
}

const LegendItem = ({ color, label }: LegendItemProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Box
        sx={{
          width: 18,
          height: 18,
          backgroundColor: color,
          borderRadius: '4px',
          mr: 1.5,
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      />
      <Typography variant="body2">{label}</Typography>
    </Box>
  );
};

export default LegendItem;
