import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function DailyCard() {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="math-card bg-slate-800/70 dark:bg-slate-800/50 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-lg flex flex-col h-full hover:border-primary/60 transition-colors duration-300">
      <CardHeader className="pb-3 px-5 pt-5">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold text-white">Daily Derive</CardTitle>
          <div className="flex items-center text-xs text-slate-400 dark:text-slate-500">
            <Calendar className="h-4 w-4 mr-1.5" />
            <span>{dateStr}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-5 px-5 flex-grow flex flex-col justify-center items-center text-center">
        <div className="flex flex-col items-center justify-center my-6">
          <Sparkles className="h-16 w-16 text-primary/80 mb-3" />
          <p className="text-2xl font-bold text-primary">It's New!</p>
        </div>
        <p className="text-sm text-slate-300 dark:text-slate-400 leading-relaxed">
          Challenge yourself with today's mathematical derivation. A new proof is
          available every day!
        </p>
      </CardContent>
      <CardFooter className="px-5 pb-5 mt-auto">
        <Button asChild className="w-full btn-round bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105 shadow-md">
          <Link to="/daily">Solve Today's Derive</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}