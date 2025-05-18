
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Layout } from "./components/layout/Layout";

import Index from "./pages/Index";
import DailyDerive from "./pages/DailyDerive";
import MathDuel from "./pages/MathDuel";
import DuelDetail from "./pages/DuelDetail";
import FamousProofs from "./pages/FamousProofs";
import ProofDetail from "./pages/ProofDetail";
import RandomDerive from "./pages/RandomDerive";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/daily" element={<DailyDerive />} />
            <Route path="/duel" element={<MathDuel />} />
            <Route path="/duel/:id" element={<DuelDetail />} />
            <Route path="/proofs" element={<FamousProofs />} />
            <Route path="/proofs/:id" element={<ProofDetail />} />
            <Route path="/random" element={<RandomDerive />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
