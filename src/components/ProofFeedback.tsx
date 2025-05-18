
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, X, Share2, BookOpen, Edit } from "lucide-react";
import { MathDisplay } from "./MathDisplay";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ProofFeedbackProps = {
  feedback: string;
  progress: number;
  isCorrect?: boolean;
  onRightTrack?: boolean;
  mathematicianProof?: string;
  onEdit: () => void;
  onShare: () => void;
};

export function ProofFeedback({
  feedback,
  progress,
  isCorrect = false,
  onRightTrack = true,
  mathematicianProof,
  onEdit,
  onShare,
}: ProofFeedbackProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  const getProgressColor = () => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="math-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Evaluation Results</span>
          <Button variant="outline" size="icon" className="rounded-full" onClick={onShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-1/2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">Score:</span>
              <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getProgressColor()}`} 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-bold">{progress}%</span>
            </div>

            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Correct:</span>
                {isCorrect ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">On Right Track:</span>
                {onRightTrack ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <Alert variant={isCorrect ? "default" : "destructive"} className="bg-secondary/50">
              <AlertTitle>
                {isCorrect ? "Congratulations!" : "Almost there!"}
              </AlertTitle>
              <AlertDescription className="text-sm mt-2">
                {feedback}
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {mathematicianProof && (
          <div className="mt-6">
            <Button
              variant="outline"
              className="flex items-center gap-2 mb-2"
              onClick={() => setShowOriginal(!showOriginal)}
            >
              <BookOpen className="h-4 w-4" />
              {showOriginal ? "Hide Original Proof" : "Show Original Proof"}
            </Button>
            
            {showOriginal && (
              <div className="p-4 bg-primary/10 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Mathematician's Original Approach:</h4>
                <MathDisplay math={mathematicianProof} block={true} />
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" className="btn-round" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Solution
        </Button>
      </CardFooter>
    </Card>
  );
}
