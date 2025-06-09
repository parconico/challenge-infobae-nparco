import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "@/lib/store";

export const useActiveTab = () => useAppStore((state) => state.activeTab);
export const useArticleGenerationTab = () =>
  useAppStore((state) => state.articleGenerationTab);

export const useUiActions = () =>
  useAppStore(
    useShallow((state) => ({
      setActiveTab: state.setActiveTab,
      resetAll: state.resetAll,
      setOrderByRelevance: state.setOrderByRelevance,
      setArticleGenerationTab: state.setArticleGenerationTab,
    }))
  );
