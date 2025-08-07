import { create } from 'zustand';

export interface DeckGLPickInfo {
  x: number;
  y: number;
  object: any;
  layer: any;
  index: number;
}

interface MapState {
  hoveredInfo: DeckGLPickInfo | null;
  pinnedInfo: DeckGLPickInfo | null;
  visibleTradeAreaIds: Set<string>;
  visibleHomeZipcodeId: string | null;

  setHoveredInfo: (info: DeckGLPickInfo | null) => void;
  setPinnedInfo: (info: DeckGLPickInfo | null) => void;
  toggleTradeAreaVisibility: (placeId: string) => void;
  showHomeZipcodesFor: (placeId: string | null) => void;
}

export const useMapStateStore = create<MapState>((set) => ({
  hoveredInfo: null,
  pinnedInfo: null,
  visibleTradeAreaIds: new Set(),
  visibleHomeZipcodeId: null,

  setHoveredInfo: (info) => set({ hoveredInfo: info }),
  setPinnedInfo: (info) => set({ pinnedInfo: info }),

  toggleTradeAreaVisibility: (placeId) =>
    set((state) => {
      const newSet = new Set(state.visibleTradeAreaIds);
      newSet.has(placeId) ? newSet.delete(placeId) : newSet.add(placeId);
      return { visibleTradeAreaIds: newSet };
    }),

  showHomeZipcodesFor: (placeId) =>
    set((state) => {
      if (state.visibleHomeZipcodeId === placeId) {
        return { visibleHomeZipcodeId: null };
      }
      return { visibleHomeZipcodeId: placeId, visibleTradeAreaIds: new Set() };
    }),
}));
