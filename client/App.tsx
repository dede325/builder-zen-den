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
import Login from "./pages/Login";

// Specialty pages
import Cardiologia from "./pages/specialties/Cardiologia";
import Pediatria from "./pages/specialties/Pediatria";
import Dermatologia from "./pages/specialties/Dermatologia";

// Manager Dashboard
import { ManagerLayout } from "./components/manager/ManagerLayout";
import { ManagerDashboard } from "./components/manager/ManagerDashboard";
import { ConsultasManager } from "./components/manager/ConsultasManager";
import { ExamesManager } from "./components/manager/ExamesManager";
import { FinanceiroManager } from "./components/manager/FinanceiroManager";
import { UsuariosManager } from "./components/manager/UsuariosManager";
import { MensagensManager } from "./components/manager/MensagensManager";
import { RelatoriosManager } from "./components/manager/RelatoriosManager";
import { EstoqueManager } from "./components/manager/EstoqueManager";
import { PerfilGestor } from "./components/manager/PerfilGestor";
import { ThemeProvider } from "next-themes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/portal/*" element={<Portal />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/exames" element={<Exames />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/equipe" element={<Equipe />} />
            <Route path="/galeria" element={<Galeria />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/planos" element={<Planos />} />

            {/* Manager Dashboard Routes */}
            <Route path="/manager" element={<ManagerLayout />}>
              <Route index element={<ManagerDashboard />} />
              <Route path="consultas" element={<ConsultasManager />} />
              <Route path="exames" element={<ExamesManager />} />
              <Route path="financeiro" element={<FinanceiroManager />} />
              <Route path="usuarios" element={<UsuariosManager />} />
              <Route path="mensagens" element={<MensagensManager />} />
              <Route path="relatorios" element={<RelatoriosManager />} />
              <Route path="estoque" element={<EstoqueManager />} />
              <Route path="perfil" element={<PerfilGestor />} />
            </Route>

            {/* Specialty Routes */}
            <Route
              path="/especialidades/cardiologia"
              element={<Cardiologia />}
            />
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
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
