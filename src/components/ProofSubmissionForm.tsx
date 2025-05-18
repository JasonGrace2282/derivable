
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { MathEditor } from "@/components/MathEditor";
import { useToast } from "@/hooks/use-toast";
import type { Proof } from "@/types/database";

interface ProofSubmissionFormProps {
  proof: Proof;
  onSubmit: (content: string) => void;
  onGetHint: () => Promise<string>;
  hintsUsed: number;
  maxHints?: number;
  isLoading: boolean;
}

export const ProofSubmissionForm = ({
  proof,
  onSubmit,
  onGetHint,
  hintsUsed,
  maxHints = 5,
  isLoading
}: ProofSubmissionFormProps) => {
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const { toast } = useToast();
  
  const handleSubmit = (content: string) => {
    if (!username) {
      toast({
        title: "Username required",
        description: "Please enter your name before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem("username", username);
    onSubmit(content);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label htmlFor="username" className="text-sm font-medium">Your Name:</label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
          className="max-w-xs bg-secondary/50 border-secondary"
        />
      </div>
      
      <MathEditor
        initialPrompt={proof.description}
        onSubmit={handleSubmit}
        onGetHint={onGetHint}
        hintsUsed={hintsUsed}
        maxHints={maxHints}
        isLoading={isLoading}
      />
    </div>
  );
};
