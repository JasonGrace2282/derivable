import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MathEditor } from "@/components/MathEditor";
import { MathDisplay } from "@/components/MathDisplay";
import { DuelShareCode } from "@/components/DuelShareCode";
import { Stopwatch } from "@/components/Stopwatch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader, ArrowLeft, Trophy, Users, Clock, Sword } from "lucide-react";
import { evaluateProof } from "@/lib/proof-evaluator";
import type { Duel, Proof } from "@/types/database";

const DuelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [submitted, setSubmitted] = useState(false);
  const [solution, setSolution] = useState("");
  const [timerRunning, setTimerRunning] = useState(false);
  
  useEffect(() => {
    setTimerRunning(true);
    return () => setTimerRunning(false);
  }, []);
  
  // Fetch the duel details
  const { data: duel, isLoading: isLoadingDuel } = useQuery({
    queryKey: ["duel", id],
    queryFn: async () => {
      if (!id) throw new Error("No duel ID provided");
      
      const { data, error } = await supabase
        .from("duels")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw new Error(error.message);
      return data as Duel;
    },
    refetchInterval: 5000
  });
  
  const { data: proof, isLoading: isLoadingProof } = useQuery({
    queryKey: ["proof", duel?.proof_id],
    queryFn: async () => {
      if (!duel?.proof_id) throw new Error("No proof ID available");
      
      const { data, error } = await supabase
        .from("proofs")
        .select("*")
        .eq("id", duel.proof_id)
        .single();
      
      if (error) throw new Error(error.message);
      return data as Proof;
    },
    enabled: Boolean(duel?.proof_id)
  });
  
  useEffect(() => {
    if (duel && username) {
      const userAlreadySubmitted = 
        (username === duel.creator_name && duel.creator_progress !== null && duel.creator_progress >= 0) ||
        (username === duel.opponent_name && duel.opponent_progress !== null && duel.opponent_progress >= 0);
      setSubmitted(userAlreadySubmitted);
    }
  }, [duel, username]);
  
  const submitMutation = useMutation({
    mutationFn: async ({ content, duelId, userName }: { content: string; duelId: string; userName: string }) => {
      if (!proof) throw new Error("Proof not found");
      
      const progress = await evaluateProof(content, proof.content);
      const isCreator = duel?.creator_name === userName;
      
      const { data: submission, error: submissionError } = await supabase
        .from("submissions")
        .insert([
          {
            user_name: userName,
            proof_id: proof.id,
            duel_id: duelId,
            content: content,
            progress: progress
          }
        ])
        .select();
        
      if (submissionError) throw new Error(submissionError.message);
      
      const updateData: Record<string, string | number | null> = isCreator 
        ? { creator_progress: progress } 
        : { opponent_progress: progress };
        
      if (duel?.status === "active") {
        if (isCreator) {
          if (duel.opponent_progress !== null && duel.opponent_progress >= 0) {
            if (progress > duel.opponent_progress) {
              updateData.winner = userName;
              updateData.status = "completed";
              updateData.completed_at = new Date().toISOString();
            } else if (progress < duel.opponent_progress) {
              updateData.winner = duel.opponent_name;
              updateData.status = "completed";
              updateData.completed_at = new Date().toISOString();
            } else {
              updateData.winner = "Tie";
              updateData.status = "completed";
              updateData.completed_at = new Date().toISOString();
            }
          }
        } else {
          if (duel.creator_progress !== null && duel.creator_progress >= 0) {
            if (progress > duel.creator_progress) {
              updateData.winner = userName;
              updateData.status = "completed";
              updateData.completed_at = new Date().toISOString();
            } else if (progress < duel.creator_progress) {
              updateData.winner = duel.creator_name;
              updateData.status = "completed";
              updateData.completed_at = new Date().toISOString();
            } 
            
            else {
              updateData.winner = "Tie";
              updateData.status = "completed";
              updateData.completed_at = new Date().toISOString();
            }
          }
        }
      }
      
      const { data: updatedDuel, error: updateError } = await supabase
        .from("duels")
        .update(updateData)
        .eq("id", duelId)
        .select();
        
      if (updateError) throw new Error(updateError.message);
      
      return { 
        submission: submission[0], 
        duel: updatedDuel[0] as Duel,
        progress
      };
    },
    onSuccess: (data) => {
      toast({
        title: "Solution submitted!",
        description: `You've completed approximately ${data.progress}% of the proof.`,
      });
      setSubmitted(true);
      
      queryClient.invalidateQueries({ queryKey: ["duel", id] });
      
      if (data.duel.status === "completed") {
        const isWinner = data.duel.winner === username;
        const isTie = data.duel.winner === "Tie";
        
        toast({
          title: isTie ? "It's a tie!" : isWinner ? "You won!" : "You lost!",
          description: isTie 
            ? "Both of you did equally well!" 
            : isWinner 
              ? "Congratulations! You completed the challenge best." 
              : "Your opponent did better this time.",
          variant: isWinner ? "default" : isTie ? "default" : "destructive",
        });
      }
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
    setTimerRunning(false);


    if (!id || !duel) return;
    
    const isParticipant = 
      username === duel.creator_name || 
      username === duel.opponent_name;
      
    if (!isParticipant) {
      toast({
        title: "Not a participant",
        description: "You are not a participant in this duel.",
        variant: "destructive",
      });
      return;
    }
    
    if (duel.status !== "active") {
      toast({
        title: "Duel not active",
        description: duel.status === "waiting" 
          ? "Waiting for opponent to join." 
          : "This duel has already been completed.",
        variant: "destructive",
      });
      return;
    }
    
    setSolution(content);
    submitMutation.mutate({
      content,
      duelId: id,
      userName: username
    });
  };
  
  const formatDuration = (start?: string | null, end?: string | null) => {
    if (!start || !end) return "N/A";
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };
  
  const isParticipant = duel && (
    username === duel.creator_name || 
    username === duel.opponent_name
  );
  
  const hasSubmitted = duel && (
    (username === duel.creator_name && duel.creator_progress !== null && duel.creator_progress >= 0) ||
    (username === duel.opponent_name && duel.opponent_progress !== null && duel.opponent_progress >= 0)
  );
  
  const isLoading = isLoadingDuel || isLoadingProof;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!duel || !proof) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Duel not found</h2>
        <Button onClick={() => navigate("/duel")} className="btn-round">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Duels
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/duel")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Duels
          </Button>
          <h1 className="text-3xl font-bold">Math Duel: {proof.title}</h1>
          <p className="text-muted-foreground">By {proof.author}</p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
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
          <Stopwatch isRunning={timerRunning} className="text-muted-foreground" />
        </div>
      </div>
      
      {/* Sharing QR Code for Duel */}
      {duel.status === "waiting" && (
        <DuelShareCode code={duel.code} duelId={id || ""} />
      )}
      
      {/* Duel Status Card */}
      <Card className="math-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sword className="mr-2 h-5 w-5 text-primary" />
            Duel Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Creator</p>
              <p className="font-medium">{duel.creator_name}</p>
              <div className="bg-primary/10 p-2 rounded flex items-center justify-between">
                <span>Progress</span>
                <span className="font-mono">{duel.creator_progress !== null ? `${duel.creator_progress}%` : "Not submitted"}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Opponent</p>
              <p className="font-medium">{duel.opponent_name || "Waiting for opponent..."}</p>
              <div className="bg-primary/10 p-2 rounded flex items-center justify-between">
                <span>Progress</span>
                <span className="font-mono">{duel.opponent_progress !== null ? `${duel.opponent_progress}%` : "Not submitted"}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Status</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                duel.status === "waiting" 
                  ? "bg-yellow-500/20 text-yellow-500" 
                  : duel.status === "active" 
                    ? "bg-green-500/20 text-green-500" 
                    : "bg-blue-500/20 text-blue-500"
              }`}>
                {duel.status === "waiting" 
                  ? "Waiting for opponent" 
                  : duel.status === "active" 
                    ? "Duel in progress" 
                    : "Duel completed"}
              </span>
            </div>
            
            {duel.started_at && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Started</span>
                </div>
                <span className="text-sm">
                  {new Date(duel.started_at).toLocaleString()}
                </span>
              </div>
            )}
            
            {duel.completed_at && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Duration</span>
                </div>
                <span className="text-sm">
                  {formatDuration(duel.started_at, duel.completed_at)}
                </span>
              </div>
            )}
            
            {duel.status === "completed" && duel.winner && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Trophy className="mr-2 h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">Winner</span>
                </div>
                <span className="text-sm font-medium">
                  {duel.winner === "Tie" ? "Tie" : duel.winner}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Problem Statement */}
      <Card className="math-card bg-secondary/60">
        <CardHeader>
          <CardTitle>Problem Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <MathDisplay math={proof.description} block={true} />
        </CardContent>
      </Card>
      
      {proof.mathematician_proof && (
        <Card className="math-card bg-secondary/20">
          <CardHeader>
            <CardTitle className="text-sm">Original Proof (Historical Reference)</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <MathDisplay math={proof.mathematician_proof} block={true} />
          </CardContent>
        </Card>
      )}
      
      {/* Solution section */}
      {duel.status === "waiting" && !isParticipant && (
        <Card className="math-card p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Duel is waiting for an opponent</h2>
            <p className="text-muted-foreground">
              This duel is waiting for an opponent to join. If you were given this link directly, 
              go back to the Duel page and join with the code: <span className="font-mono font-medium">{duel.code}</span>
            </p>
          </div>
        </Card>
      )}
      
      {duel.status !== "waiting" && !isParticipant && (
        <Card className="math-card p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">You are not a participant</h2>
            <p className="text-muted-foreground">
              You are viewing this duel as a spectator. Only the creator and opponent can submit solutions.
            </p>
          </div>
        </Card>
      )}
      
      {isParticipant && duel.status === "completed" && (
        <Card className="math-card p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Duel Completed</h2>
            {duel.winner === "Tie" ? (
              <div className="bg-primary/20 text-primary p-4 rounded-xl">
                <p className="font-medium">It's a tie!</p>
                <p className="mt-2">Both participants achieved the same progress.</p>
              </div>
            ) : duel.winner === username ? (
              <div className="bg-green-500/20 text-green-500 p-4 rounded-xl">
                <p className="font-medium">You won!</p>
                <p className="mt-2">Congratulations! You completed the challenge best.</p>
              </div>
            ) : (
              <div className="bg-red-500/20 text-red-500 p-4 rounded-xl">
                <p className="font-medium">You lost!</p>
                <p className="mt-2">Your opponent did better this time.</p>
              </div>
            )}
          </div>
        </Card>
      )}
      
      {isParticipant && duel.status === "active" && (
        submitted ? (
          <Card className="math-card p-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Solution Submitted</h2>
              <div className="bg-primary/20 text-primary p-4 rounded-xl">
                {submitMutation.isPending ? (
                  <div className="flex items-center justify-center">
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                    Evaluating your solution...
                  </div>
                ) : (
                  <div>
                    <p className="mb-2 font-medium">Your solution has been evaluated.</p>
                    <p>You've completed approximately {
                      username === duel.creator_name 
                        ? duel.creator_progress 
                        : duel.opponent_progress
                    }% of the proof correctly.</p>
                    <p className="mt-2">Waiting for {
                      username === duel.creator_name 
                        ? duel.opponent_name || "opponent" 
                        : duel.creator_name
                    } to submit their solution...</p>
                  </div>
                )}
              </div>
              <Button 
                onClick={() => setSubmitted(false)} 
                variant="outline"
                className="btn-round"
              >
                Edit Solution
              </Button>
            </div>
          </Card>
        ) : (
          <MathEditor
            initialPrompt={proof.description}
            onSubmit={handleSubmit}
          />
        )
      )}
    </div>
  );
};

export default DuelDetail;
