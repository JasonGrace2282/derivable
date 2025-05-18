
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface DuelShareCodeProps {
  code: string;
  duelId: string;
}

export function DuelShareCode({ code, duelId }: DuelShareCodeProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const baseUrl = window.location.origin;
  const duelUrl = `${baseUrl}/duel/${duelId}`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(duelUrl);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "The duel link has been copied to your clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my Math Duel",
          text: `Join me for a math duel with code: ${code}`,
          url: duelUrl,
        });
        
        toast({
          title: "Duel shared successfully",
          description: "You've shared the duel link",
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-secondary/30 rounded-xl">
        <div className="bg-white p-3 rounded-lg">
          <QRCodeSVG value={duelUrl} size={120} />
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="font-medium">Share this duel</p>
            <p className="text-sm text-muted-foreground">
              Scan the QR code or share the link below
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              value={duelUrl}
              readOnly
              className="bg-secondary/50 border-secondary"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={handleCopy}
              className="flex-shrink-0"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            
            {navigator.share && (
              <Button
                size="icon"
                variant="outline"
                onClick={handleShare}
                className="flex-shrink-0"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <p className="text-sm">
            <span className="text-muted-foreground">Duel Code: </span>
            <span className="font-mono font-medium">{code}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
