import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Navbar } from "./Navbar";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Toaster />
      <Sonner />
      <Navbar />
      <main className="flex-1 container py-6">
        <Outlet />
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <div className="container">
          <p>© 2025 Made by <a href="https://github.com/ssbdragonfly" className="text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer">Shaurya</a>, <a href="https://github.com/JasonGrace2282" className="text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer">Aarush</a>, <a href="https://github.com/rithvikru" className="text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer">Rithvik</a></p>
        </div>
      </footer>
    </div>
  );
}