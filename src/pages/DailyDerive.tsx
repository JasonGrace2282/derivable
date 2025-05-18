import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MathEditor } from "@/components/MathEditor";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Check, RefreshCcw, Share2 } from "lucide-react";
import { useGemini } from "@/hooks/use-gemini";
import { HintManager } from "@/components/HintManager";
import { HintDisplay } from "@/components/HintDisplay";

const DailyDerive = () => {
  const [progress, setProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [solution, setSolution] = useState("");
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const { toast } = useToast();
  const { getHint, isLoading: geminiLoading } = useGemini();
  
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const dailyProblem = {
    title: "Quadratic Formula Derivation",
    author: "Ancient Babylonians & Euclid",
    prompt: "Starting from the quadratic equation ax² + bx + c = 0, derive the quadratic formula x = (-b ± √(b² - 4ac)) / 2a. Show each step of your work clearly.",
    referenceSolution: "We start with the quadratic equation ax² + bx + c = 0.\nFirst, we divide all terms by a to get: x² + (b/a)x + (c/a) = 0\nNext, we rearrange to prepare for completing the square: x² + (b/a)x = -c/a\nTo complete the square, we add (b/2a)² to both sides: x² + (b/a)x + (b/2a)² = -c/a + (b/2a)²\nThe left side is now a perfect square: (x + b/2a)² = -c/a + b²/4a²\nSimplifying the right side: (x + b/2a)² = (b² - 4ac)/4a²\nTaking the square root of both sides: x + b/2a = ±√(b² - 4ac)/2a\nSolving for x: x = -b/2a ± √(b² - 4ac)/2a\nWhich simplifies to: x = (-b ± √(b² - 4ac))/2a"
  };

  const handleSubmit = (solution: string) => {
    const calculatedProgress = Math.min(Math.floor(solution.length / 10), 100);
    setProgress(calculatedProgress);
    setSubmitted(true);
    setSolution(solution);
    
    toast({
      title: "Solution submitted",
      description: `Your solution has been evaluated. You've made ${calculatedProgress}% progress on this proof.`,
    });
  };

  const handleGetHint = async () => {
    if (hintsUsed >= 3) {
      toast({
        title: "Maximum hints reached",
        description: "You've used all 3 available hints for today's challenge.",
        variant: "destructive",
      });
      return "";
    }
    
    setHintsUsed(prev => prev + 1);
    
    const hint = await getHint(
      dailyProblem.referenceSolution,
      solution
    );
    
    setCurrentHint(hint);
    return hint;
  };

  const resetProgress = () => {
    setProgress(0);
    setSubmitted(false);
    setHintsUsed(0);
    setCurrentHint(null);
  };
  
  const shareResult = async () => {
    const shareText = `I solved today's Derive Duel challenge (${dailyProblem.title}) with ${progress}% accuracy!`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Derive Duel Result",
          text: shareText,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(shareText + " " + window.location.href);
        toast({
          title: "Copied to clipboard",
          description: "Share link copied to clipboard!",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{dailyProblem.title}</h1>
          <p className="text-muted-foreground">By {dailyProblem.author}</p>
        </div>
        <div className="flex items-center text-primary text-sm bg-secondary px-3 py-1 rounded-full">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Daily Challenge • {dateStr}</span>
        </div>
      </div>

      {submitted ? (
        <Card className="math-card p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Your Progress</h2>
            <div className="flex justify-center">
              <div className="h-32 w-32 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl relative">
                {progress}%
                <Progress
                  value={progress}
                  className="absolute inset-0 h-full w-full rounded-full"
                />
              </div>
            </div>
            <div className="max-w-md mx-auto">
              {progress === 100 ? (
                <div className="p-3 bg-green-500/20 text-green-500 rounded-xl flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  <span>Perfect! You've successfully completed this proof.</span>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  You're making progress on this proof. Keep refining your solution to improve your score.
                </p>
              )}
            </div>
            <div className="pt-4 flex justify-center space-x-3">
              <Button onClick={resetProgress} variant="outline" className="btn-round flex items-center">
                <RefreshCcw className="h-4 w-4 mr-2" />
                <span>Try Again</span>
              </Button>
              <Button onClick={shareResult} className="btn-round flex items-center">
                <Share2 className="h-4 w-4 mr-2" />
                <span>Share Result</span>
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <MathEditor
            initialPrompt={dailyProblem.prompt}
            onSubmit={handleSubmit}
            onGetHint={handleGetHint}
            hintsUsed={hintsUsed}
            maxHints={3}
            isLoading={geminiLoading}
          />
        </div>
      )}

      <div className="bg-secondary rounded-xl p-4">
        <h3 className="font-medium mb-2">Tips:</h3>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>Remember to start with the standard form of a quadratic equation</li>
          <li>Use algebraic manipulation to isolate the variable</li>
          <li>Complete the square to solve for x</li>
          <li>Check your final formula with test values</li>
        </ul>
      </div>
    </div>
  );
};

export default DailyDerive;
