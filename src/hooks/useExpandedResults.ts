import { useState } from "react";

export function useExpandedResults() {
  const [expandedResults, setExpandedResults] = useState<
    Record<string, boolean>
  >({});

  const toggleExpand = (id: string) => {
    setExpandedResults((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return { expandedResults, toggleExpand };
}
