"use client";
import { Button } from "@/components/ui/button";
import { useTitleGeneration } from "@/hooks/useTitleGeneration";
import { Loader2 } from "lucide-react";
import TitleTab from "@/components/article/TitleTab";

export default function TitleGeneration() {
  const { article, setSelectedTitle, handleGenerateTitles, isTitleGenerating } =
    useTitleGeneration();

  const handleSelectTitle = (title: string) => {
    setSelectedTitle(title);
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
                  article.selectedTitle === title
                    ? "bg-primary/10 border-primary"
                    : ""
                }`}
                onClick={() => handleSelectTitle(title)}
              >
                <span className="text-sm text-muted-foreground mr-2">
                  #{index + 1}
                </span>
                {title}
              </div>
            ))}
          </div>
          {article.selectedTitle && (
            <div className="mt-4 p-4  rounded-md">
              <h4 className="font-medium text-green-800 mb-2">
                Titulo seleccionado:
              </h4>
              <p className="text-green-700 font-medium">
                {article.selectedTitle}
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" className="cursor-pointer">
                  Copiar titulo
                </Button>
                <Button size="sm" className="cursor-pointer">
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
