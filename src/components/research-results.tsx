/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useResearchState, useArticleActions, useUiActions } from "@/lib/store";
import {
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  Info,
  ExternalLink,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export default function ResearchResults() {
  const { results, worthExpandingResults, notWorthExpandingResults } =
    useResearchState();
  const { setSelectedResult } = useArticleActions();
  const { setActiveTab } = useUiActions();
  const [expandedResults, setExpandedResults] = useState<
    Record<string, boolean>
  >({});

  const toggleExpand = (id: string) => {
    setExpandedResults((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectResult = (result: any) => {
    setSelectedResult(result);
    setActiveTab("article");
  };

  return (
    <div className="space-y-8">
      {/*Statistics Results*/}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Resumen de resultados</span>
          </div>
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <span>Total: {results.length}</span>
            <span className="text-green-600">
              Expandir: {worthExpandingResults.length}
            </span>
            <span className="text-red-600">
              No expandir: {notWorthExpandingResults.length}
            </span>
          </div>
        </div>
      </Card>

      {/*Worth Expanding Results*/}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <ThumbsUp className="w-5 h-5 mr-2 text-green-500" />
          Valen la pena expandir ({worthExpandingResults.length})
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {worthExpandingResults.map((result) => (
            <Card key={result.id} className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span className="text-lg">{result.title}</span>
                  <Badge variant="outline" className="ml-2">
                    {result.source}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  <Link
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-500 hover:underline"
                  >
                    {result.url}
                  </Link>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className={expandedResults[result.id] ? "" : "line-clamp-3"}>
                  {result.snippet}
                </p>
                {result.snippet.length > 200 && (
                  <Button variant="link" className="">
                    {expandedResults[result.id] ? "Ver menos" : "Ver mas"}
                  </Button>
                )}

                {result.reason && (
                  <div className="mt-3 flex items-center text-sm text-muted-foreground">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center cursor-help">
                            <Info className="h-4 w-4 mr-1" />
                            <span>Razon para expandir</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{result.reason}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleSelectResult(result)}
                  className="w-full"
                >
                  Generar articulo
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/*Not Worth Expanding Results*/}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <ThumbsDown className="w-5 h-5 mr-2 text-red-500" />
          No valen la pena expandir ({notWorthExpandingResults.length})
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {notWorthExpandingResults.map((result) => (
            <Card
              key={result.id}
              className="border-l-4 border-l-red-500 opacity-75"
            >
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span className="text-lg">{result.title}</span>
                  <Badge variant="outline" className="ml-2">
                    {result.source}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  <Link
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-500 hover:underline"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    {result.url}
                  </Link>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className={expandedResults[result.id] ? "" : "line-clamp-3"}>
                  {result.snippet}
                </p>
                {result.snippet.length > 200 && (
                  <Button
                    variant="link"
                    onClick={() => toggleExpand(result.id)}
                    className="p-0 h-auto mt-2"
                  >
                    {expandedResults[result.id] ? "Ver menos" : "Ver mas"}
                  </Button>
                )}
                {result.reason && (
                  <div className="mt-3 flex items-center text-sm text-muted-foreground">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center cursor-help">
                            <Info className="h-4 w-4 mr-1" />
                            <span>Razon para no expandir</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{result.reason}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
