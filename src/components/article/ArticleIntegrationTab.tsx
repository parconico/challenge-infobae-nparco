"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useArticleState } from "@/lib/store";
import { Newspaper } from "lucide-react";

export default function ArticleIntegrationTab() {
  const { reinterpretedArticle } = useArticleState();
  return (
    <div>
      <Card>
        <CardContent>
          <h1 className="font-semibold flex items-center mb-2">
            <Newspaper className="w-4 h-4 mr-2" />
            Articulo reinterpretado + Titulo generado
          </h1>
          <div className="prose prose-sm max-w-none p-3 rounded-md border bg-muted">
            <div className="whitespace-pre-wrap text-sm">
              {reinterpretedArticle[reinterpretedArticle.length - 1]}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
