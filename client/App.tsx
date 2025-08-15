/**
 * © 2025 B&S Best Services Angola & Alegria Matoso Investimentos.
 * Tutelado por Kaijhe Morose.
 * Todos os direitos reservados.
 * Proibida a cópia, modificação, distribuição ou uso sem autorização escrita.
 */

import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Portal from "./pages/Portal";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Sobre from "./pages/Sobre";
import Exames from "./pages/Exames";
import Contato from "./pages/Contato";
import Equipe from "./pages/Equipe";
import Galeria from "./pages/Galeria";
import FAQ from "./pages/FAQ";
import Planos from "./pages/Planos";

// Specialty pages
import Cardiologia from "./pages/specialties/Cardiologia";
import Pediatria from "./pages/specialties/Pediatria";
import Dermatologia from "./pages/specialties/Dermatologia";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/portal/*" element={<Portal />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/exames" element={<Exames />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/equipe" element={<Equipe />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/planos" element={<Planos />} />

          {/* Specialty Routes */}
          <Route path="/especialidades/cardiologia" element={<Cardiologia />} />
          <Route path="/especialidades/pediatria" element={<Pediatria />} />
          <Route
            path="/especialidades/dermatologia"
            element={<Dermatologia />}
          />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
