"use client";
import { Button } from "@/components/ui/button";
import { useTitleGeneration } from "@/hooks/useTitleGeneration";
import { Loader2 } from "lucide-react";
import TitleTab from "@/components/article/TitleTab";
import { useUiActions, useArticleState, useArticleActions } from "@/lib/store";
import { useState } from "react";

export default function TitleGeneration() {
  const { article, setSelectedTitle, handleGenerateTitles, isTitleGenerating } =
    useTitleGeneration();
  const { setArticleGenerationTab } = useUiActions();
  const { reinterpretedArticle } = useArticleState();
  const { setReinterpretedArticle } = useArticleActions();

  // Estado local como activador
  const [isTitleSelected, setIsTitleSelected] = useState<string>("");

  const handleCopyTitle = () => {
    navigator.clipboard.writeText(article.selectedTitle);
  };

  const handleUseTitle = () => {
    if (reinterpretedArticle.length > 0) {
      // Obtenemos el último artículo reinterpretado
      const lastArticle = reinterpretedArticle[reinterpretedArticle.length - 1];

      // Separamos el contenido en líneas y reemplazamos el título
      const lines = lastArticle.split("\n");
      const newArticle = [isTitleSelected, ...lines.slice(1)].join("\n");

      // Actualizamos el artículo reinterpretado
      setReinterpretedArticle(newArticle);
    }

    setSelectedTitle(isTitleSelected);
    setArticleGenerationTab("integration");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <TitleTab />
        <Button onClick={handleGenerateTitles} disabled={isTitleGenerating}>
          {isTitleGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generando...
            </>
          ) : (
            "Generar títulos"
          )}
        </Button>
      </div>
      {article.generatedTitles.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Titulos generados:</h3>
          <div className="space-y-2">
            {article.generatedTitles.map((title, index) => (
              <div
                key={index}
                className={`p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors ${
                  isTitleSelected === title
                    ? "bg-primary/10 border-primary"
                    : ""
                }`}
                onClick={() => setIsTitleSelected(title)}
              >
                <span className="text-sm text-muted-foreground mr-2">
                  #{index + 1}
                </span>
                {title}
              </div>
            ))}
          </div>

          {isTitleSelected && (
            <div className="mt-4 p-4 rounded-md">
              <h4 className="font-medium text-green-800 mb-2">
                Titulo seleccionado:
              </h4>
              <p className="text-green-700 font-medium">{isTitleSelected}</p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={handleCopyTitle}
                >
                  Copiar titulo
                </Button>
                <Button
                  size="sm"
                  className="cursor-pointer"
                  onClick={handleUseTitle}
                >
                  Usar en editor
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
