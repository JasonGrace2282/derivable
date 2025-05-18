import { Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface HintDisplayProps {
  hint: string;
  hintsUsed: number;
  maxHints: number;
}

export function HintDisplay({ hint, hintsUsed, maxHints }: HintDisplayProps) {
  if (!hint) return null;
  
  return (
    <Alert className="mb-4 bg-yellow-500/10 border border-yellow-500/30">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-yellow-500" />
        <AlertTitle className="text-yellow-500">
          Hint {hintsUsed}/{maxHints}
        </AlertTitle>
      </div>
      <AlertDescription className="mt-2 text-sm">
        {hint}
      </AlertDescription>
    </Alert>
  );
}