import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb, Loader } from "lucide-react";
import { HintDisplay } from "./HintDisplay";

interface HintManagerProps {
  onGetHint: () => Promise<string>;
  hintsUsed: number;
  maxHints: number;
}

export function HintManager({ onGetHint, hintsUsed, maxHints }: HintManagerProps) {
  const [hint, setHint] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGetHint = async () => {
    if (hintsUsed >= maxHints) return;
    
    try {
      setIsLoading(true);
      const hintText = await onGetHint();
      setHint(hintText);
    } catch (error) {
      console.error("Error getting hint:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {hint && <HintDisplay hint={hint} hintsUsed={hintsUsed} maxHints={maxHints} />}
      
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          className="btn-round"
          onClick={handleGetHint}
          disabled={isLoading || hintsUsed >= maxHints}
        >
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Getting Hint...
            </>
          ) : (
            <>
              <Lightbulb className="h-4 w-4 mr-2" />
              Get Hint ({hintsUsed}/{maxHints})
            </>
          )}
        </Button>
      </div>
    </div>
  );
}