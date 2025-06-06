import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTitleGeneration } from "@/hooks/useTitleGeneration";

export default function TitleTab() {
  const { titleCount, setTitleCount } = useTitleGeneration();
  return (
    <div className="flex-1">
      <Label htmlFor="titleCount" className="mb-2">
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
  );
}
