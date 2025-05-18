
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export function DailyCard() {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="math-card border-primary/30 bg-gradient-to-b from-secondary to-card">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Daily Derive</CardTitle>
          <div className="flex items-center text-primary text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{dateStr}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground">
          Challenge yourself with today's mathematical derivation. A new proof is
          available every day!
        </p>
        <div className="mt-4 flex items-center justify-center">
          <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl">
            New!
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full btn-round">
          <Link to="/daily">Solve Today's Derive</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
