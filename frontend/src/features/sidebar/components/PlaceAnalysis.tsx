import { useMemo } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Divider,
  Chip,
  OutlinedInput,
  type SelectChangeEvent,
  Switch,
  FormControlLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { usePlaceFilter } from '../../../store/usePlaceFilter';
import { useDataStore } from '../../../store/useDataStore';
import type { Place } from '../../../types';
import { useCompetitorAnalysis } from '../../../store/useCompetitorAnalysis';

const PlaceAnalysis = () => {
  const {
    myPlaceIndustryFilter,
    setMyPlaceIndustryFilter,
    myPlaceCityFilter,
    setMyPlaceCityFilter,
  } = usePlaceFilter();

  const {
    placeAnalysisVisible,
    togglePlaceAnalysis,
    analysisCenterPlaceId,
    setAnalysisCenterPlaceId,
    radius,
    setRadius,
    selectedIndustries,
    setSelectedIndustries,
    competitorsVisible,
    toggleCompetitorsVisibility,
  } = useCompetitorAnalysis();

  const { myPlaces, competitors, loading } = useDataStore();
  const fetchCompetitors = useDataStore((state) => state.fetchCompetitors);
  const clearCompetitors = useDataStore((state) => state.clearCompetitors);

  const uniqueMyPlaceIndustries = useMemo(
    () => [...new Set(myPlaces.map((p) => p.industry))],
    [myPlaces]
  );
  const uniqueMyPlaceCities = useMemo(() => {
    const cities = myPlaces.map((p) => p.address.split(',')[1]?.trim());
    return [...new Set(cities.filter(Boolean))];
  }, [myPlaces]);

  const filteredMyPlaces = useMemo(() => {
    return myPlaces.filter((place) => {
      const cityMatch = myPlaceCityFilter
        ? place.address.includes(myPlaceCityFilter)
        : true;
      const industryMatch = myPlaceIndustryFilter
        ? place.industry === myPlaceIndustryFilter
        : true;
      return cityMatch && industryMatch;
    });
  }, [myPlaces, myPlaceCityFilter, myPlaceIndustryFilter]);

  const uniqueCompetitorIndustries = useMemo(() => {
    if (!competitors || competitors.length === 0) return [];
    return [...new Set(competitors.map((c) => c.industry))];
  }, [competitors]);

  const handleAnalysisCenterChange = (placeId: string | null) => {
    setAnalysisCenterPlaceId(placeId);
    clearCompetitors();
    setSelectedIndustries([]);
  };

  const handleApplyFilters = () => {
    if (analysisCenterPlaceId) {
      setSelectedIndustries([]);
      fetchCompetitors({ placeId: analysisCenterPlaceId, radius });
    }
  };

  const handleClearMyPlacesFilter = () => {
    setMyPlaceIndustryFilter('');
    setMyPlaceCityFilter('');
  };

  const handleCompetitorIndustryChange = (
    event: SelectChangeEvent<string[]>
  ) => {
    const {
      target: { value },
    } = event;
    setSelectedIndustries(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Accordion expanded={placeAnalysisVisible} onChange={togglePlaceAnalysis}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Place Analysis</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Filter My Places
            </Typography>
            <Button
              onClick={handleClearMyPlacesFilter}
              size="small"
              disabled={!myPlaceCityFilter && !myPlaceIndustryFilter}
            >
              Filtreleri Temizle
            </Button>
          </Box>
          <FormControl fullWidth size="small">
            <InputLabel>Industry</InputLabel>
            <Select
              value={myPlaceIndustryFilter}
              label="Industry"
              onChange={(e) =>
                setMyPlaceIndustryFilter(e.target.value as string)
              }
            >
              <MenuItem value="">
                <em>All Industries</em>
              </MenuItem>
              {uniqueMyPlaceIndustries.map((industry) => (
                <MenuItem key={industry} value={industry}>
                  {industry}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>City</InputLabel>
            <Select
              value={myPlaceCityFilter}
              label="City"
              onChange={(e) => setMyPlaceCityFilter(e.target.value as string)}
            >
              <MenuItem value="">
                <em>All Cities</em>
              </MenuItem>
              {uniqueMyPlaceCities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider sx={{ my: 1 }} />

          <Typography variant="subtitle2" color="text.secondary">
            Find Competitors
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Analysis Center</InputLabel>
            <Select
              value={analysisCenterPlaceId || ''}
              label="Analysis Center"
              onChange={(e) =>
                handleAnalysisCenterChange(e.target.value as string)
              }
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {filteredMyPlaces.map((place: Place) => (
                <MenuItem key={place.placeId} value={place.placeId}>
                  {place.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Radius (km)"
            type="number"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            fullWidth
            disabled={!analysisCenterPlaceId}
          />
          <Button
            variant="contained"
            onClick={handleApplyFilters}
            disabled={!analysisCenterPlaceId || loading}
            fullWidth
          >
            {loading ? 'Searching...' : 'Find Competitors'}
          </Button>

          <FormControlLabel
            control={
              <Switch
                checked={competitorsVisible}
                onChange={toggleCompetitorsVisibility}
                disabled={competitors.length === 0}
              />
            }
            label="Hide/Show Competitors"
          />

          {competitors.length > 0 && competitorsVisible && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" color="text.secondary">
                Filter Competitor Results
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="competitor-industry-filter-label">
                  Industry
                </InputLabel>
                <Select
                  labelId="competitor-industry-filter-label"
                  multiple
                  value={selectedIndustries}
                  onChange={handleCompetitorIndustryChange}
                  input={<OutlinedInput label="Industry" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {uniqueCompetitorIndustries.map((industry) => (
                    <MenuItem key={industry} value={industry}>
                      {industry}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
export default PlaceAnalysis;
