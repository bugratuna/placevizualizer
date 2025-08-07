import type { Feature, Point, Polygon } from 'geojson';
export type ApiResponse<T> = {
  success: boolean;
  count?: number;
  data: T;
};

export interface ApiPlace {
  _id: string;
  id: string;
  name: string;
  street_address: string;
  city: string;
  state: string;
  logo: string | null;
  longitude: number;
  latitude: number;
  industry: string;
  isTradeAreaAvailable: boolean;
  isHomeZipcodesAvailable: boolean;
}

export interface ApiCompetitor {
  _id: string;
  pid: string;
  name: string;
  street_address: string;
  city: string;
  region: string;
  logo: string | null;
  latitude: number;
  longitude: number;
  sub_category: string;
  trade_area_activity: boolean;
  home_locations_activity: boolean;
  distance: number;
}

export interface ApiCompetitorsResponse {
  competitors: ApiCompetitor[];
}

export interface ApiTradeArea {
  _id: string;
  pid: string;
  polygon: string;
  trade_area: 30 | 50 | 70;
}

export interface ApiHomeZipcodeData {
  pid: string;
  locations: Record<string, number>;
}

export interface ApiZipcodeGeometry {
  id: string;
  polygon: string;
}

export interface TradeAreaResponse {
  pid: string;
  percentile: number;
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][];
  };
}

export interface HomeZipcodeResponse {
  pid: string;
  zipcode: string;
  customerCount: number;
}

export interface Place {
  _id: string;
  placeId: string;
  name: string;
  address: string;
  industry: string;
  location: Feature<Point>;
  hasTradeArea: boolean;
  hasHomeZipcodes: boolean;
  isMyPlace?: boolean;
  logo?: string | null;
}

// --- Mapping Functions ---

export const mapApiPlaceToPlace = (apiPlace: ApiPlace): Place => ({
  _id: apiPlace._id,
  placeId: apiPlace.id,
  name: apiPlace.name,
  address: `${apiPlace.street_address}, ${apiPlace.city}, ${apiPlace.state}`,
  industry: apiPlace.industry,
  location: {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [apiPlace.longitude, apiPlace.latitude],
    },
    properties: {},
  },
  hasTradeArea: apiPlace.isTradeAreaAvailable,
  hasHomeZipcodes: apiPlace.isHomeZipcodesAvailable,
  logo: apiPlace.logo,
  isMyPlace: true,
});

export const mapApiCompetitorToPlace = (
  apiCompetitor: ApiCompetitor
): Place => ({
  _id: apiCompetitor._id,
  placeId: apiCompetitor.pid,
  name: apiCompetitor.name,
  address: `${apiCompetitor.street_address}, ${apiCompetitor.city}, ${apiCompetitor.region}`,
  industry: apiCompetitor.sub_category,
  location: {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [apiCompetitor.longitude, apiCompetitor.latitude],
    },
    properties: {},
  },
  hasTradeArea: apiCompetitor.trade_area_activity,
  hasHomeZipcodes: apiCompetitor.home_locations_activity,
  logo: apiCompetitor.logo,
  isMyPlace: false,
});

export const mapApiTradeAreaToTradeArea = (
  apiTradeArea: ApiTradeArea
): TradeArea => ({
  _id: apiTradeArea._id,
  placeId: apiTradeArea.pid,
  level: apiTradeArea.trade_area,
  geometry: {
    type: 'Feature',
    geometry: JSON.parse(apiTradeArea.polygon),
    properties: {
      level: apiTradeArea.trade_area,
    },
  },
});

export interface TradeArea {
  _id: string;
  placeId: string;
  level: 30 | 50 | 70;
  geometry: Feature<Polygon>;
}

export interface HomeZipcode {
  _id: string;
  placeId: string;
  zipcode: string;
  value: number;
  geometry: Feature<Polygon>;
  quintile?: string;
}
