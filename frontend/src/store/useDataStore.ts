import { create } from 'zustand';
import type { Place, TradeArea, HomeZipcode } from '../types';
import {
  getMyPlaces,
  getTradeAreaForPlace,
  getHomeZipcodesForPlace,
  getCompetitorsForPlace,
} from '../services/api';

interface DataState {
  myPlaces: Place[];
  competitors: Place[];
  tradeAreas: Record<string, TradeArea[]>;
  homeZipcodes: Record<string, HomeZipcode[]>;
  loading: boolean;
  error: string | null;
  fetchMyPlaces: () => Promise<void>;
  fetchCompetitors: (params: {
    placeId: string;
    radius: number;
  }) => Promise<void>;
  fetchTradeArea: (placeId: string) => Promise<void>;
  fetchHomeZipcodes: (placeId: string) => Promise<void>;
  clearCompetitors: () => void;
  clearError: () => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  myPlaces: [],
  competitors: [],
  tradeAreas: {},
  homeZipcodes: {},
  loading: false,
  error: null,

  fetchMyPlaces: async () => {
    set({ loading: true, error: null });
    try {
      const myPlaces = await getMyPlaces();
      set({ myPlaces });
    } catch (error) {
      console.error('Failed to fetch my places:', error);
      set({ error: 'There was an error while retrieving place data.' });
    } finally {
      set({ loading: false });
    }
  },

  fetchCompetitors: async (params) => {
    set({ loading: true, competitors: [], error: null });
    try {
      const competitors = await getCompetitorsForPlace(params);
      set({ competitors });
    } catch (error) {
      console.error('Failed to fetch competitors:', error);
      set({ error: 'There was an error while retrieving competitor data.' });
    } finally {
      set({ loading: false });
    }
  },

  clearCompetitors: () => set({ competitors: [] }),
  clearError: () => set({ error: null }),

  fetchTradeArea: async (placeId) => {
    if (get().tradeAreas[placeId]) return;
    set({ loading: true, error: null });
    try {
      const data = await getTradeAreaForPlace(placeId);
      set((state) => ({
        tradeAreas: { ...state.tradeAreas, [placeId]: data },
      }));
    } catch (error) {
      console.error(`Failed to fetch trade area for ${placeId}:`, error);
      set({
        error: `There was an error while retrieving trade area data (${placeId}).`,
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchHomeZipcodes: async (placeId) => {
    if (get().homeZipcodes[placeId]) return;
    set({ loading: true, error: null });
    try {
      const data = await getHomeZipcodesForPlace(placeId);
      set((state) => ({
        homeZipcodes: { ...state.homeZipcodes, [placeId]: data },
      }));
    } catch (error) {
      console.error(`Failed to fetch home zipcodes for ${placeId}:`, error);
      set({
        error: `There was an error while retrieving customer zip code data (${placeId})..`,
      });
    } finally {
      set({ loading: false });
    }
  },
}));
