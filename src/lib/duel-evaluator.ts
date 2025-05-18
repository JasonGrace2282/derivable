import { evaluateProof } from "./proof-evaluator";
import { supabase } from "@/integrations/supabase/client";

export async function evaluateDuelSubmission(
  userSolution: string,
  referenceSolution: string,
  duelId: string,
  userName: string,
  apiKey?: string | null
) {
  try {
    // Always use the environment API key if available
    const envApiKey = "AIzaSyDe_XhNzMw-iy23SuCWCpJ46I8zUXZEbZY";
    const effectiveApiKey = apiKey || envApiKey;
    
    if (effectiveApiKey) {
      const { data, error } = await supabase.functions.invoke("evaluate-proof", {
        body: {
          userSolution,
          referenceSolution,
          action: "evaluate",
          apiKey: effectiveApiKey
        },
      });

      if (error) throw new Error(error.message);
      
      return data;
    } 
    else {
      const progress = await evaluateProof(userSolution, referenceSolution);
      
      return {
        is_correct: progress > 80,
        on_right_track: progress > 40,
        progress,
        feedback: "Your solution has been evaluated locally. For more detailed AI feedback, please set up the Gemini API."
      };
    }
  } catch (error) {
    console.error("Error in duel evaluation:", error);
    const progress = await evaluateProof(userSolution, referenceSolution);
    
    return {
      is_correct: progress > 80,
      on_right_track: progress > 40,
      progress,
      feedback: "Evaluation encountered an error. This is an estimated score."
    };
  }
}
