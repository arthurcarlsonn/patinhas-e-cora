
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Anunciar from "./pages/Anunciar";
import QuemSomos from "./pages/QuemSomos";
import LinksUteis from "./pages/LinksUteis";
import BuscarPets from "./pages/BuscarPets";
import Entrar from "./pages/Entrar";
import Empresas from "./pages/Empresas";
import EmpresaDashboard from "./pages/EmpresaDashboard";
import VerPets from "./pages/VerPets";
import VerProdutos from "./pages/VerProdutos";
import VerONGs from "./pages/VerONGs";
import VerEventos from "./pages/VerEventos";
import VerClinicas from "./pages/VerClinicas";
import PetDetail from "./pages/PetDetail";
import ProductDetail from "./pages/ProductDetail";
import OrgDetail from "./pages/OrgDetail";
import EventDetail from "./pages/EventDetail";
import ClinicDetail from "./pages/ClinicDetail";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/anunciar" element={<Anunciar />} />
          <Route path="/quem-somos" element={<QuemSomos />} />
          <Route path="/links-uteis" element={<LinksUteis />} />
          <Route path="/buscar-pets" element={<BuscarPets />} />
          <Route path="/entrar" element={<Entrar />} />
          <Route path="/empresas" element={<Empresas />} />
          <Route path="/empresa/dashboard" element={<EmpresaDashboard />} />
          <Route path="/pets" element={<VerPets />} />
          <Route path="/produtos" element={<VerProdutos />} />
          <Route path="/ongs" element={<VerONGs />} />
          <Route path="/eventos" element={<VerEventos />} />
          <Route path="/clinicas" element={<VerClinicas />} />
          <Route path="/pet/:id" element={<PetDetail />} />
          <Route path="/produto/:id" element={<ProductDetail />} />
          <Route path="/ong/:id" element={<OrgDetail />} />
          <Route path="/evento/:id" element={<EventDetail />} />
          <Route path="/clinica/:id" element={<ClinicDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
