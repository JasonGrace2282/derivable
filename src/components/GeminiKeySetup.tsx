
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, Check, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type GeminiKeySetupProps = {
  onSuccess: (key: string) => void;
};

export function GeminiKeySetup({ onSuccess }: GeminiKeySetupProps) {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const { toast } = useToast();

  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a Gemini API key",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("validate-gemini-key", {
        body: { apiKey },
      });

      if (error) throw new Error(error.message);

      if (data.valid) {
        toast({
          title: "API Key Valid",
          description: "Your Gemini API key is valid and has been saved",
        });
        setValidated(true);
        localStorage.setItem("GEMINI_API_KEY", apiKey);
        onSuccess(apiKey);
      } else {
        toast({
          title: "Invalid API Key",
          description: data.message || "Please check your API key and try again",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Validation Error",
        description: err instanceof Error ? err.message : "Could not validate the API key",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="math-card animate-fade-in">
      <CardHeader>
        <CardTitle>Gemini API Setup</CardTitle>
        <CardDescription>
          To enable AI evaluation and hints, you need to provide a Google Gemini API key.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm">
            <p className="mb-2">
              To get your Gemini API key:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Visit the <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a></li>
              <li>Create or sign in with your Google account</li>
              <li>Create an API key</li>
              <li>Copy and paste it below</li>
            </ol>
          </div>
          
          <div className="flex flex-col gap-3">
            <label htmlFor="gemini-api-key" className="text-sm font-medium">
              Gemini API Key
            </label>
            <Input
              id="gemini-api-key"
              type="password"
              placeholder="Enter your Gemini API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-secondary/50"
            />
            <p className="text-xs text-muted-foreground">
              Your API key will be stored locally on your device for this session only.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full btn-round"
          onClick={validateApiKey}
          disabled={loading || validated}
        >
          {loading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Validating...
            </>
          ) : validated ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              API Key Validated
            </>
          ) : (
            "Validate & Save API Key"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
