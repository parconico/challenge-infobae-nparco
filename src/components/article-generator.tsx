"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useArticleGenerationTab,
  useArticleState,
  useUiActions,
} from "@/lib/store";
import { Blocks, Edit, FileText, Type } from "lucide-react";
import ArticleGenerationTab from "@/components/article/ArticleGenerationTab";
import { ArticleReinterpretationTab } from "@/components/article/ArticleReinterpretationTab";
import TitleGeneration from "@/components/article/TitleGeneration";
import ArticleIntegrationTab from "@/components/article/ArticleIntegrationTab";

export default function ArticleGenerator() {
  const article = useArticleState();
  const { setArticleGenerationTab } = useUiActions();
  const articleGenerationTab = useArticleGenerationTab();

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
          <Tabs
            value={articleGenerationTab}
            onValueChange={setArticleGenerationTab}
          >
            <TabsList className="grid w-full grid-cols-4">
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
              <TabsTrigger
                value="integration"
                disabled={!article.selectedTitle}
                className="flex items-center"
              >
                <Blocks className="w-4 h-4 mr-1" />
                Integración
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

            <TabsContent value="integration" className="space-y-4 py-4">
              <ArticleIntegrationTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
