
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdocaoForm from '@/components/anunciar/AdocaoForm';
import PerdidoForm from '@/components/anunciar/PerdidoForm';
import OngForm from '@/components/anunciar/OngForm';
import ProdutoForm from '@/components/anunciar/ProdutoForm';

const Anunciar = () => {
  const { toast } = useToast();
  const [anuncioTipo, setAnuncioTipo] = useState('adocao');
  
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
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="adocao">Adoção de Pets</TabsTrigger>
                <TabsTrigger value="perdido">Pet Perdido</TabsTrigger>
                <TabsTrigger value="ong">ONG/Voluntário</TabsTrigger>
                <TabsTrigger value="produto">Produtos e Serviços</TabsTrigger>
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
              
              {/* Tab de Produtos e Serviços */}
              <TabsContent value="produto">
                <ProdutoForm onSubmit={handleSubmit} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Anunciar;
