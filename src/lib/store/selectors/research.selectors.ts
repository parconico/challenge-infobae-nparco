import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "@/lib/store";
import { ResearchState } from "@/lib/store/types";

export const useResearchState = () =>
  useAppStore(
    useShallow(
      (state): ResearchState => ({
        results: state.results,
        isLoading: state.isLoading,
        currentTopic: state.currentTopic,
        worthExpandingResults: state.worthExpandingResults,
        notWorthExpandingResults: state.notWorthExpandingResults,
      })
    )
  );

export const useResearchActions = () =>
  useAppStore(
    useShallow((state) => ({
      setResearchResults: state.setResearchResults,
      setResearchLoading: state.setResearchLoading,
      setCurrentTopic: state.setCurrentTopic,
      resetResearch: state.resetResearch,
    }))
  );
