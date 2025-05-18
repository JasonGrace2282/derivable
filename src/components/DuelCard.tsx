import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Swords } from "lucide-react";
import { Link } from "react-router-dom";

export function DuelCard() {
  return (
    <Card className="math-card bg-slate-800/70 dark:bg-slate-800/50 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-lg flex flex-col h-full hover:border-primary/60 transition-colors duration-300">
      <CardHeader className="pb-3 px-5 pt-5">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold text-white">Math Duel</CardTitle>
          <Swords className="h-6 w-6 text-primary/90" />
        </div>
      </CardHeader>
      <CardContent className="pb-5 px-5 flex-grow flex flex-col justify-center items-center text-center">
        <div className="my-6">
          <Swords className="h-20 w-20 text-primary/80" />
        </div>
        <p className="text-sm text-slate-300 dark:text-slate-400 leading-relaxed">
          Challenge your friends in mathematical duels! Race to complete proofs faster
          and more accurately than your opponents.
        </p>
      </CardContent>
      <CardFooter className="px-5 pb-5 mt-auto">
        <Button asChild className="w-full btn-round bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105 shadow-md">
          <Link to="/duel">Start a Duel</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}