import { StateCreator } from "zustand";
import { UiState, UiActions, AppState } from "@/lib/store/types";
import { initialArticleState } from "@/lib/store/slices/article.slice";
import { initialResearchState } from "@/lib/store/slices/research.slice";

const initialUiState: UiState = {
  activeTab: "research",
  articleGenerationTab: "generate",
  orderByRelevance: false,
};

export const createUiSlice: StateCreator<
  AppState,
  [],
  [],
  UiState & UiActions
> = (set) => ({
  ...initialUiState,

  setActiveTab: (tab) =>
    set(() => ({
      activeTab: tab,
    })),

  setOrderByRelevance: (value) =>
    set(() => ({
      orderByRelevance: value,
    })),

  setArticleGenerationTab: (tab) =>
    set(() => ({
      articleGenerationTab: tab,
    })),

  resetAll: () =>
    set(() => ({
      ...initialUiState,
      ...initialResearchState,
      ...initialArticleState,
    })),
});
