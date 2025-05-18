
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Swords } from "lucide-react";
import { Link } from "react-router-dom";

export function DuelCard() {
  return (
    <Card className="math-card border-primary/30 bg-gradient-to-b from-secondary to-card">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Math Duel</CardTitle>
          <Swords className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground">
          Challenge your friends in mathematical duels! Race to complete proofs faster
          and more accurately than your opponents.
        </p>
        <div className="mt-4 flex items-center justify-center">
          <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
            <Swords className="h-10 w-10 text-primary" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full btn-round">
          <Link to="/duel">Start a Duel</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
