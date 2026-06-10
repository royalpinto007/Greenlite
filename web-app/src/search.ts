import { create } from "zustand";

// Global search query, shared by the top bar and any screen that filters by it.
interface SearchState {
  query: string;
  setQuery: (q: string) => void;
}

export const useGlobalSearch = create<SearchState>((set) => ({
  query: "",
  setQuery: (query) => set({ query }),
}));
