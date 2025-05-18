
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { evaluateProof as localEvaluate } from "@/lib/proof-evaluator";

type EvaluationResult = {
  is_correct: boolean;
  on_right_track: boolean;
  progress: number;
  feedback: string;
};

export function useGemini() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyChecked, setApiKeyChecked] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem("GEMINI_API_KEY");
    if (storedKey) {
      setApiKey(storedKey);
    }
    setApiKeyChecked(true);
  }, []);

  const evaluateProof = async (
    userSolution: string,
    referenceSolution: string,
    mathematicianProof?: string,
    source?: string
  ): Promise<EvaluationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // Always use the environment variable API key
      const envApiKey = "AIzaSyDe_XhNzMw-iy23SuCWCpJ46I8zUXZEbZY";
      // Use user API key as fallback for evaluation
      const effectiveApiKey = apiKey || envApiKey;

      const { data, error } = await supabase.functions.invoke("evaluate-proof", {
        body: {
          userSolution,
          referenceSolution,
          mathematicianProof,
          source,
          action: "evaluate",
          apiKey: effectiveApiKey,
        },
      });

      if (error) throw new Error(error.message);

      return data as EvaluationResult;
    } 
    catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to evaluate proof";
      setError(errorMessage);
      console.error("Error evaluating proof:", err);
      

      const progress = await localEvaluate(userSolution, referenceSolution);
      return {
        is_correct: progress > 80,
        on_right_track: progress > 40,
        progress,
        feedback: "Could not evaluate with AI. This is an estimated score based on local evaluation."
      };
    } finally {
      setIsLoading(false);
    }
  };

  const getHint = async (
    referenceSolution: string,
    userSolution: string = "",
    mathematicianProof?: string,
    source?: string
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      // Always use the environment variable API key
      const envApiKey = "AIzaSyDe_XhNzMw-iy23SuCWCpJ46I8zUXZEbZY";
      
      // Use the environment API key directly, no need to check if it exists
      const { data, error } = await supabase.functions.invoke("evaluate-proof", {
        body: {
          userSolution,
          referenceSolution,
          mathematicianProof,
          source,
          action: "hint",
          apiKey: envApiKey, // Always use the env API key
        },
      });

      if (error) throw new Error(error.message);

      return data.response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get hint";
      setError(errorMessage);
      console.error("Error getting hint:", err);
      return "Try reviewing the problem statement again and breaking it down step by step.";
    } finally {
      setIsLoading(false);
    }
  };

  const setGeminiApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("GEMINI_API_KEY", key);
  };

  return { 
    evaluateProof, 
    getHint, 
    isLoading, 
    error,
    apiKey,
    apiKeyChecked,
    setGeminiApiKey
  };
}
