
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import Index from '@/pages/Index';
import BuscarPets from '@/pages/BuscarPets';
import Entrar from '@/pages/Entrar';
import Empresas from '@/pages/Empresas';
import Dashboard from '@/pages/Dashboard';
import EmpresaDashboard from '@/pages/EmpresaDashboard';
import OngDashboard from '@/pages/OngDashboard';
import Anunciar from '@/pages/Anunciar';
import QuemSomos from '@/pages/QuemSomos';
import LinksUteis from '@/pages/LinksUteis';
import NotFound from '@/pages/NotFound';
import PetDetail from '@/pages/PetDetail';
import PetEdit from '@/pages/PetEdit';
import ClinicDetail from '@/pages/ClinicDetail';
import ProductDetail from '@/pages/ProductDetail';
import EventDetail from '@/pages/EventDetail';
import OrgDetail from '@/pages/OrgDetail';
import VerPets from '@/pages/VerPets';
import VerProdutos from '@/pages/VerProdutos';
import VerClinicas from '@/pages/VerClinicas';
import VerONGs from '@/pages/VerONGs';
import VerEventos from '@/pages/VerEventos';
import AuthCallback from '@/pages/AuthCallback';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/buscar" element={<BuscarPets />} />
          <Route path="/entrar" element={<Entrar />} />
          <Route path="/empresas" element={<Empresas />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/empresa/dashboard" element={<EmpresaDashboard />} />
          <Route path="/ong/dashboard" element={<OngDashboard />} />
          <Route path="/anunciar" element={<Anunciar />} />
          <Route path="/quem-somos" element={<QuemSomos />} />
          <Route path="/links-uteis" element={<LinksUteis />} />
          <Route path="/pet/:id" element={<PetDetail />} />
          <Route path="/edit/pet/:id" element={<PetEdit />} />
          <Route path="/clinica/:id" element={<ClinicDetail />} />
          <Route path="/produto/:id" element={<ProductDetail />} />
          <Route path="/evento/:id" element={<EventDetail />} />
          <Route path="/ong/:id" element={<OrgDetail />} />
          <Route path="/ver/pets" element={<VerPets />} />
          <Route path="/ver/produtos" element={<VerProdutos />} />
          <Route path="/ver/clinicas" element={<VerClinicas />} />
          <Route path="/ver/ongs" element={<VerONGs />} />
          <Route path="/ver/eventos" element={<VerEventos />} />
          <Route path="/auth-callback" element={<AuthCallback />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
