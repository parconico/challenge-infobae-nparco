import { Card } from "@/components/ui/card";
import { useAppStore, useResearchState, useUiActions } from "@/lib/store";
import { BarChart3, MoveDown, MoveUp } from "lucide-react";
import { Button } from "../ui/button";

export default function ResultStats() {
  const { results, worthExpandingResults, notWorthExpandingResults } =
    useResearchState();
  const { setOrderByRelevance } = useUiActions();
  const orderByRelevance = useAppStore((state) => state.orderByRelevance);

  const handleToggleSort = () => {
    setOrderByRelevance(!orderByRelevance);
  };
  return (
    <>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Resumen de resultados</span>
          </div>
          <div className="flex items-center">
            {orderByRelevance ? <MoveUp /> : <MoveDown />}
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleSort}
              className="text-xs cursor-pointer"
            >
              {orderByRelevance ? "Mayor relevancia" : "Menor relevancia"}
            </Button>
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
    </>
  );
}
