"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useResearchState } from "@/lib/store";

interface TopicSelectorProps {
  topics: string[];
  onTopicSelect: (topic: string) => void;
  isLoading?: boolean;
}

export function TopicSelector({
  topics,
  onTopicSelect,
  isLoading = false,
}: TopicSelectorProps) {
  const { currentTopic } = useResearchState();

  return (
    <Card className="p-6">
      <h2>Selecciona un tema para investigar</h2>
      {currentTopic && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-800">
            <strong>Tema actual:</strong> {currentTopic}
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => (
          <Button
            key={topic}
            variant={currentTopic === topic ? "default" : "outline"}
            onClick={() => onTopicSelect(topic)}
            className="h-auto py-3 justify-start text-left cursor-pointer"
            disabled={isLoading}
          >
            {topic}
          </Button>
        ))}
      </div>
    </Card>
  );
}
