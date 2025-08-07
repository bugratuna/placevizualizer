import { create } from 'zustand';

interface PlaceFilterState {
  // States
  myPlaceIndustryFilter: string;
  myPlaceCityFilter: string;

  // Actions
  setMyPlaceIndustryFilter: (industry: string) => void;
  setMyPlaceCityFilter: (city: string) => void;
}

export const usePlaceFilter = create<PlaceFilterState>((set) => ({
  myPlaceIndustryFilter: '',
  myPlaceCityFilter: '',

  // --- ACTIONS ---
  setMyPlaceIndustryFilter: (industry) =>
    set({ myPlaceIndustryFilter: industry }),
  setMyPlaceCityFilter: (city) => set({ myPlaceCityFilter: city }),
}));
