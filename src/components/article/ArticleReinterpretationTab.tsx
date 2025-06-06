"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, FileText } from "lucide-react";
import { useArticleChat } from "@/hooks/useArticleChat";
import { useArticleState } from "@/lib/store";

export function ArticleReinterpretationTab() {
  const { initialArticle } = useArticleState();
  const {
    messages,
    input,
    setInput,
    reinterpretArticle,
    isLoading,
    hasArticle,
  } = useArticleChat();

  const latestAssistantMessage = messages
    .filter((m) => m.role === "assistant")
    .pop();

  if (!hasArticle) {
    return (
      <div className="space-y-4 py-4">
        <p> Primero debes generar un artículo para poder reinterpretarlo </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      {/* Mostrar el artículo original */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center mb-2">
            <FileText className="h-4 w-4 mr-2" />
            <h3 className="font-medium">Artículo original:</h3>
          </div>
          <div className="prose prose-sm max-w-none bg-muted/50 p-3 rounded-md">
            <p className="whitespace-pre-wrap text-sm">{initialArticle}</p>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de reinterpretación */}
      <form onSubmit={reinterpretArticle} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prompt">
            Instrucciones para reinterpretar el artículo:
          </Label>
          <Textarea
            id="prompt"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ej: Hazlo más formal, añade ejemplos prácticos, simplifica el lenguaje técnico, cambia el tono a más casual..."
            className="min-h-[120px]"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Reinterpretando artículo...
            </>
          ) : (
            "Reinterpretar artículo"
          )}
        </Button>
      </form>

      {/* Mostrar el artículo reinterpretado */}
      {latestAssistantMessage && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Artículo reinterpretado:
            </h3>
            <div className="prose prose-sm max-w-none p-3 rounded-md border bg-muted">
              <div className="whitespace-pre-wrap text-sm">
                {latestAssistantMessage.content}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mostrar historial de mensajes si hay más de uno */}
      {messages.length > 2 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">
              Historial de reinterpretaciones:
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {messages
                .filter((m) => m.role === "assistant")
                .slice(0, -1)
                .map((message, index) => (
                  <div key={index} className="p-2 bg-muted rounded-md text-sm">
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
