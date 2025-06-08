"use client";

import { generateTitlesFromArticle } from "@/app/actions/article-actions";
import { useArticleActions, useArticleState } from "@/lib/store";
import { useState } from "react";

export function useTitleGeneration() {
  const article = useArticleState();
  const titleCount = article.titleCount;
  const { setSelectedTitle, setGeneratedTitles, setTitleCount } =
    useArticleActions();
  const [isTitleGenerating, setIsTitleGenerating] = useState(false);

  const handleGenerateTitles = async () => {
    if (!article.initialArticle) return;

    setIsTitleGenerating(true);
    try {
      const generatedTitles = await generateTitlesFromArticle(
        article.initialArticle,
        Number.parseInt(titleCount)
      );
      setGeneratedTitles(generatedTitles);
    } catch (error) {
      console.error("Error al generar los titulos:", error);
    } finally {
      setIsTitleGenerating(false);
    }
  };

  return {
    article,
    handleGenerateTitles,
    titleCount,
    setTitleCount,
    setSelectedTitle,
    isTitleGenerating,
  };
}
