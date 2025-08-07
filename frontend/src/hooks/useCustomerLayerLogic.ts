import { useCustomerAnalysis } from '../store/useCustomerAnalysis';
import { useMapStateStore } from '../store/useMapStateStore';
import { useDataStore } from '../store/useDataStore';
import { useCompetitorAnalysis } from '../store/useCompetitorAnalysis';

export const useCustomerLayerLogic = () => {
  const {
    dataType,
    setDataType,
    selectedTradeAreaPercentages,
    toggleTradeAreaPercentage,
  } = useCustomerAnalysis();
  const { analysisCenterPlaceId } = useCompetitorAnalysis();

  const {
    visibleTradeAreaIds,
    visibleHomeZipcodeId,
    toggleTradeAreaVisibility,
    showHomeZipcodesFor,
  } = useMapStateStore();

  const { fetchTradeArea, fetchHomeZipcodes } = useDataStore();

  const isDataVisible =
    (dataType === 'Trade Area' &&
      visibleTradeAreaIds.has(analysisCenterPlaceId || '')) ||
    (dataType === 'Home Zipcodes' &&
      visibleHomeZipcodeId === analysisCenterPlaceId);

  const handleToggleVisibility = () => {
    if (!analysisCenterPlaceId) return;

    if (isDataVisible) {
      if (dataType === 'Trade Area') {
        toggleTradeAreaVisibility(analysisCenterPlaceId);
      } else {
        showHomeZipcodesFor(null);
      }
    } else {
      if (dataType === 'Trade Area') {
        fetchTradeArea(analysisCenterPlaceId);
        toggleTradeAreaVisibility(analysisCenterPlaceId);
      } else {
        fetchHomeZipcodes(analysisCenterPlaceId);
        showHomeZipcodesFor(analysisCenterPlaceId);
      }
    }
  };

  const handleToggleTradeArea = (placeId: string) => {
    if (visibleTradeAreaIds.has(placeId)) {
      toggleTradeAreaVisibility(placeId);
    } else {
      fetchTradeArea(placeId);
      toggleTradeAreaVisibility(placeId);
    }
  };

  const handleToggleHomeZipcodes = (placeId: string) => {
    if (visibleHomeZipcodeId === placeId) {
      showHomeZipcodesFor(null);
    } else {
      fetchHomeZipcodes(placeId);
      showHomeZipcodesFor(placeId);
    }
  };

  const handleSwitchDataType = (
    newDataType: 'Trade Area' | 'Home Zipcodes'
  ) => {
    setDataType(newDataType);
    if (newDataType === 'Home Zipcodes' && visibleTradeAreaIds.size > 0) {
      visibleTradeAreaIds.forEach((id) => toggleTradeAreaVisibility(id));
    } else if (newDataType === 'Trade Area' && visibleHomeZipcodeId) {
      showHomeZipcodesFor(null);
    }
  };

  return {
    dataType,
    selectedTradeAreaPercentages,
    toggleTradeAreaPercentage,
    isDataVisible,
    handleToggleVisibility,
    handleSwitchDataType,
    handleToggleTradeArea,
    handleToggleHomeZipcodes,
    analysisCenterPlaceId,
  };
};
