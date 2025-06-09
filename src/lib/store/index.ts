import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AppState } from "@/lib/store/types";
import { createArticleSlice } from "@/lib/store/slices/article.slice";
import { createResearchSlice } from "@/lib/store/slices/research.slice";
import { createUiSlice } from "@/lib/store/slices/ui.slice";

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (...a) => ({
        ...createArticleSlice(...a),
        ...createResearchSlice(...a),
        ...createUiSlice(...a),
      }),
      {
        name: "research-tool-store",
        partialize: (state) => ({
          initialArticle: state.initialArticle,
          reinterpretedArticle: state.reinterpretedArticle,
          generatedTitles: state.generatedTitles,
          selectedTitle: state.selectedTitle,
          selectedResult: state.selectedResult,
          titleCount: state.titleCount,
        }),
      }
    )
  )
);

export * from "./types";
export * from "./selectors/article.selectors";
export * from "./selectors/research.selectors";
export * from "./selectors/ui.selectors";
