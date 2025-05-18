
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ExternalLink } from "lucide-react";
import { MathDisplay } from "@/components/MathDisplay";
import type { Proof } from "@/types/database";

interface ProofStatementProps {
  proof: Proof;
}

export const ProofStatement = ({ proof }: ProofStatementProps) => {
  return (
    <Card className="math-card bg-secondary/60">
      <CardHeader>
        <CardTitle>Problem Statement</CardTitle>
      </CardHeader>
      <CardContent>
        <MathDisplay math={proof.description} block={true} />
      </CardContent>
      
      {proof.source_url || proof.source_text ? (
        <CardFooter className="flex flex-col items-start">
          <div className="w-full">
            <h4 className="text-sm font-medium flex items-center mb-2">
              <BookOpen className="h-4 w-4 mr-2" />
              Historical Sources
            </h4>
            
            <div className="text-sm text-muted-foreground">
              {proof.source_text && (
                <p className="mb-2">{proof.source_text}</p>
              )}
              {proof.source_url && (
                <a 
                  href={proof.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Original Source
                </a>
              )}
            </div>
          </div>
        </CardFooter>
      ) : null}
    </Card>
  );
};
