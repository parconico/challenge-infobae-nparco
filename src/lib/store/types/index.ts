import { ArticleState, ArticleActions } from "@/lib/store/types/article.types";
import {
  ResearchState,
  ResearchActions,
} from "@/lib/store/types/research.types";
import { UiState, UiActions } from "@/lib/store/types/ui.types";

export * from "@/lib/store/types/article.types";
export * from "@/lib/store/types/research.types";
export * from "@/lib/store/types/ui.types";

export interface AppState
  extends ArticleState,
    ResearchState,
    UiState,
    ArticleActions,
    ResearchActions,
    UiActions {}
