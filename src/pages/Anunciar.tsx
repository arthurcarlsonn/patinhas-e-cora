
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdocaoForm from '@/components/anunciar/AdocaoForm';
import PerdidoForm from '@/components/anunciar/PerdidoForm';
import { Card, CardContent } from '@/components/ui/card';
import { Building, AlertCircle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Anunciar = () => {
  const { toast } = useToast();
  const [anuncioTipo, setAnuncioTipo] = useState('adocao');
  const [isBusinessUser, setIsBusinessUser] = useState(false);
  const [isNgoUser, setIsNgoUser] = useState(false);
  const { user, userType } = useAuth();
  
  // Check if user is logged in as business or ngo user
  useEffect(() => {
    const businessUserLoggedIn = localStorage.getItem('businessUserLoggedIn') === 'true' || userType === 'company';
    const ngoUserLoggedIn = localStorage.getItem('ngoUserLoggedIn') === 'true' || userType === 'ngo';
    
    setIsBusinessUser(businessUserLoggedIn);
    setIsNgoUser(ngoUserLoggedIn);
  }, [userType]);
  
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
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="adocao">Adoção de Pets</TabsTrigger>
                <TabsTrigger value="perdido">Pet Perdido</TabsTrigger>
              </TabsList>
              
              {/* Tab de Adoção de Pets */}
              <TabsContent value="adocao">
                <AdocaoForm onSubmit={handleSubmit} />
              </TabsContent>
              
              {/* Tab de Pet Perdido */}
              <TabsContent value="perdido">
                <PerdidoForm onSubmit={handleSubmit} />
              </TabsContent>
            </Tabs>
            
            {/* Seção para ONGs e Voluntários */}
            <div className="mt-8 border-t pt-8">
              <h2 className="text-xl font-bold mb-4 text-pet-darkPurple">ONGs e Voluntários</h2>
              
              {isNgoUser ? (
                <Link to="/ong/dashboard" className="block">
                  <Button className="w-full bg-pet-purple hover:bg-pet-lightPurple">
                    <Heart className="mr-2 h-4 w-4" />
                    Acessar Dashboard de ONG/Voluntário
                  </Button>
                </Link>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-rose-500">
                        <Heart className="h-10 w-10" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Área exclusiva para ONGs e Voluntários</h3>
                        <p className="text-gray-600 mb-4">
                          Para se cadastrar como ONG ou voluntário e publicar anúncios de ações sociais, é necessário ter uma conta específica. 
                          Registre-se como ONG/voluntário ou faça login na sua conta existente.
                        </p>
                        <Link to="/entrar">
                          <Button className="flex items-center gap-2 bg-pet-purple hover:bg-pet-lightPurple">
                            <Heart className="h-4 w-4" />
                            Cadastrar como ONG/voluntário
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Seção para anúncios de Produtos e Serviços - exclusivo para empresas */}
            <div className="mt-8 border-t pt-8">
              <h2 className="text-xl font-bold mb-4 text-pet-darkPurple">Anúncios de Produtos e Serviços</h2>
              
              {isBusinessUser ? (
                <Link to="/empresa/dashboard" className="block">
                  <Button className="w-full bg-pet-purple hover:bg-pet-lightPurple">
                    <Building className="mr-2 h-4 w-4" />
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
