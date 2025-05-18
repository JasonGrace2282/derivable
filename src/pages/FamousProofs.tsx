
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProofCard } from "@/components/ProofCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Search, Loader, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Proof } from "@/types/database";
import { Badge } from "@/components/ui/badge";

const FamousProofs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");

  const { data: proofs, isLoading } = useQuery({
    queryKey: ["proofs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("proofs")
        .select("*")
        .order('difficulty', { ascending: true })
        .order('title', { ascending: true });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Proof[];
    }
  });

  const categoryCount = proofs?.reduce((acc, proof) => {
    const category = proof.category || "uncategorized";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const filteredProofs = proofs?.filter(proof => {
    const matchesSearch = 
      proof.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proof.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proof.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (currentTab === "all") return matchesSearch;
    return matchesSearch && proof.category === currentTab;
  }) || [];

  const categories = proofs 
    ? [...new Set(proofs.map(proof => proof.category || "uncategorized"))]
        .sort()
    : [];

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentTab("all");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Book className="mr-2 h-6 w-6 text-primary" />
            Famous Mathematical Proofs
          </h1>
          <p className="text-muted-foreground">
            Explore and derive classic proofs from history's greatest mathematicians
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-sm py-1">
            {filteredProofs.length} proofs
          </Badge>
        </div>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, author, or keywords..."
            className="pl-9 bg-secondary/50 border-secondary"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs for categories */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full overflow-auto">
        <TabsList className="bg-secondary/50 p-1 flex flex-nowrap overflow-x-auto">
          <TabsTrigger value="all" className="rounded-md whitespace-nowrap">
            All ({proofs?.length || 0})
          </TabsTrigger>
          {categories.map(category => (
            <TabsTrigger 
              key={category} 
              value={category} 
              className="rounded-md whitespace-nowrap"
            >
              {category === "uncategorized" ? "Other" : category} ({categoryCount[category] || 0})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={currentTab} className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProofs.length > 0 ? (
                filteredProofs.map((proof) => (
                  <ProofCard
                    key={proof.id}
                    id={proof.id}
                    title={proof.title}
                    author={proof.author}
                    description={proof.description}
                    difficulty={proof.difficulty}
                    timeEstimate={proof.time_estimate}
                    category={proof.category}
                    proofYear={proof.proof_year}
                    sourceText={proof.source_text}
                    sourceUrl={proof.source_url}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">
                    No proofs found matching your search criteria.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4 btn-round"
                    onClick={clearSearch}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FamousProofs;
