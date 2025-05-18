import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userSolution, referenceSolution, mathematicianProof, source, action, apiKey, model } = await req.json()
    const effectiveApiKey = apiKey || GEMINI_API_KEY;
    const modelName = model || "gemini-1.5-flash-latest";
    
    if (!effectiveApiKey) {
      return new Response(
        JSON.stringify({ error: "No API key provided" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    let prompt = "";
    
    if (action === "evaluate") {
      prompt = `
        As an expert mathematics professor, evaluate this proof solution. 
        
        REFERENCE SOLUTION: ${referenceSolution}
        
        USER'S SOLUTION: ${userSolution}
        
        ORIGINAL MATHEMATICIAN'S APPROACH: ${mathematicianProof || "Not available"}
        
        HISTORICAL CONTEXT: ${source || "Not available"}
        
        Evaluate the user's solution on these criteria:
        1. Is it correct (true/false)?
        2. Is it on the right track (true/false)?
        3. What percentage (0-100) of the proof is correctly completed?
        4. Provide specific, constructive feedback about the solution.
        
        Format your response as a JSON object with the following structure:
        {
          "is_correct": boolean,
          "on_right_track": boolean,
          "progress": number,
          "feedback": "string with feedback"
        }
        
        Be thorough in your evaluation. Consider:
        - Mathematical correctness
        - Logical flow
        - Completeness of steps
        - Clarity of explanation
        - Adherence to mathematical conventions
      `;
    } else if (action === "hint") {
      prompt = `
        As an expert mathematics professor familiar with this proof, provide a helpful hint.
        
        PROOF TO SOLVE: ${referenceSolution}
        
        MATHEMATICIAN'S APPROACH: ${mathematicianProof || "Not available"}
        
        HISTORICAL CONTEXT: ${source || "Not available"}
        
        USER'S CURRENT SOLUTION: ${userSolution || "The user has not started yet."}
        
        Provide a single, clear hint that guides without giving away the full solution.
        The hint should help them take the next step in their reasoning.
        Be concise (maximum 2-3 sentences) but mathematically precise.
        Focus on the next logical step they should take.
        
        Format your response as a simple text string without any JSON formatting.
      `;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": effectiveApiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    const data = await response.json();
    
    let responseText = "";
    try {
      responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      if (action === "evaluate") {
        // Try to parse the response as JSON
        try {
          const jsonMatch = responseText.match(/```json\s*(\{[\s\S]*?\})\s*```/) || 
                          responseText.match(/\{[\s\S]*"feedback"[\s\S]*\}/);
          
          if (jsonMatch) {
            const jsonStr = jsonMatch[1] || jsonMatch[0];
            const result = JSON.parse(jsonStr);
            
            // Validate the result structure
            if (typeof result.is_correct === 'boolean' &&
                typeof result.on_right_track === 'boolean' &&
                typeof result.progress === 'number' &&
                typeof result.feedback === 'string') {
              return new Response(JSON.stringify(result), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              });
            }
          }
          
          // If we couldn't parse JSON or validate structure, return a formatted response
          return new Response(JSON.stringify({
            is_correct: false,
            on_right_track: true,
            progress: 50,
            feedback: "Could not parse AI evaluation. Please try submitting again."
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } catch (parseError) {
          console.error("Error parsing evaluation response:", parseError);
          throw new Error("Failed to parse evaluation response");
        }
      }
    } catch (error) {
      console.error("Error processing Gemini response:", error);
      console.log("Original response:", data);
    }

    // Always return a response field for hints
    if (action === "hint") {
      return new Response(JSON.stringify({ response: responseText }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ response: responseText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in evaluate-proof function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
