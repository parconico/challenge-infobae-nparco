import type { ResearchResult } from "@/lib/types";

export interface ResearchState {
  results: ResearchResult[];
  isLoading: boolean;
  currentTopic: string;
  worthExpandingResults: ResearchResult[];
  notWorthExpandingResults: ResearchResult[];
}

export interface ResearchActions {
  setResearchResults: (results: ResearchResult[]) => void;
  setResearchLoading: (loading: boolean) => void;
  setCurrentTopic: (topic: string) => void;
  resetResearch: () => void;
}
