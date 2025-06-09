import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "@/lib/store";
import { ArticleState } from "@/lib/store/types";

export const useArticleState = () =>
  useAppStore(
    useShallow(
      (state): ArticleState => ({
        initialArticle: state.initialArticle,
        reinterpretedArticle: state.reinterpretedArticle,
        generatedTitles: state.generatedTitles,
        selectedTitle: state.selectedTitle,
        selectedResult: state.selectedResult,
        titleCount: state.titleCount,
      })
    )
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
