
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Swords, Users, Copy, ArrowRight, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import type { Duel, Proof } from "@/types/database";

const MathDuel = () => {
  const [duelCode, setDuelCode] = useState("");
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const { data: proofs } = useQuery({
    queryKey: ["proofs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("proofs")
        .select("*");
      
      if (error) throw new Error(error.message);
      return data as Proof[];
    }
  });
  
  const generateDuelCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setDuelCode(code);
    
    toast({
      title: "Duel code generated",
      description: `Share code ${code} with your opponent to start the duel.`,
    });
  };
  
  const copyDuelCode = () => {
    navigator.clipboard.writeText(duelCode);
    
    toast({
      title: "Copied to clipboard",
      description: "The duel code has been copied to your clipboard.",
    });
  };
  
  const createDuelMutation = useMutation({
    mutationFn: async ({ code, creatorName }: { code: string; creatorName: string }) => {
      if (!proofs || proofs.length === 0) {
        throw new Error("No proofs available to create a duel");
      }
      
      const randomProof = proofs[Math.floor(Math.random() * proofs.length)];
      
      const { data, error } = await supabase
        .from("duels")
        .insert([
          {
            code: code,
            creator_name: creatorName,
            proof_id: randomProof.id,
            status: 'waiting'
          }
        ])
        .select();
        
      if (error) throw new Error(error.message);
      return data[0] as Duel;
    },
    onSuccess: (data) => {
      toast({
        title: "Duel created!",
        description: "Share the code with your opponent to begin the challenge.",
      });
      
      localStorage.setItem("username", username);
      
      navigate(`/duel/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error creating duel",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const joinDuelMutation = useMutation({
    mutationFn: async ({ code, opponentName }: { code: string; opponentName: string }) => {
      const { data: existingDuels, error: findError } = await supabase
        .from("duels")
        .select("*")
        .eq("code", code)
        .eq("status", "waiting");
        
      if (findError) throw new Error(findError.message);
      
      if (!existingDuels || existingDuels.length === 0) {
        throw new Error("No active duel found with this code");
      }
      
      const duel = existingDuels[0] as Duel;
      
      const { data: updatedDuel, error: updateError } = await supabase
        .from("duels")
        .update({
          opponent_name: opponentName,
          status: "active",
          started_at: new Date().toISOString()
        })
        .eq("id", duel.id)
        .select();
        
      if (updateError) throw new Error(updateError.message);
      return updatedDuel[0] as Duel;
    },
    onSuccess: (data) => {
      toast({
        title: "Joined duel!",
        description: "You've successfully joined the challenge.",
      });
      
      localStorage.setItem("username", username);
      
      navigate(`/duel/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error joining duel",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleCreateDuel = () => {
    if (!username) {
      toast({
        title: "Username required",
        description: "Please enter your display name to create a duel.",
        variant: "destructive",
      });
      return;
    }
    
    if (!duelCode) {
      toast({
        title: "Generate a code first",
        description: "Please generate a duel code before creating the challenge.",
        variant: "destructive",
      });
      return;
    }
    
    createDuelMutation.mutate({
      code: duelCode,
      creatorName: username
    });
  };
  
  const joinDuel = () => {
    if (!username) {
      toast({
        title: "Username required",
        description: "Please enter your display name to join a duel.",
        variant: "destructive",
      });
      return;
    }
    
    if (duelCode.length < 6) {
      toast({
        title: "Invalid duel code",
        description: "Please enter a valid 6-character duel code.",
        variant: "destructive",
      });
      return;
    }
    
    joinDuelMutation.mutate({
      code: duelCode,
      opponentName: username
    });
  };
  
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Math Duel</h1>
        <p className="text-muted-foreground">
          Challenge your friends to a mathematical duel. Compete head-to-head to solve 
          proof challenges faster and more accurately.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Duel Card */}
        <Card className="math-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Swords className="h-5 w-5 mr-2 text-primary" />
              Create a Duel
            </CardTitle>
            <CardDescription>
              Host a new mathematical duel and invite an opponent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Your Display Name</Label>
                <Input 
                  id="username"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-secondary/50 border-secondary"
                />
              </div>

              {duelCode && (
                <div className="space-y-2">
                  <Label>Duel Code</Label>
                  <div className="flex">
                    <div className="flex-1 bg-secondary rounded-l-md p-2 font-mono text-lg flex items-center justify-center">
                      {duelCode}
                    </div>
                    <Button 
                      variant="outline" 
                      className="rounded-l-none"
                      onClick={copyDuelCode}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button 
              onClick={generateDuelCode} 
              className="w-full btn-round" 
              disabled={!username}
            >
              Generate Duel Code
            </Button>
            {duelCode && (
              <Button 
                onClick={handleCreateDuel} 
                className="w-full btn-round" 
                disabled={createDuelMutation.isPending}
              >
                {createDuelMutation.isPending ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Creating Duel...
                  </>
                ) : "Create Duel Challenge"}
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Join Duel Card */}
        <Card className="math-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Join a Duel
            </CardTitle>
            <CardDescription>
              Enter a duel code to join an existing challenge
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="join-username">Your Display Name</Label>
                <Input 
                  id="join-username"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-secondary/50 border-secondary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duel-code">Duel Code</Label>
                <Input 
                  id="duel-code"
                  placeholder="Enter the 6-digit code"
                  value={duelCode}
                  onChange={(e) => setDuelCode(e.target.value.toUpperCase())}
                  className="bg-secondary/50 border-secondary font-mono uppercase"
                  maxLength={6}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={joinDuel} 
              className="w-full btn-round"
              disabled={!username || duelCode.length < 6 || joinDuelMutation.isPending}
            >
              {joinDuelMutation.isPending ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Joining Duel...
                </>
              ) : "Join Duel"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Duel Explanation */}
      <Card className="math-card bg-secondary/60">
        <CardHeader>
          <CardTitle>How Math Duels Work</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Create a duel and share the code with your opponent</li>
            <li>Both participants will receive the same mathematical proof challenge</li>
            <li>Race to complete the proof correctly before your opponent</li>
            <li>Solutions are evaluated for both speed and accuracy</li>
            <li>The winner is the one who completes the most correct steps in the least time</li>
          </ol>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="btn-round w-full flex items-center justify-center">
            <span>Learn More</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MathDuel;
