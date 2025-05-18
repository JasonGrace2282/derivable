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
    // First try to get from localStorage
    const storedKey = localStorage.getItem("GEMINI_API_KEY");
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      // If not in localStorage, try to get from environment
      const envKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (envKey) {
        setApiKey(envKey);
        localStorage.setItem("GEMINI_API_KEY", envKey);
      }
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
      if (!apiKey) {
        throw new Error("No API key available. Please set your Gemini API key first.");
      }

      const { data, error } = await supabase.functions.invoke("evaluate-proof", {
        body: {
          userSolution,
          referenceSolution,
          mathematicianProof,
          source,
          action: "evaluate",
          apiKey: apiKey,
          model: "gemini-1.5-flash-latest"
        },
      });

      if (error) throw new Error(error.message);

      // If Gemini returns a valid evaluation, use it
      if (data && typeof data.is_correct === 'boolean') {
        return data as EvaluationResult;
      }
      // If Gemini returns a response field, try to parse it
      if (data && data.response) {
        try {
          const parsed = JSON.parse(data.response);
          if (typeof parsed.is_correct === 'boolean') {
            return parsed as EvaluationResult;
          }
        } catch (e) {
          // Ignore parse error, fallback below
        }
      }
      // Fallback to local
      throw new Error("Gemini did not return a valid evaluation");
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

  const fallbackHints = [
    "Try breaking down the problem into smaller steps and consider the key mathematical principles involved.",
    "Focus on isolating the variable or term you are solving for.",
    "Have you considered using a substitution or transformation to simplify the equation?",
    "Look for patterns or symmetries in the problem statement.",
    "Try working backwards from the desired result to see what steps might be needed.",
    "Check if completing the square or factoring could help.",
    "Remember to check your work for algebraic errors.",
    "Think about what similar problems you've solved before and what strategies worked.",
    "Draw a diagram or visualize the problem if possible.",
    "Review the definitions and properties relevant to this topic."
  ];

  const getHint = async (
    referenceSolution: string,
    userSolution: string = "",
    mathematicianProof?: string,
    source?: string
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!apiKey) {
        throw new Error("No API key available. Please set your Gemini API key first.");
      }
      
      const { data, error } = await supabase.functions.invoke("evaluate-proof", {
        body: {
          userSolution,
          referenceSolution,
          mathematicianProof,
          source,
          action: "hint",
          apiKey: apiKey,
          model: "gemini-1.5-flash-latest"
        },
      });

      if (error) throw new Error(error.message);

      if (!data || typeof data.response !== 'string' || !data.response.trim()) {
        throw new Error("No hint received from the AI");
      }

      return data.response.trim();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get hint";
      setError(errorMessage);
      console.error("Error getting hint:", err);
      // Return a random fallback hint
      const randomIndex = Math.floor(Math.random() * fallbackHints.length);
      return fallbackHints[randomIndex];
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
