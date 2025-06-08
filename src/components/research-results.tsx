/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useAppStore,
  useArticleActions,
  useResearchState,
  useUiActions,
} from "@/lib/store";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { ResultCard } from "./research/ResultCard";
import ResultStats from "./research/ResultStats";

export default function ResearchResults() {
  const { worthExpandingResults, notWorthExpandingResults } =
    useResearchState();
  const { setSelectedResult } = useArticleActions();
  const { setActiveTab } = useUiActions();
  const orderByRelevance = useAppStore((state) => state.orderByRelevance);

  const handleSelectResult = (result: any) => {
    setSelectedResult(result);
    setActiveTab("article");
  };

  const sortedWorthExpanding = [...worthExpandingResults].sort((a, b) =>
    orderByRelevance ? b.score - a.score : a.score - b.score
  );
  const sortedNotWorthExpanding = [...notWorthExpandingResults].sort((a, b) =>
    orderByRelevance ? b.score - a.score : a.score - b.score
  );

  return (
    <div className="space-y-8">
      {/*Statistics Results*/}
      <ResultStats />

      {/*Worth Expanding Results*/}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <ThumbsUp className="w-5 h-5 mr-2 text-green-500" />
          Valen la pena expandir ({sortedWorthExpanding.length})
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {sortedWorthExpanding.map((result) => (
            <ResultCard
              key={result.id}
              result={result}
              onSelect={handleSelectResult}
              variant="expandable"
            />
          ))}
        </div>
      </div>

      {/*Not Worth Expanding Results*/}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <ThumbsDown className="w-5 h-5 mr-2 text-red-500" />
          No valen la pena expandir ({sortedNotWorthExpanding.length})
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {sortedNotWorthExpanding.map((result) => (
            <ResultCard
              key={result.id}
              result={result}
              onSelect={handleSelectResult}
              variant="not-expandable"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
