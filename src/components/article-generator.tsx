"use client";

import { useState } from "react";
import { useChat } from "ai/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  generateArticleFromUrl,
  generateTitlesFromArticle,
} from "@/app/actions/article-actions";
import { useArticleState, useArticleActions } from "@/lib/store";
import { Loader2, FileText, Type, Edit } from "lucide-react";
import Link from "next/link";

export default function ArticleGenerator() {
  const article = useArticleState();
  const {
    setInitialArticle,
    setReinterpretedArticle,
    setGeneratedTitles,
    setSelectedTitle,
  } = useArticleActions();
  const [isGenerating, setIsGenerating] = useState(false);
  const [titleCount, setTitleCount] = useState("3");
  const [isTitleGenerating, setIsTitleGenerating] = useState(false);
  const [activeArticleTab, setActiveArticleTab] = useState("generate");

  // Chat hook for reinterpreting the text
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isChatLoading,
  } = useChat({
    api: "/api/chat",
    onFinish: (message) => {
      setReinterpretedArticle(message.content);
    },
  });

  const handleGenerateArticle = async () => {
    if (!article.selectedResult) return;

    setIsGenerating(true);
    try {
      const generatedArticle = await generateArticleFromUrl(
        article.selectedResult.url
      );
      setInitialArticle(generatedArticle);
      setActiveArticleTab("reinterpret");
    } catch (error) {
      console.error("Error al generar el articulo:", error);
    } finally {
      setIsGenerating(false);
    }
  };

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

  const handleSelectTitle = (title: string) => {
    setSelectedTitle(title);
  };

  if (!article.selectedResult) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Generación de artículo: {article.selectedResult.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeArticleTab} onValueChange={setActiveArticleTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generate" className="flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                Generar
              </TabsTrigger>
              <TabsTrigger
                value="reinterpret"
                disabled={!article.initialArticle}
                className="flex items-center"
              >
                <Edit className="w-4 h-4 mr-1" />
                Reinterpretar
              </TabsTrigger>
              <TabsTrigger
                value="titles"
                disabled={!article.initialArticle}
                className="flex items-center"
              >
                <Type className="w-4 h-4 mr-1" />
                Titulos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-md">
                  <h3 className="font-medium mb-2">Fuente seleccionada:</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {article.selectedResult.title}
                  </p>
                  <Link
                    href={article.selectedResult.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {article.selectedResult.url}
                  </Link>
                </div>

                <Button
                  onClick={handleGenerateArticle}
                  disabled={isGenerating}
                  className="w-full"
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
                      <p className="whitespace-pre-wrap">
                        {article.initialArticle}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reinterpret" className="space-y-4 py-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">
                    Instrucciones para reinterpretar el articulo:
                  </Label>
                  <Textarea
                    id="prompt"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ej: Hazlo más formal, añade ejemplos prácticos, simplifica el lenguaje técnico..."
                    className="min-h-[120px]"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isChatLoading || !input}
                  className="w-full"
                >
                  {isChatLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Reinterpretando...
                    </>
                  ) : (
                    "Reinterpretar articulo"
                  )}
                </Button>
              </form>

              {messages.length > 0 &&
                messages[messages.length - 1].role === "assistant" && (
                  <div className="mt-6 p-4 border rounded-md bg-background">
                    <h3 className="font-medium mb-2">
                      Articulo reinterpretado:
                    </h3>
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap">
                        {messages[messages.length - 1].content}
                      </div>
                    </div>
                  </div>
                )}
            </TabsContent>

            <TabsContent value="titles" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <Label htmlFor="titleCount">
                      Número de títulos a generar:
                    </Label>
                    <Select value={titleCount} onValueChange={setTitleCount}>
                      <SelectTrigger id="titleCount">
                        <SelectValue placeholder="Selecciona cantidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 títulos</SelectItem>
                        <SelectItem value="5">5 títulos</SelectItem>
                        <SelectItem value="8">8 títulos</SelectItem>
                        <SelectItem value="10">10 títulos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleGenerateTitles}
                    disabled={isTitleGenerating}
                  >
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
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                        <h4 className="font-medium text-green-800 mb-2">
                          Titulo seleccionado:
                        </h4>
                        <p className="text-green-700 font-medium">
                          {article.selectedTitle}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline">
                            Copiar titulo
                          </Button>
                          <Button size="sm">Usar en editor</Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
