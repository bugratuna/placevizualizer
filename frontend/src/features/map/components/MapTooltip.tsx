import {
  Box,
  Typography,
  Button,
  Divider,
  Tooltip as MuiTooltip,
} from '@mui/material';
import {
  type DeckGLPickInfo,
  useMapStateStore,
} from '../../../store/useMapStateStore';
import { useCustomerAnalysis } from '../../../store/useCustomerAnalysis';
import { useCustomerLayerLogic } from '../../../hooks/useCustomerLayerLogic';
import type { Place } from '../../../types';

interface MapTooltipProps {
  info: DeckGLPickInfo;
  isPinned: boolean;
}

const MapTooltip = ({ info, isPinned }: MapTooltipProps) => {
  const { x, y, object } = info;
  const { visibleTradeAreaIds, visibleHomeZipcodeId } = useMapStateStore();

  const { dataType } = useCustomerAnalysis();

  const { handleToggleTradeArea, handleToggleHomeZipcodes } =
    useCustomerLayerLogic();

  if (!object) return null;

  const place = object as Place;

  const isTradeAreaVisible = visibleTradeAreaIds.has(place.placeId);
  const isHomeZipcodeVisible = visibleHomeZipcodeId === place.placeId;

  const handleShowTradeArea = () => {
    if (!place.hasTradeArea) return;
    handleToggleTradeArea(place.placeId);
  };

  const handleShowHomeZipcodes = () => {
    if (!place.hasHomeZipcodes) return;
    handleToggleHomeZipcodes(place.placeId);
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        left: x + 15,
        top: y + 15,
        p: 1.5,
        width: 280,
        bgcolor: 'background.paper',
        boxShadow: 3,
        borderRadius: 2,
        zIndex: 1100,
        fontSize: '0.8rem',
        border: isPinned ? '1px solid' : 'none',
        borderColor: 'primary.main',
        pointerEvents: isPinned ? 'auto' : 'none',
      }}
    >
      <Typography variant="subtitle2" component="h3">
        {place.name}
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block">
        {place.address}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Industry: {place.industry}
      </Typography>

      {isPinned && (
        <>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            {dataType === 'Trade Area' && (
              <MuiTooltip
                title={
                  !place.hasTradeArea
                    ? 'Trade area data is not available for this location.'
                    : ''
                }
              >
                <span>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleShowTradeArea}
                    disabled={!place.hasTradeArea}
                  >
                    {isTradeAreaVisible ? 'Hide' : 'Show'} Trade Area
                  </Button>
                </span>
              </MuiTooltip>
            )}
            {dataType === 'Home Zipcodes' && (
              <MuiTooltip
                title={
                  !place.hasHomeZipcodes
                    ? 'Customer zip code data is not available for this location.'
                    : ''
                }
              >
                <span>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleShowHomeZipcodes}
                    disabled={!place.hasHomeZipcodes}
                  >
                    {isHomeZipcodeVisible ? 'Hide' : 'Show'} Zip Codes
                  </Button>
                </span>
              </MuiTooltip>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default MapTooltip;
