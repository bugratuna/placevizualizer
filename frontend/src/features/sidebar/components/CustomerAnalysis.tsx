import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useCustomerAnalysis } from '../../../store/useCustomerAnalysis';
import { useMapStateStore } from '../../../store/useMapStateStore';

const TRADE_AREA_OPTIONS = [30, 50, 70];

const CustomerAnalysis = () => {
  const {
    customerAnalysisVisible,
    toggleCustomerAnalysis,
    dataType,
    setDataType,
    selectedTradeAreaPercentages,
    toggleTradeAreaPercentage,
  } = useCustomerAnalysis();

  const { visibleTradeAreaIds, toggleTradeAreaVisibility } = useMapStateStore();

  return (
    <Accordion
      expanded={customerAnalysisVisible}
      onChange={toggleCustomerAnalysis}
      disableGutters
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="customer-analysis-content"
        id="customer-analysis-header"
      >
        <Box
          sx={{ display: 'flex', alignItems: 'center', width: '100%', pr: 1 }}
        >
          <Typography sx={{ flexGrow: 1 }}>Customer Analysis</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="data-type-select-label">Data Type</InputLabel>
            <Select
              labelId="data-type-select-label"
              value={dataType}
              label="Data Type"
              onChange={(e) => {
                const newDataType = e.target.value as
                  | 'Trade Area'
                  | 'Home Zipcodes';
                setDataType(newDataType);
                if (
                  newDataType === 'Home Zipcodes' &&
                  visibleTradeAreaIds.size > 0
                ) {
                  visibleTradeAreaIds.forEach((id) =>
                    toggleTradeAreaVisibility(id)
                  );
                }
              }}
            >
              <MenuItem value="Trade Area">Trade Area</MenuItem>
              <MenuItem value="Home Zipcodes">Home Zipcodes</MenuItem>
            </Select>
          </FormControl>

          {dataType === 'Trade Area' && (
            <FormControl component="fieldset" variant="standard">
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Trade Area Percentiles
              </Typography>
              <FormGroup>
                {TRADE_AREA_OPTIONS.map((percentage) => (
                  <FormControlLabel
                    key={percentage}
                    control={
                      <Checkbox
                        checked={selectedTradeAreaPercentages.includes(
                          percentage
                        )}
                        onChange={() => toggleTradeAreaPercentage(percentage)}
                        name={`${percentage}%`}
                      />
                    }
                    label={`${percentage}%`}
                  />
                ))}
              </FormGroup>
            </FormControl>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default CustomerAnalysis;
