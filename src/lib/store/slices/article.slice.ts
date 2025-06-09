import { StateCreator } from "zustand";
import { ArticleState, ArticleActions, AppState } from "@/lib/store/types";

export const initialArticleState: ArticleState = {
  initialArticle: "",
  reinterpretedArticle: [],
  generatedTitles: [],
  selectedTitle: "",
  selectedResult: null,
  titleCount: "3",
};

export const createArticleSlice: StateCreator<
  AppState,
  [],
  [],
  ArticleState & ArticleActions
> = (set) => ({
  ...initialArticleState,

  setSelectedResult: (result) =>
    set(() => ({
      selectedResult: result,
    })),

  setInitialArticle: (article) =>
    set(() => ({
      initialArticle: article,
    })),

  setReinterpretedArticle: (article) =>
    set((state) => ({
      reinterpretedArticle: [...state.reinterpretedArticle, article],
    })),

  setGeneratedTitles: (titles) =>
    set(() => ({
      generatedTitles: titles,
    })),

  setSelectedTitle: (title) =>
    set(() => ({
      selectedTitle: title,
    })),

  setTitleCount: (count) =>
    set(() => ({
      titleCount: count,
    })),

  resetArticle: () =>
    set(() => ({
      ...initialArticleState,
    })),
});
