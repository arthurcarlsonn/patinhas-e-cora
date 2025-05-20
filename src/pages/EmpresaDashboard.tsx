
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Package, Store, Settings, LogOut } from 'lucide-react';
import EmpresaProductForm from '@/components/empresa/EmpresaProductForm';
import EmpresaProfile from '@/components/empresa/EmpresaProfile';

const EmpresaDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('produtos');
  
  // Check if user is logged in as business
  useEffect(() => {
    const isBusinessUserLoggedIn = localStorage.getItem('businessUserLoggedIn') === 'true';
    
    if (!isBusinessUserLoggedIn) {
      navigate('/empresas');
    }
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  // Mock company data - in a real application, this would come from a backend
  const company = {
    name: "Pet Shop Exemplo",
    email: "contato@petshop.com",
    cnpj: "12.345.678/0001-90",
    phone: "(11) 98765-4321",
    logo: "https://github.com/shadcn.png",
    address: "Rua Exemplo, 123 - São Paulo, SP",
    website: "www.petshopexemplo.com",
    socialMedia: {
      instagram: "@petshopexemplo",
      facebook: "petshopexemplo"
    },
    description: "Loja especializada em produtos para pets com mais de 10 anos de experiência."
  };
  
  const handleLogout = () => {
    localStorage.removeItem('businessUserLoggedIn');
    navigate('/empresas');
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-pet-purple flex items-center justify-center text-white">
                  <Store size={32} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{company.name}</h1>
                  <p className="text-gray-600">{company.email}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Sair
              </Button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="produtos" className="flex gap-2 items-center">
                  <Package size={16} />
                  Meus Produtos e Serviços
                </TabsTrigger>
                <TabsTrigger value="perfil" className="flex gap-2 items-center">
                  <Settings size={16} />
                  Perfil da Empresa
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="produtos">
                <EmpresaProductForm />
              </TabsContent>
              
              <TabsContent value="perfil">
                <EmpresaProfile company={company} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmpresaDashboard;
