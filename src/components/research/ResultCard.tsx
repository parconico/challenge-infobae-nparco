"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useExpandedResults } from "@/hooks/useExpandedResults";
import type { ResearchResult } from "@/lib/types";
import { cleanSnippet } from "@/lib/utils";
import { ExternalLink, Info, Star } from "lucide-react";

interface ResultCardProps {
  result: ResearchResult;
  onSelect: (result: ResearchResult) => void;
  variant: "expandable" | "not-expandable";
}

export function ResultCard({ result, onSelect, variant }: ResultCardProps) {
  const { expandedResults, toggleExpand } = useExpandedResults();

  const borderColor =
    variant === "expandable" ? "border-l-green-500" : "border-l-red-500";
  const opacity = variant === "expandable" ? "" : "opacity-75";

  return (
    <Card className={`border-l-4 ${borderColor} ${opacity}`}>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span className="text-lg">{result.title}</span>
          <div className="flex flex-col gap-2 items-end">
            <Badge variant="outline" className="ml-2">
              {result.source}
            </Badge>
            <Badge variant="outline" className="ml-2">
              <Star className="h-4 w-4 mr-1" /> {result.score.toFixed(2)}
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-500 hover:underline"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            {result.url}
          </a>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className={expandedResults[result.id] ? "" : "line-clamp-1"}>
          {cleanSnippet(result.snippet)}
        </p>
        {result.snippet.length > 200 && (
          <Button
            variant="link"
            onClick={() => toggleExpand(result.id)}
            className="p-0 h-auto mt-2"
          >
            {expandedResults[result.id] ? "Ver menos" : "Ver más"}
          </Button>
        )}

        {result.reason && (
          <div className="mt-3 flex items-center text-sm text-muted-foreground">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center cursor-help">
                    <Info className="h-4 w-4 mr-1" />
                    <span>
                      Razón para{" "}
                      {variant === "expandable" ? "expandir" : "no expandir"}
                    </span>
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

      {variant === "expandable" && (
        <CardFooter>
          <Button
            onClick={() => onSelect(result)}
            className="w-full cursor-pointer"
          >
            Generar artículo
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
