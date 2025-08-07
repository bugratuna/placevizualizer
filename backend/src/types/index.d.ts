import { Document } from "mongoose";

export interface IPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface IPolygon {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][];
}

export interface TradeAreaResponse {
  pid: string;
  percentile: number;
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][];
  };
}

export interface HomeZipcodeResponse {
  pid: string;
  zipcode: string;
  customerCount: number;
}

export interface ITradeAreaBase {
  pid: string;
  trade_area: number;
  polygon: IPolygon;
}
export interface ITradeArea extends ITradeAreaBase, Document {}

export interface IMyPlaceBase {
  id: string;
  name: string;
  street_address: string;
  city: string;
  state: string;
  logo: string | null;
  longitude: number;
  latitude: number;
  location: IPoint;
  industry: string;
  isTradeAreaAvailable: boolean;
  isHomeZipcodesAvailable: boolean;
}
export interface IMyPlace extends IMyPlaceBase, Document {}

export interface IHomeZipcodeBase {
  pid: string;
  locations: Map<string, number>;
}
export interface IHomeZipcode extends IHomeZipcodeBase, Document {}

export interface ICompetitorBase {
  _id: string;
  pid: string;
  name: string;
  latitude: number;
  longitude: number;
  location: IPoint;
  street_address: string;
  sub_category: string;
  city: string;
  region: string;
  logo: string | null;
  trade_area_activity: boolean;
  home_locations_activity: boolean;
  distance: number;
}
export interface ICompetitor extends ICompetitorBase, Document {}

export interface IZipcodeBase {
  id: string;
  polygon: IPolygon;
}
export interface IZipcode extends IZipcodeBase, Document {}
