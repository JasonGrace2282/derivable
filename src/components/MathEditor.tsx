import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { MathDisplay } from "./MathDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CircleEqual,
  ArrowRight,
  PartyPopper,
  Lightbulb,
  Sigma,
  Pi,
  SquareDot,
  Infinity,
  AlignJustify,
  Loader,
  Info  
} from "lucide-react";
import { Stopwatch } from "./Stopwatch";
import { useToast } from "@/hooks/use-toast";
import { HintDisplay } from "./HintDisplay";

type MathEditorProps = {
  initialPrompt: string;
  onSubmit: (solution: string) => void;
  onGetHint?: () => Promise<string>;
  hintsUsed?: number;
  maxHints?: number;
  isLoading?: boolean;
};

const commonSymbols = [
  { label: "α", value: "\\alpha" },
  { label: "β", value: "\\beta" },
  { label: "γ", value: "\\gamma" },
  { label: "Σ", value: "\\sum_{i=0}^{n}" },
  { label: "∫", value: "\\int_{a}^{b}" },
  { label: "∞", value: "\\infty" },
  { label: "→", value: "\\rightarrow" },
  { label: "⟹", value: "\\Rightarrow" },
  { label: "√", value: "\\sqrt{x}" },
  { label: "π", value: "\\pi" },
  { label: "θ", value: "\\theta" },
  { label: "∈", value: "\\in" },
];

const structures = [
  { label: "Fraction", value: "\\frac{a}{b}" },
  { label: "Square root", value: "\\sqrt{x}" },
  { label: "Subscript", value: "x_{i}" },
  { label: "Superscript", value: "x^{n}" },
  { label: "Matrix 2x2", value: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}" },
  { label: "Set", value: "\\{x | x \\in \\mathbb{R}\\}" },
];

export function MathEditor({ 
  initialPrompt, 
  onSubmit, 
  onGetHint, 
  hintsUsed = 0, 
  maxHints = 5,
  isLoading = false
}: MathEditorProps) {
  const [solution, setSolution] = useState("");
  const [preview, setPreview] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    setIsRunning(true);
    return () => setIsRunning(false);
  }, []);

  const handleSubmit = () => {
    setIsRunning(false);
    onSubmit(solution);
  };

  const insertSymbol = (symbol: string) => {
    setSolution(prev => prev + symbol);
  };

  const handleGetHint = async () => {
    if (!onGetHint) return;
    
    if (hintsUsed >= maxHints) {
      toast({
        title: "Maximum hints reached",
        description: `You've used all ${maxHints} available hints.`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      setHintLoading(true);
      const hintText = await onGetHint();
      setHint(hintText);
    } catch (error) {
      console.error("Error getting hint:", error);
      toast({
        title: "Error getting hint",
        description: "Could not retrieve hint. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setHintLoading(false);
    }
  };

  return (
    <Card className="math-card">
      <div className="mb-4 p-4 bg-secondary rounded-xl">
        <h3 className="font-medium mb-2 flex justify-between">
          <span>Problem Statement:</span>
          <Stopwatch isRunning={isRunning} className="text-muted-foreground" />
        </h3>
        <div className="text-sm text-muted-foreground">
          <MathDisplay math={initialPrompt} block={true} />
        </div>
      </div>
      
      {hint && <HintDisplay hint={hint} hintsUsed={hintsUsed} maxHints={maxHints} />}
      
      <div className="mb-4">
        <Tabs defaultValue="edit">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Your Solution:</h3>
            <TabsList>
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="edit" className="space-y-4">
            <Textarea
              placeholder="Type your mathematical proof here using LaTeX notation..."
              className="min-h-[200px] bg-secondary/50 border-secondary font-mono"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Sigma className="h-4 w-4 mr-1" />
                  Common Symbols
                </h4>
                <div className="flex flex-wrap gap-1">
                  {commonSymbols.map((symbol) => (
                    <Button
                      key={symbol.value}
                      variant="outline"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => insertSymbol(symbol.value)}
                    >
                      <MathDisplay math={symbol.value} />
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <SquareDot className="h-4 w-4 mr-1" />
                  Structures
                </h4>
                <div className="flex flex-wrap gap-1">
                  {structures.map((structure) => (
                    <Button
                      key={structure.value}
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={() => insertSymbol(structure.value)}
                    >
                      {structure.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            <div className="min-h-[200px] p-4 bg-secondary/30 rounded-md">
              {solution ? (
                <MathDisplay math={solution} block={true} />
              ) : (
                <p className="text-muted-foreground">
                  Your LaTeX preview will appear here.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="flex justify-end space-x-2">
        {onGetHint && (
          <Button 
            variant="outline" 
            className="btn-round"
            onClick={handleGetHint}
            disabled={hintLoading || hintsUsed >= maxHints}
          >
            {hintLoading ? (
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
        )}
        <Button 
          className="btn-round" 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <PartyPopper className="h-4 w-4 mr-2" />
              Submit Solution
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
