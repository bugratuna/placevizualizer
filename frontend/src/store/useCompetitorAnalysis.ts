import { create } from 'zustand';

interface CompetitorAnalysisState {
  // states
  placeAnalysisVisible: boolean;
  competitorsVisible: boolean;
  analysisCenterPlaceId: string | null;
  radius: number;
  selectedIndustries: string[];

  // actions
  togglePlaceAnalysis: () => void;
  toggleCompetitorsVisibility: () => void;
  setAnalysisCenterPlaceId: (placeId: string | null) => void;
  setRadius: (radius: number) => void;
  setSelectedIndustries: (industries: string[]) => void;
}

export const useCompetitorAnalysis = create<CompetitorAnalysisState>((set) => ({
  placeAnalysisVisible: true,
  competitorsVisible: true,
  analysisCenterPlaceId: null,
  radius: 5,
  selectedIndustries: [],

  togglePlaceAnalysis: () =>
    set((state) => ({ placeAnalysisVisible: !state.placeAnalysisVisible })),
  toggleCompetitorsVisibility: () =>
    set((state) => ({ competitorsVisible: !state.competitorsVisible })),
  setAnalysisCenterPlaceId: (placeId) =>
    set({ analysisCenterPlaceId: placeId }),
  setRadius: (radius) => set({ radius }),
  setSelectedIndustries: (industries) =>
    set({ selectedIndustries: industries }),
}));
