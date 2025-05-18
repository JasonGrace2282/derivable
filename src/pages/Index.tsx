import { Button } from "@/components/ui/button";
import { DailyCard } from "@/components/DailyCard";
import { DuelCard } from "@/components/DuelCard";
import { Link } from "react-router-dom";
import { ProofCard } from "@/components/ProofCard";
import { Book, DicesIcon, History } from "lucide-react";

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
    <div className="space-y-16 animate-fade-in pb-16 bg-background text-foreground">
      <section className="relative text-center py-20 px-4 overflow-hidden min-h-[60vh] flex flex-col justify-center items-center">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-blue-500/70 to-purple-600/70 animate-gradient-xy"></div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white shadow-lg">
          Derive, Duel, Discover
        </h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-white/90">
          Tackle mathematical proofs from history's greatest minds. Challenge
          friends in math duels. Explore the beauty of mathematical reasoning.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="btn-round bg-white text-primary hover:bg-gray-100 shadow-md transition-transform hover:scale-105">
            <Link to="/daily">Today's Challenge</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="btn-round border-white text-white hover:bg-white/10 shadow-md transition-transform hover:scale-105">
            <Link to="/proofs">Browse Proofs</Link>
          </Button>
        </div>
      </section>

      <section className="px-4 md:px-8">
        <div className="flex justify-start items-center mb-6 md:mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">Daily Highlights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <DailyCard />
          <DuelCard />
        </div>
      </section>

      <section className="bg-slate-800/[.65] dark:bg-slate-800/80 backdrop-blur-sm p-6 md:p-10 rounded-2xl shadow-lg mx-4 md:mx-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Proofs</h2>
          <Button variant="outline" asChild className="btn-round text-primary border-primary hover:bg-primary/10 hover:text-primary focus:ring-primary transition-transform hover:scale-105">
            <Link to="/proofs" className="flex items-center">
              <span>View All</span>
              <Book className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
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
      
      <section className="bg-gradient-to-br from-primary/80 via-blue-500/80 to-purple-600/80 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between shadow-lg mx-4 md:mx-8 text-white">
        <div className="mb-6 md:mb-0 md:mr-10 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Feeling Adventurous?</h2>
          <p className="text-lg md:text-xl text-white/90 mb-4 md:mb-0">
            Try a random mathematical derivation challenge
          </p>
        </div>
        <Button asChild size="lg" className="btn-round bg-white text-primary hover:bg-gray-100 shadow-md transition-transform hover:scale-105 shrink-0">
          <Link to="/random" className="flex items-center px-6 py-3">
            <DicesIcon className="mr-2 h-5 w-5" />
            <span>Random Derive</span>
          </Link>
        </Button>
      </section>
    </div>
  );
};

export default Index;