
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Proof } from "@/types/database";
import { useGemini } from "@/hooks/use-gemini";
import { ProofHeader } from "@/components/ProofHeader";
import { ProofStatement } from "@/components/ProofStatement";
import { ProofSubmissionForm } from "@/components/ProofSubmissionForm";
import { ProofFeedback } from "@/components/ProofFeedback";
import { ProofLoading } from "@/components/ProofLoading";

const generateShareUrl = (proofId: string) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/proofs/${proofId}`;
};

const ProofDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showHints, setShowHints] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [solution, setSolution] = useState("");
  const [timerRunning, setTimerRunning] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState<{
    is_correct: boolean;
    on_right_track: boolean;
    progress: number;
    feedback: string;
  } | null>(null);

  const { evaluateProof, getHint, isLoading: geminiLoading } = useGemini();

  useEffect(() => {
    setTimerRunning(true);
    return () => setTimerRunning(false);
  }, []);

  const { data: proof, isLoading } = useQuery({
    queryKey: ["proof", id],
    queryFn: async () => {
      if (!id) throw new Error("No proof ID provided");
      
      const { data, error } = await supabase
        .from("proofs")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw new Error(error.message);
      return data as Proof;
    }
  });

  const submitMutation = useMutation({
    mutationFn: async ({ 
      content, 
      proofId, 
      userName 
    }: { 
      content: string; 
      proofId: string; 
      userName: string 
    }) => {
      const evaluationResult = await evaluateProof(
        content, 
        proof?.content || "",
        proof?.mathematician_proof,
        proof?.source_text
      );
      
      const { data: submissionData, error: submissionError } = await supabase
        .from("submissions")
        .insert([
          {
            user_name: userName,
            proof_id: proofId,
            content: content,
            progress: evaluationResult.progress,
            feedback: evaluationResult.feedback
          }
        ])
        .select();
        
      if (submissionError) throw new Error(submissionError.message);

      if (submissionData) {
        const { error: feedbackError } = await supabase
          .from("proof_feedback")
          .insert([
            {
              submission_id: submissionData[0].id,
              is_correct: evaluationResult.is_correct,
              on_right_track: evaluationResult.on_right_track,
              feedback_text: evaluationResult.feedback
            }
          ]);

        if (feedbackError) console.error("Error storing feedback:", feedbackError);
      }
      
      setFeedback(evaluationResult);
      return { submission: submissionData?.[0], evaluation: evaluationResult };
    },
    onSuccess: () => {
      toast({
        title: "Submission successful!",
        description: "Your proof has been evaluated.",
      });
      setSubmitted(true);
    },
    onError: (error) => {
      toast({
        title: "Error submitting solution",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (content: string) => {
    if (!id) return;
    
    setSolution(content);
    
    const username = localStorage.getItem("username") || "";
    
    submitMutation.mutate({
      content,
      proofId: id,
      userName: username
    });
  };

  const handleGetHint = async () => {
    if (!proof || !id) return;
    
    setHintsUsed(prev => prev + 1);
    
    // Use the environment API key for hints
    const hint = await getHint(
      proof.content,
      solution,
      proof.mathematician_proof,
      proof.source_text
    );
    
    // If hint is empty or an error message, provide a generic hint
    if (!hint || hint.includes("please set up the Gemini API")) {
      return "Consider the key properties of this mathematical concept and try breaking down the problem into smaller steps.";
    }
    
    return hint;
  };

  const shareProof = () => {
    if (!id) return;

    const shareUrl = generateShareUrl(id);
    
    if (navigator.share) {
      navigator.share({
        title: proof?.title || "Math Proof Challenge",
        text: `Check out this math proof: ${proof?.title}`,
        url: shareUrl,
      }).catch((err) => {
        console.error("Error sharing:", err);
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
    }).catch(err => {
      console.error("Could not copy text: ", err);
    });
  };

  if (isLoading) {
    return <ProofLoading />;
  }

  if (!proof) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Proof not found</h2>
        <Button onClick={() => navigate("/proofs")} className="btn-round">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Proofs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <ProofHeader 
        proof={proof} 
        shareProof={shareProof}
        timerRunning={timerRunning} 
      />
      
      <ProofStatement proof={proof} />

      {submitted && feedback ? (
        <ProofFeedback
          feedback={feedback.feedback}
          progress={feedback.progress}
          isCorrect={feedback.is_correct}
          onRightTrack={feedback.on_right_track}
          mathematicianProof={proof.mathematician_proof}
          onEdit={() => setSubmitted(false)}
          onShare={shareProof}
        />
      ) : (
        <ProofSubmissionForm
          proof={proof}
          onSubmit={handleSubmit}
          onGetHint={handleGetHint}
          hintsUsed={hintsUsed}
          maxHints={5}
          isLoading={submitMutation.isPending || geminiLoading}
        />
      )}
    </div>
  );
};

export default ProofDetail;
