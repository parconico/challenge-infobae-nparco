"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useArticleState } from "@/lib/store";
import { Edit, FileText, Type } from "lucide-react";
import { useState } from "react";
import ArticleGenerationTab from "./article/ArticleGenerationTab";
import { ArticleReinterpretationTab } from "./article/ArticleReinterpretationTab";
import TitleGeneration from "./article/TitleGeneration";

export default function ArticleGenerator() {
  const article = useArticleState();

  const [activeArticleTab, setActiveArticleTab] = useState("generate");

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
              <ArticleGenerationTab />
            </TabsContent>

            <TabsContent value="reinterpret" className="space-y-4 py-4">
              <ArticleReinterpretationTab />
            </TabsContent>

            <TabsContent value="titles" className="space-y-4 py-4">
              <TitleGeneration />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
