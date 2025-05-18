
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The mathematical proof you're looking for doesn't exist or has been moved to a different dimension.
      </p>
      <Button asChild className="btn-round">
        <Link to="/">Return to Homepage</Link>
      </Button>
    </div>
  );
};

export default NotFound;
