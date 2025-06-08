import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { ResearchResult } from "@/lib/types";
import { useShallow } from "zustand/react/shallow";

export interface ArticleState {
  initialArticle: string;
  reinterpretedArticle: string[];
  generatedTitles: string[];
  selectedTitle: string;
  selectedResult: ResearchResult | null;
  titleCount: string;
}

export interface ResearchState {
  results: ResearchResult[];
  isLoading: boolean;
  currentTopic: string;
  worthExpandingResults: ResearchResult[];
  notWorthExpandingResults: ResearchResult[];
}

export interface AppState {
  //Research state
  research: ResearchState;

  //Article generation state
  article: ArticleState;

  // UI state
  activeTab: string;

  // Actions
  setResearchResults: (results: ResearchResult[]) => void;
  setResearchLoading: (loading: boolean) => void;
  setCurrentTopic: (topic: string) => void;

  setSelectedResult: (result: ResearchResult | null) => void;
  setSelectedTitle: (title: string) => void;
  setReinterpretedArticle: (article: string) => void;
  setInitialArticle: (article: string) => void;
  setGeneratedTitles: (titles: string[]) => void;
  setTitleCount: (count: string) => void;

  setActiveTab: (tab: string) => void;

  //Reset functions
  resetResearch: () => void;
  resetArticle: () => void;
  resetAll: () => void;
}

const initialResearchState: ResearchState = {
  results: [],
  isLoading: false,
  currentTopic: "",
  worthExpandingResults: [],
  notWorthExpandingResults: [],
};

const initialArticleState: ArticleState = {
  initialArticle: "",
  reinterpretedArticle: [],
  generatedTitles: [],
  selectedTitle: "",
  selectedResult: null,
  titleCount: "3",
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        research: initialResearchState,
        article: initialArticleState,
        activeTab: "research",

        // Research actions
        setResearchResults: (results) =>
          set(
            (state) => ({
              research: {
                ...state.research,
                results,
                worthExpandingResults: results.filter((r) => r.worthExpanding),
                notWorthExpandingResults: results.filter(
                  (r) => !r.worthExpanding
                ),
              },
            }),
            false,
            "setResearchResults"
          ),

        setResearchLoading: (loading) =>
          set(
            (state) => ({
              research: { ...state.research, isLoading: loading },
            }),
            false,
            "setResearchLoading"
          ),

        setCurrentTopic: (topic) =>
          set(
            (state) => ({
              research: { ...state.research, currentTopic: topic },
            }),
            false,
            "setCurrentTopic"
          ),

        //Article actions
        setSelectedResult: (result) =>
          set(
            (state) => ({
              article: { ...state.article, selectedResult: result },
            }),
            false,
            "setSelectedResult"
          ),

        setInitialArticle: (article) =>
          set(
            (state) => ({
              article: { ...state.article, initialArticle: article },
            }),
            false,
            "setInitialArticle"
          ),

        setReinterpretedArticle: (article) =>
          set(
            (state) => ({
              article: {
                ...state.article,
                reinterpretedArticle: [
                  ...state.article.reinterpretedArticle,
                  article,
                ],
              },
            }),
            false,
            "setReinterpretedArticle"
          ),

        setGeneratedTitles: (titles) =>
          set(
            (state) => ({
              article: { ...state.article, generatedTitles: titles },
            }),
            false,
            "setGeneratedTitles"
          ),

        setSelectedTitle: (title) =>
          set(
            (state) => ({
              article: { ...state.article, selectedTitle: title },
            }),
            false,
            "setSelectedTitle"
          ),

        // Selector de titulos

        setTitleCount: (count: string) =>
          set(
            (state) => ({
              article: { ...state.article, titleCount: count },
            }),
            false,
            "setTitleCount"
          ),

        // UI actions
        setActiveTab: (tab) =>
          set(
            () => ({
              activeTab: tab,
            }),
            false,
            "setActiveTab"
          ),

        // Reset functions
        resetResearch: () =>
          set(
            () => ({
              research: initialResearchState,
            }),
            false,
            "resetResearch"
          ),

        resetArticle: () =>
          set(
            () => ({
              article: initialArticleState,
            }),
            false,
            "resetArticle"
          ),

        resetAll: () =>
          set(
            () => ({
              research: initialResearchState,
              article: initialArticleState,
              activeTab: "research",
            }),
            false,
            "resetAll"
          ),
      }),
      {
        name: "research-tool-store",
        // Solo persistir el estado de artículos para mantener el trabajo del usuario
        partialize: (state) => ({
          article: state.article,
        }),
      }
    )
  )
);

// Selectors for easier access to the store state
export const useResearchState = () => useAppStore((state) => state.research);
export const useArticleState = () => useAppStore((state) => state.article);
export const useActiveTab = () => useAppStore((state) => state.activeTab);

// Action selectors
export const useResearchActions = () =>
  useAppStore(
    useShallow((state) => ({
      setResearchResults: state.setResearchResults,
      setResearchLoading: state.setResearchLoading,
      setCurrentTopic: state.setCurrentTopic,
      resetResearch: state.resetResearch,
    }))
  );

export const useArticleActions = () =>
  useAppStore(
    useShallow((state) => ({
      setSelectedResult: state.setSelectedResult,
      setInitialArticle: state.setInitialArticle,
      setReinterpretedArticle: state.setReinterpretedArticle,
      setGeneratedTitles: state.setGeneratedTitles,
      setSelectedTitle: state.setSelectedTitle,
      resetArticle: state.resetArticle,
      setTitleCount: state.setTitleCount,
    }))
  );

export const useUiActions = () =>
  useAppStore(
    useShallow((state) => ({
      setActiveTab: state.setActiveTab,
      resetAll: state.resetAll,
    }))
  );
