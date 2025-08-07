import { create } from 'zustand';

interface CustomerAnalysisState {
  // States
  customerAnalysisVisible: boolean;
  dataType: 'Trade Area' | 'Home Zipcodes';
  selectedTradeAreaPercentages: number[];

  // Actions
  toggleCustomerAnalysis: () => void;
  setDataType: (type: 'Trade Area' | 'Home Zipcodes') => void;
  toggleTradeAreaPercentage: (percentage: number) => void;
}

export const useCustomerAnalysis = create<CustomerAnalysisState>((set) => ({
  customerAnalysisVisible: true,
  dataType: 'Trade Area',
  selectedTradeAreaPercentages: [30, 50, 70],

  // --- ACTIONS ---
  toggleCustomerAnalysis: () =>
    set((state) => ({
      customerAnalysisVisible: !state.customerAnalysisVisible,
    })),
  setDataType: (type) => set({ dataType: type }),
  toggleTradeAreaPercentage: (percentage) =>
    set((state) => {
      const isSelected =
        state.selectedTradeAreaPercentages.includes(percentage);
      const newPercentages = isSelected
        ? state.selectedTradeAreaPercentages.filter((p) => p !== percentage)
        : [...state.selectedTradeAreaPercentages, percentage];
      return { selectedTradeAreaPercentages: newPercentages };
    }),
}));
