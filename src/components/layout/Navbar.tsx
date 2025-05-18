
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Book, Calendar, DicesIcon, Swords, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  {
    name: "Daily Derive",
    path: "/daily",
    icon: <Calendar className="h-4 w-4 mr-2" />,
  },
  {
    name: "Math Duel",
    path: "/duel",
    icon: <Swords className="h-4 w-4 mr-2" />,
  },
  {
    name: "Famous Proofs",
    path: "/proofs",
    icon: <Book className="h-4 w-4 mr-2" />,
  },
  {
    name: "Random Derive",
    path: "/random",
    icon: <DicesIcon className="h-4 w-4 mr-2" />,
  },
];

export function Navbar() {
  const location = useLocation();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary">Derivable</span>
              <span className="text-xs text-muted-foreground">Math Dueling App</span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 flex items-center justify-center space-x-1 md:space-x-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "rounded-full",
                location.pathname === item.path && "bg-secondary"
              )}
              asChild
            >
              <Link to={item.path} className="flex items-center">
                {item.icon}
                <span className="hidden sm:inline">{item.name}</span>
              </Link>
            </Button>
          ))}
        </nav>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Users className="h-4 w-4" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
