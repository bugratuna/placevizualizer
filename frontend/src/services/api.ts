import axios from 'axios';
import {
  type Place,
  type TradeArea,
  type HomeZipcode,
  type ApiResponse,
  type ApiPlace,
  mapApiPlaceToPlace,
  type ApiCompetitorsResponse,
  mapApiCompetitorToPlace,
  type ApiTradeArea,
  mapApiTradeAreaToTradeArea,
  type ApiZipcodeGeometry,
  type ApiHomeZipcodeData,
  type TradeAreaResponse,
  type HomeZipcodeResponse,
  type CustomerOriginData,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const getMyPlaces = async (): Promise<Place[]> => {
  const response = await apiClient.get<ApiResponse<ApiPlace[]>>('/my-places');
  return response.data.data.map(mapApiPlaceToPlace);
};

export const getCompetitorsForPlace = async (params: {
  placeId: string;
  radius: number;
}): Promise<Place[]> => {
  const { placeId, radius } = params;
  const response = await apiClient.get<ApiResponse<ApiCompetitorsResponse>>(
    `/places/${placeId}/competitors`,
    {
      params: { radius },
    }
  );
  return response.data.data.competitors.map(mapApiCompetitorToPlace);
};

export const getTradeAreaForPlace = async (
  placeId: string
): Promise<TradeArea[]> => {
  const response = await apiClient.get<ApiResponse<ApiTradeArea[]>>(
    `/places/${placeId}/trade-areas`
  );
  return response.data.data.map(mapApiTradeAreaToTradeArea);
};

const getZipcodeGeometry = async (
  zipcode: string
): Promise<ApiZipcodeGeometry | null> => {
  try {
    const response = await apiClient.get<ApiResponse<ApiZipcodeGeometry>>(
      `/zipcodes/${zipcode}`
    );
    return response.data.data;
  } catch (error) {
    console.error(`Could not fetch geometry for zipcode ${zipcode}`, error);
    return null;
  }
};

export const getCustomerOriginData = async (
  placeId: string,
  dataType: CustomerOriginData,
  percentiles?: number[]
): Promise<TradeAreaResponse[] | HomeZipcodeResponse[]> => {
  try {
    const percentilesString = percentiles?.length ? percentiles.join(',') : '';

    const response = await apiClient.get<TradeAreaResponse[] | HomeZipcodeResponse[]>(
        `/places/${placeId}/customer-origin?dataType=${dataType}&percentiles=${percentilesString}`
    );

    return response.data;
  } catch (error) {
    return [];
  }
};

export const getHomeZipcodesForPlace = async (
  placeId: string
): Promise<HomeZipcode[]> => {
  const response = await apiClient.get<ApiResponse<ApiHomeZipcodeData>>(
    `/places/${placeId}/home-zipcodes`
  );
  const homeZipcodeData = response.data.data;

  const parsedLocations = Object.entries(homeZipcodeData.locations).map(
    ([zipcode, value]) => ({
      zipcode,
      value: Number(value),
    })
  );

  const geometryPromises = parsedLocations.map((loc) =>
    getZipcodeGeometry(loc.zipcode)
  );
  const geometries = await Promise.all(geometryPromises);

  const combinedHomeZipcodes: HomeZipcode[] = [];
  parsedLocations.forEach((loc, index) => {
    const geometryData = geometries[index];
    if (geometryData && geometryData.polygon) {
      combinedHomeZipcodes.push({
        _id: `${placeId}-${loc.zipcode}`,
        placeId: homeZipcodeData.pid,
        zipcode: loc.zipcode,
        value: loc.value,
        geometry: {
          type: 'Feature',
          geometry: JSON.parse(geometryData.polygon),
          properties: {
            zipcode: loc.zipcode,
            value: loc.value,
          },
        },
      });
    }
  });

  return combinedHomeZipcodes;
};
