import type { ResearchResult } from "@/lib/types";

export interface ArticleState {
  initialArticle: string;
  reinterpretedArticle: string[];
  generatedTitles: string[];
  selectedTitle: string;
  selectedResult: ResearchResult | null;
  titleCount: string;
}

export interface ArticleActions {
  setSelectedResult: (result: ResearchResult | null) => void;
  setSelectedTitle: (title: string) => void;
  setReinterpretedArticle: (article: string) => void;
  setInitialArticle: (article: string) => void;
  setGeneratedTitles: (titles: string[]) => void;
  setTitleCount: (count: string) => void;
  resetArticle: () => void;
}
