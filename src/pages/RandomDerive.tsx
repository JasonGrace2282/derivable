import { Button } from "@/components/ui/button";
import { MathEditor } from "@/components/MathEditor";
import { MathDisplay } from "@/components/MathDisplay";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DicesIcon, RefreshCcw, Loader, History, CalendarClock } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { YearRangeSlider } from "@/components/YearRangeSlider";
import { evaluateProof } from "@/lib/proof-evaluator";
import { Stopwatch } from "@/components/Stopwatch";
import type { Proof } from "@/types/database";

const RandomDerive = () => {
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [submitted, setSubmitted] = useState(false);
  const [solution, setSolution] = useState("");
  const [minYear, setMinYear] = useState(-600);
  const [maxYear, setMaxYear] = useState(2023);
  const [timerRunning, setTimerRunning] = useState(false);
  const { toast } = useToast();
  
  const { data: proofs, isLoading: isLoadingProofs } = useQuery({
    queryKey: ["proofs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("proofs")
        .select("*");
      
      if (error) throw new Error(error.message);
      return data as Proof[];
    }
  });

  const getRandomProofId = () => {
    if (!proofs || proofs.length === 0) return null;
    
    // Filter proofs by year range
    const filteredProofs = proofs.filter(proof => {
      const year = proof.proof_year || 0;
      return year >= minYear && year <= maxYear;
    });
    
    if (filteredProofs.length === 0) {
      toast({
        title: "No proofs in selected time period",
        description: "Try adjusting the year range to find proofs",
        variant: "destructive"
      });
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * filteredProofs.length);
    return filteredProofs[randomIndex].id;
  };

  const [currentProofId, setCurrentProofId] = useState<string | null>(null);

  const calculateYearBounds = () => {
    if (!proofs || proofs.length === 0) return { min: -600, max: 2023 };
    
    let min = 2023;
    let max = -600;
    
    proofs.forEach(proof => {
      if (proof.proof_year !== null) {
        min = Math.min(min, proof.proof_year);
        max = Math.max(max, proof.proof_year);
      }
    });
    
    return { min, max };
  };

  useEffect(() => {
    if (proofs && proofs.length > 0) {
      const { min, max } = calculateYearBounds();
      setMinYear(min);
      setMaxYear(max);
    }
  }, [proofs]);

  const { data: currentProof, isLoading: isLoadingCurrentProof, refetch: refetchCurrentProof } = useQuery({
    queryKey: ["proof", currentProofId],
    queryFn: async () => {
      if (!currentProofId) {
        if (proofs && proofs.length > 0) {
          const randomId = getRandomProofId();
          setCurrentProofId(randomId);
          
          if (!randomId) throw new Error("No proofs available");
          
          const { data, error } = await supabase
            .from("proofs")
            .select("*")
            .eq("id", randomId)
            .single();
          
          if (error) throw new Error(error.message);
          return data as Proof;
        }
        throw new Error("No proofs available");
      }
      
      const { data, error } = await supabase
        .from("proofs")
        .select("*")
        .eq("id", currentProofId)
        .single();
      
      if (error) throw new Error(error.message);
      return data as Proof;
    },
    enabled: Boolean(currentProofId) || Boolean(proofs?.length)
  });

  const submitMutation = useMutation({
    mutationFn: async ({ content, proofId, userName }: { content: string; proofId: string; userName: string }) => {
      const progress = await evaluateProof(content, currentProof?.content || "");
      
      const { data, error } = await supabase
        .from("submissions")
        .insert([
          {
            user_name: userName,
            proof_id: proofId,
            content: content,
            progress: progress,
            feedback: `You've completed approximately ${progress}% of the proof correctly.`
          }
        ])
        .select();
        
      if (error) throw new Error(error.message);
      return { submission: data[0], progress };
    },
    onSuccess: (data) => {
      toast({
        title: "Submission successful!",
        description: `You've completed approximately ${data.progress}% of the proof.`,
      });
      setSubmitted(true);
      localStorage.setItem("username", username);
    },
    onError: (error) => {
      toast({
        title: "Error submitting solution",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const getRandomProof = () => {
    setTimerRunning(true);
    
    if (!proofs || proofs.length === 0) {
      toast({
        title: "No proofs available",
        description: "Unable to get a random proof at this time.",
        variant: "destructive"
      });
      return;
    }
    
    const randomId = getRandomProofId();
    if (!randomId) return;
    
    setCurrentProofId(randomId);
    setSubmitted(false);
    setSolution("");
    
    toast({
      title: "New challenge generated",
      description: `Now working on: ${proofs.find(p => p.id === randomId)?.title}`,
    });
    
    refetchCurrentProof();
  };

  const handleSubmit = (solution: string) => {
    setTimerRunning(false);
    if (!username) {
      toast({
        title: "Username required",
        description: "Please enter your name before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    if (!currentProofId) return;
    
    setSolution(solution);
    submitMutation.mutate({
      content: solution,
      proofId: currentProofId,
      userName: username
    });
  };

  const handleYearRangeChange = (min: number, max: number) => {
    setMinYear(min);
    setMaxYear(max);
  };

  const isLoading = isLoadingProofs || isLoadingCurrentProof || !currentProof;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <DicesIcon className="mr-2 h-6 w-6 text-primary" />
            Random Derive
          </h1>
          <p className="text-muted-foreground">
            Test your skills with a randomly selected mathematical proof
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            className="btn-round flex items-center"
            onClick={getRandomProof}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="mr-2 h-4 w-4" />
            )}
            New Random Proof
          </Button>
          <Stopwatch isRunning={timerRunning} className="self-end text-muted-foreground" />
        </div>
      </div>

      <Card className="math-card bg-secondary/30">
        <CardContent className="pt-4">
          <YearRangeSlider 
            minYear={-600} 
            maxYear={2023}
            onYearRangeChange={handleYearRangeChange}
          />
        </CardContent>
      </Card>

      {isLoading ? (
        <Card className="math-card p-6">
          <div className="flex justify-center items-center h-32">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        </Card>
      ) : currentProof ? (
        <>
          <Card className="math-card bg-secondary/60">
            <CardHeader>
              <CardTitle>{currentProof.title}</CardTitle>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">By {currentProof.author}</p>
                {currentProof.proof_year && (
                  <div className="flex items-center text-xs">
                    <CalendarClock className="h-3 w-3 mr-1" />
                    <span>
                      {currentProof.proof_year < 0 
                        ? `${Math.abs(currentProof.proof_year)} BCE` 
                        : currentProof.proof_year}
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <MathDisplay math={currentProof.description} block={true} />
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                Challenge difficulty: {currentProof.difficulty}. Estimated time: {currentProof.time_estimate}.
              </p>
            </CardFooter>
          </Card>

          {currentProof.mathematician_proof && (
            <Card className="math-card bg-secondary/20">
              <CardHeader>
                <CardTitle className="text-sm">Original Proof (Historical Reference)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <MathDisplay math={currentProof.mathematician_proof} block={true} />
              </CardContent>
            </Card>
          )}

          {submitted ? (
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
                      <p>You've completed approximately {submitMutation.data?.progress || 0}% of the proof correctly.</p>
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
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label htmlFor="random-username" className="text-sm font-medium">Your Name:</label>
                <Input
                  id="random-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name"
                  className="max-w-xs bg-secondary/50 border-secondary"
                />
              </div>
              
              <MathEditor
                initialPrompt={currentProof.description}
                onSubmit={handleSubmit}
              />
            </div>
          )}
        </>
      ) : (
        <Card className="math-card p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No proofs available. Click the button to try again.</p>
            <Button onClick={getRandomProof} className="btn-round">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RandomDerive;
