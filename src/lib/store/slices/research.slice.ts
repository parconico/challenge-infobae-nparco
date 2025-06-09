import { StateCreator } from "zustand";
import { ResearchState, ResearchActions, AppState } from "@/lib/store/types";

export const initialResearchState: ResearchState = {
  results: [],
  isLoading: false,
  currentTopic: "",
  worthExpandingResults: [],
  notWorthExpandingResults: [],
};

export const createResearchSlice: StateCreator<
  AppState,
  [],
  [],
  ResearchState & ResearchActions
> = (set) => ({
  ...initialResearchState,

  setResearchResults: (results) =>
    set(() => ({
      results,
      worthExpandingResults: results.filter((r) => r.worthExpanding),
      notWorthExpandingResults: results.filter((r) => !r.worthExpanding),
    })),

  setResearchLoading: (loading) =>
    set(() => ({
      isLoading: loading,
    })),

  setCurrentTopic: (topic) =>
    set(() => ({
      currentTopic: topic,
    })),

  resetResearch: () =>
    set(() => ({
      ...initialResearchState,
    })),
});
