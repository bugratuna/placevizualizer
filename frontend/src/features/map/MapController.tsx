import { useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import Map from 'react-map-gl/mapbox';
import type { PickingInfo } from '@deck.gl/core';
import { ScatterplotLayer, PolygonLayer } from '@deck.gl/layers';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useDataStore } from '../../store/useDataStore';
import { usePlaceFilter } from '../../store/usePlaceFilter';
import { useCustomerAnalysis } from '../../store/useCustomerAnalysis';
import {
  type DeckGLPickInfo,
  useMapStateStore,
} from '../../store/useMapStateStore';
import {
  TRADE_AREA_COLORS,
  ZIPCODE_PERCENTILE_COLORS,
} from '../../config/colors';
import MapTooltip from './components/MapTooltip';
import type { Place, HomeZipcode, TradeArea } from '../../types';
import { useCompetitorAnalysis } from '../../store/useCompetitorAnalysis';

// A more specific type for zipcode data that includes our calculated quintile.
type ZipcodeWithQuintile = HomeZipcode & { quintile: string };

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const MAP_STYLE = 'mapbox://styles/mapbox/dark-v11';

const INITIAL_VIEW_STATE = {
  longitude: -104.7,
  latitude: 38.95,
  zoom: 10,
  pitch: 20,
  bearing: 0,
};

const MapController = () => {
  const { myPlaces, competitors, tradeAreas, homeZipcodes } = useDataStore();
  const { myPlaceCityFilter, myPlaceIndustryFilter } = usePlaceFilter();
  const { analysisCenterPlaceId, selectedIndustries, competitorsVisible } =
    useCompetitorAnalysis();
  const { selectedTradeAreaPercentages } = useCustomerAnalysis();
  const { setHoveredInfo, setPinnedInfo, hoveredInfo, pinnedInfo } =
    useMapStateStore();
  const { visibleTradeAreaIds, visibleHomeZipcodeId } = useMapStateStore();
  const homeZipcodesToRender = useMemo((): ZipcodeWithQuintile[] => {
    const activeZipcodes = visibleHomeZipcodeId
      ? homeZipcodes[visibleHomeZipcodeId]
      : [];
    if (!activeZipcodes || activeZipcodes.length === 0) return [];

    const sorted = [...activeZipcodes].sort((a, b) => a.value - b.value);
    const count = sorted.length;
    if (count === 0) return [];

    return sorted.map((zip, index) => {
      const percentileRank = (index + 1) / count;
      let quintile = '80-100';
      if (percentileRank <= 0.2) quintile = '0-20';
      else if (percentileRank <= 0.4) quintile = '20-40';
      else if (percentileRank <= 0.6) quintile = '40-60';
      else if (percentileRank <= 0.8) quintile = '60-80';

      return { ...zip, quintile };
    });
  }, [homeZipcodes, visibleHomeZipcodeId]);

  const layers = useMemo(() => {
    const filteredMyPlaces = myPlaces.filter((place) => {
      const cityMatch = myPlaceCityFilter
        ? place.address.includes(myPlaceCityFilter)
        : true;
      const industryMatch = myPlaceIndustryFilter
        ? place.industry === myPlaceIndustryFilter
        : true;
      return cityMatch && industryMatch;
    });

    const myPlacesLayer = new ScatterplotLayer<Place>({
      id: 'my-places-layer',
      data: filteredMyPlaces,
      getPosition: (d) => d.location.geometry.coordinates as [number, number],
      pickable: true,
      stroked: true,
      lineWidthUnits: 'meters',
      getFillColor: (d) =>
        d.placeId === analysisCenterPlaceId
          ? [255, 100, 0, 255]
          : [255, 140, 0, 200],
      getRadius: (d) => (d.placeId === analysisCenterPlaceId ? 1000 : 500),
      getLineWidth: (d) => (d.placeId === analysisCenterPlaceId ? 200 : 0),
      getLineColor: [255, 255, 255],
    });

    const filteredCompetitors =
      selectedIndustries.length > 0
        ? competitors.filter((c) => selectedIndustries.includes(c.industry))
        : competitors;

    const competitorsLayer = new ScatterplotLayer<Place>({
      id: 'competitors-layer',
      data: competitorsVisible ? filteredCompetitors : [],
      getPosition: (d) => d.location.geometry.coordinates as [number, number],
      getFillColor: [0, 128, 255, 180],
      getRadius: 300,
      pickable: true,
    });

    const tradeAreasToRender = Array.from(visibleTradeAreaIds)
      .flatMap((placeId) => tradeAreas[placeId] || [])
      .filter((area) => selectedTradeAreaPercentages.includes(area.level));

    const tradeAreaLayer = new PolygonLayer<TradeArea>({
      id: 'trade-area-layer',
      data: tradeAreasToRender,
      getPolygon: (d) => d.geometry.geometry.coordinates,
      getFillColor: (d) =>
        // The type assertion should be outside the fallback logic for correctness.
        (TRADE_AREA_COLORS[d.level] || [255, 255, 255, 50]) as [
          number,
          number,
          number,
          number,
        ],
      stroked: true,
      getLineColor: [255, 255, 255],
      lineWidthMinPixels: 1,
    });

    const homeZipcodeLayer = new PolygonLayer<ZipcodeWithQuintile>({
      id: 'home-zipcode-layer',
      data: homeZipcodesToRender,
      getPolygon: (d) => d.geometry.geometry.coordinates,
      getFillColor: (d) =>
        (ZIPCODE_PERCENTILE_COLORS[d.quintile] || [128, 128, 128, 128]) as [
          number,
          number,
          number,
          number,
        ],
      stroked: true,
      getLineColor: [255, 255, 255],
      lineWidthMinPixels: 0.5,
      getLineWidth: 5,
    });

    return [myPlacesLayer, competitorsLayer, tradeAreaLayer, homeZipcodeLayer];
  }, [
    myPlaces,
    competitors,
    tradeAreas,
    myPlaceCityFilter,
    myPlaceIndustryFilter,
    analysisCenterPlaceId,
    selectedIndustries,
    visibleTradeAreaIds,
    homeZipcodesToRender,
    selectedTradeAreaPercentages,
    competitorsVisible,
  ]);

  const handleObjectClick = (info: PickingInfo) => {
    setPinnedInfo(info && info.object ? (info as DeckGLPickInfo) : null);
  };

  const handleObjectHover = (info: PickingInfo) => {
    if (!pinnedInfo) {
      setHoveredInfo(info && info.object ? (info as DeckGLPickInfo) : null);
    }
  };

  const tooltipInfo = pinnedInfo || hoveredInfo;

  return (
    <DeckGL
      layers={layers}
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      onHover={handleObjectHover}
      onClick={handleObjectClick}
      getCursor={({ isDragging, isHovering }) =>
        isDragging ? 'grabbing' : isHovering ? 'pointer' : 'grab'
      }
    >
      <Map mapboxAccessToken={MAPBOX_ACCESS_TOKEN} mapStyle={MAP_STYLE} />
      {tooltipInfo && <MapTooltip info={tooltipInfo} isPinned={!!pinnedInfo} />}
    </DeckGL>
  );
};

export default MapController;
