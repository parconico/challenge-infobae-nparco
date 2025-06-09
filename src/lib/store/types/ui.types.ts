export interface UiState {
  activeTab: string;
  articleGenerationTab: string;
  orderByRelevance: boolean;
}

export interface UiActions {
  setActiveTab: (tab: string) => void;
  setOrderByRelevance: (value: boolean) => void;
  setArticleGenerationTab: (tab: string) => void;
  resetAll: () => void;
}
