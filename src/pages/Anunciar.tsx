
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdocaoForm from '@/components/anunciar/AdocaoForm';
import PerdidoForm from '@/components/anunciar/PerdidoForm';
import OngForm from '@/components/anunciar/OngForm';
import { Card, CardContent } from '@/components/ui/card';
import { Building, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Anunciar = () => {
  const { toast } = useToast();
  const [anuncioTipo, setAnuncioTipo] = useState('adocao');
  const [isBusinessUser, setIsBusinessUser] = useState(false);
  
  // Check if user is logged in as business user
  useEffect(() => {
    const businessUserLoggedIn = localStorage.getItem('businessUserLoggedIn') === 'true';
    setIsBusinessUser(businessUserLoggedIn);
  }, []);
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: "Anúncio cadastrado com sucesso!",
      description: "Seu anúncio será revisado e publicado em breve.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-pet-darkPurple">Anunciar</h1>

            <Tabs defaultValue="adocao" onValueChange={setAnuncioTipo} className="mb-8">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="adocao">Adoção de Pets</TabsTrigger>
                <TabsTrigger value="perdido">Pet Perdido</TabsTrigger>
                <TabsTrigger value="ong">ONG/Voluntário</TabsTrigger>
              </TabsList>
              
              {/* Tab de Adoção de Pets */}
              <TabsContent value="adocao">
                <AdocaoForm onSubmit={handleSubmit} />
              </TabsContent>
              
              {/* Tab de Pet Perdido */}
              <TabsContent value="perdido">
                <PerdidoForm onSubmit={handleSubmit} />
              </TabsContent>
              
              {/* Tab de ONG/Voluntário */}
              <TabsContent value="ong">
                <OngForm onSubmit={handleSubmit} />
              </TabsContent>
            </Tabs>
            
            {/* Seção para anúncios de Produtos e Serviços - exclusivo para empresas */}
            <div className="mt-8 border-t pt-8">
              <h2 className="text-xl font-bold mb-4 text-pet-darkPurple">Anúncios de Produtos e Serviços</h2>
              
              {isBusinessUser ? (
                <Link to="/empresa/dashboard" className="block">
                  <Button className="w-full bg-pet-purple hover:bg-pet-lightPurple">
                    Ir para Dashboard de Empresa
                  </Button>
                </Link>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-amber-500">
                        <AlertCircle className="h-10 w-10" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Acesso exclusivo para empresas</h3>
                        <p className="text-gray-600 mb-4">
                          Para anunciar produtos e serviços, é necessário ter uma conta de empresa. 
                          Registre-se como empresa ou faça login na sua conta existente.
                        </p>
                        <Link to="/empresas">
                          <Button className="flex items-center gap-2 bg-pet-purple hover:bg-pet-lightPurple">
                            <Building className="h-4 w-4" />
                            Acessar como empresa
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Anunciar;
