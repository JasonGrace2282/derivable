
import { Button } from "@/components/ui/button";
import { ArrowLeft, History, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Stopwatch } from "@/components/Stopwatch";
import type { Proof } from "@/types/database";

interface ProofHeaderProps {
  proof: Proof;
  shareProof: () => void;
  timerRunning: boolean;
}

export const ProofHeader = ({ proof, shareProof, timerRunning }: ProofHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/proofs")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Proofs
        </Button>
        <h1 className="text-3xl font-bold">{proof.title}</h1>
        <p className="text-muted-foreground">By {proof.author}</p>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            proof.difficulty === "easy" 
              ? "bg-green-500/20 text-green-500" 
              : proof.difficulty === "medium" 
                ? "bg-yellow-500/20 text-yellow-500" 
                : "bg-red-500/20 text-red-500"
          }`}>
            {proof.difficulty}
          </span>
          <span className="text-xs text-muted-foreground">Est. time: {proof.time_estimate}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-6 w-6" 
            onClick={shareProof}
          >
            <Share2 className="h-3 w-3" />
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {proof.proof_year && (
            <div className="flex items-center text-xs text-muted-foreground">
              <History className="h-3 w-3 mr-1" />
              Year: {proof.proof_year < 0 ? `${Math.abs(proof.proof_year)} BCE` : proof.proof_year}
            </div>
          )}
          {proof.category && (
            <div className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
              {proof.category}
            </div>
          )}
        </div>
        <Stopwatch isRunning={timerRunning} className="text-muted-foreground" />
      </div>
    </div>
  );
};
