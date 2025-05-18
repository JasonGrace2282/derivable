
import { Button } from "@/components/ui/button";
import { DailyCard } from "@/components/DailyCard";
import { DuelCard } from "@/components/DuelCard";
import { Link } from "react-router-dom";
import { ProofCard } from "@/components/ProofCard";
import { Book, DicesIcon } from "lucide-react";

const featuredProofs = [
  {
    id: "pythagorean",
    title: "Pythagorean Theorem",
    author: "Pythagoras of Samos",
    description:
      "Prove that in a right-angled triangle, the square of the hypotenuse equals the sum of squares of the other two sides.",
    difficulty: "medium",
    timeEstimate: "20 min",
  },
  {
    id: "euler",
    title: "Euler's Identity",
    author: "Leonhard Euler",
    description:
      "Derive the famous equation that connects five fundamental mathematical constants: e^(iπ) + 1 = 0.",
    difficulty: "hard",
    timeEstimate: "30 min",
  }
];

const Index = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero section */}
      <section className="text-center py-10 px-4">
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
            Derive, Duel, Discover
          </span>
        </h1>
        <p className="text-xl max-w-2xl mx-auto mb-8 text-muted-foreground">
          Tackle mathematical proofs from history's greatest minds. Challenge
          friends in math duels. Explore the beauty of mathematical reasoning.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="btn-round">
            <Link to="/daily">Today's Challenge</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="btn-round">
            <Link to="/proofs">Browse Proofs</Link>
          </Button>
        </div>
      </section>

      {/* Featured cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DailyCard />
        <DuelCard />
      </section>

      {/* More features */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Featured Proofs</h2>
          <Button variant="ghost" asChild className="text-primary btn-round">
            <Link to="/proofs" className="flex items-center">
              <span>View All</span>
              <Book className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredProofs.map((proof, index) => (
            <ProofCard
              key={index}
              id={proof.id}
              title={proof.title}
              author={proof.author}
              description={proof.description}
              difficulty={proof.difficulty as "easy" | "medium" | "hard"}
              timeEstimate={proof.timeEstimate}
            />
          ))}
        </div>
      </section>

      {/* Random derive section */}
      <section className="bg-secondary rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Feeling Adventurous?</h2>
          <p className="text-muted-foreground mb-4 md:mb-0">
            Try a random mathematical derivation challenge
          </p>
        </div>
        <Button asChild size="lg" className="btn-round">
          <Link to="/random" className="flex items-center">
            <DicesIcon className="mr-2 h-4 w-4" />
            <span>Random Derive</span>
          </Link>
        </Button>
      </section>
    </div>
  );
};

export default Index;
