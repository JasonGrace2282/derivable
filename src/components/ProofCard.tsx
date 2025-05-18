import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { History, BookOpen, ExternalLink, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ProofCardProps = {
  id: string;
  title: string;
  author: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  timeEstimate: string;
  category?: string;
  proofYear?: number;
  sourceText?: string;
  sourceUrl?: string;
  className?: string;
};

export function ProofCard({
  id,
  title,
  author,
  description,
  difficulty,
  timeEstimate,
  category,
  proofYear,
  sourceText,
  sourceUrl,
  className,
}: ProofCardProps) {
  const { toast } = useToast();
  const link = `/proofs/${id}`;

  const difficultyColor = {
    easy: "bg-green-500/20 text-green-500",
    medium: "bg-yellow-500/20 text-yellow-500",
    hard: "bg-red-500/20 text-red-500",
  };

  const truncate = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const shareProof = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = `${window.location.origin}${link}`;
    
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out this math proof: ${title}`,
        url: shareUrl,
      }).catch(() => {
        copyToClipboard(shareUrl);
      });
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Link copied!",
        description: "Share link copied to clipboard",
      });
    });
  };

  return (
    <Card className={cn("math-card hover:shadow-lg transition-all duration-300", className)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl group">
            {title}
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full h-6 w-6 opacity-0 group-hover:opacity-100 ml-1 -mt-1"
              onClick={shareProof}
            >
              <Share2 className="h-3 w-3" />
            </Button>
          </CardTitle>
          <span
            className={cn(
              "text-xs px-2 py-1 rounded-full",
              difficultyColor[difficulty]
            )}
          >
            {difficulty}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">By {author}</div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground">{truncate(description, 120)}</p>
        
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>Est. time: {timeEstimate}</span>
          
          {proofYear && (
            <span className="flex items-center">
              <History className="h-3 w-3 mr-1" />
              {proofYear < 0 ? `${Math.abs(proofYear)} BCE` : proofYear}
            </span>
          )}
          
          {category && (
            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">
              {category}
            </span>
          )}
        </div>
        
        {(sourceText || sourceUrl) && (
          <div className="mt-3 text-xs">
            <div className="flex items-center text-primary">
              <BookOpen className="h-3 w-3 mr-1" />
              {sourceText ? "Historical sources available" : ""}
              {sourceUrl && (
                <ExternalLink className="h-3 w-3 ml-1" />
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full btn-round bg-primary hover:bg-primary/90">
          <Link to={link} className="flex items-center justify-center">
            Start Derive
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
