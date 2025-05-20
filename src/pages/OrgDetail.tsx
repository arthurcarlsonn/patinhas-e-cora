
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { organizationsMock } from '@/data/mockData';
import { MapPin, Eye, Phone, Mail, Share2, Globe, Heart } from 'lucide-react';

const OrgDetail = () => {
  const { id } = useParams<{ id: string }>();
  const org = organizationsMock.find(org => org.id === id);

  if (!org) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Organização não encontrada</h1>
            <p className="mt-2 text-gray-600">A organização que você está procurando não existe ou foi removida.</p>
            <Button className="mt-4" variant="purple" onClick={() => window.history.back()}>Voltar</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="md:flex">
              {/* Imagem */}
              <div className="md:w-1/2">
                <div className="h-64 md:h-full bg-gray-300 relative">
                  <img
                    src={org.image}
                    alt={org.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/600x400?text=${org.name}`;
                    }}
                  />
                  <Badge className="absolute top-4 right-4 bg-purple-100 text-purple-800 border border-purple-200">
                    {org.category}
                  </Badge>
                </div>
              </div>
              
              {/* Informações */}
              <div className="md:w-1/2 p-6">
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold text-gray-800">{org.name}</h1>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={18} className="mr-2" />
                    <span>{org.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Eye size={18} className="mr-2" />
                    <span>{org.views} visualizações</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-2">Sobre a Organização</h2>
                  <p className="text-gray-600">
                    {/* Simulação de descrição, em produção viria do banco de dados */}
                    {org.name} é uma organização dedicada ao bem-estar animal. 
                    Trabalhamos para resgatar, cuidar e encontrar lares para animais abandonados.
                    Nossa missão é garantir que todos os animais tenham uma vida digna e feliz.
                  </p>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Contato</h2>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Phone size={16} className="mr-2" />
                      <span>(11) 98765-4321</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail size={16} className="mr-2" />
                      <span>contato@{org.name.toLowerCase().replace(/\s/g, '')}.org</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Globe size={16} className="mr-2" />
                      <a href="#" className="text-[#5D23BE] hover:underline">www.{org.name.toLowerCase().replace(/\s/g, '')}.org</a>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button variant="purple" className="flex items-center">
                    <Heart size={16} className="mr-2" />
                    Doar Agora
                  </Button>
                  <Button variant="outline">Entrar em Contato</Button>
                  <Button variant="outline" className="flex items-center">
                    <Share2 size={16} className="mr-2" />
                    Compartilhar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrgDetail;
