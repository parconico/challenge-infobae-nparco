"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useArticleActions, useArticleState } from "@/lib/store";
import { Loader2 } from "lucide-react";
import { generateArticleFromUrl } from "@/app/actions/article-actions";
import { useState } from "react";

export default function ArticleGenerationTab() {
  const article = useArticleState();
  const { setInitialArticle } = useArticleActions();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateArticle = async () => {
    if (!article.selectedResult) return;

    setIsGenerating(true);
    try {
      const generatedArticle = await generateArticleFromUrl(
        article.selectedResult.url
      );
      setInitialArticle(generatedArticle);
      //   setActiveArticleTab("reinterpret");
    } catch (error) {
      console.error("Error al generar el articulo:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted/50 rounded-md">
        <h3 className="font-medium mb-2">Fuente seleccionada:</h3>
        <p className="text-sm text-muted-foreground mb-2">
          {article.selectedResult?.title}
        </p>
        <Link
          href={article.selectedResult?.url || ""}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:underline"
        >
          {article.selectedResult?.url}
        </Link>
      </div>

      <Button
        onClick={handleGenerateArticle}
        disabled={isGenerating}
        className="w-full cursor-pointer"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generando articulo...
          </>
        ) : (
          "Generar artículo"
        )}
      </Button>

      {article.initialArticle && (
        <div className="mt-6 p-4 border rounded-md bg-background">
          <h3 className="font-medium mb-2">Articulo generado:</h3>
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{article.initialArticle}</p>
          </div>
        </div>
      )}
    </div>
  );
}
