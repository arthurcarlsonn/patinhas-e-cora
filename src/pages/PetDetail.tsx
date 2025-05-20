
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { petsMock } from '@/data/mockData';
import { MapPin, Clock, Eye, Phone, Mail, Share2 } from 'lucide-react';

const PetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const pet = petsMock.find(pet => pet.id === id);

  if (!pet) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Pet não encontrado</h1>
            <p className="mt-2 text-gray-600">O pet que você está procurando não existe ou foi removido.</p>
            <Button className="mt-4" variant="purple" onClick={() => window.history.back()}>Voltar</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const statusColors = {
    perdido: 'bg-red-100 text-red-800 border-red-200',
    encontrado: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    adocao: 'bg-green-100 text-green-800 border-green-200',
  };
  
  const statusLabels = {
    perdido: 'Perdido',
    encontrado: 'Encontrado',
    adocao: 'Para Adoção',
  };

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
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/600x400?text=${pet.name}`;
                    }}
                  />
                  <Badge 
                    className={`absolute top-4 right-4 ${statusColors[pet.status]} border`}
                  >
                    {statusLabels[pet.status]}
                  </Badge>
                </div>
              </div>
              
              {/* Informações */}
              <div className="md:w-1/2 p-6">
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold text-gray-800">{pet.name}</h1>
                  <Badge variant="outline">{pet.type}</Badge>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={18} className="mr-2" />
                    <span>{pet.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Clock size={18} className="mr-2" />
                    <span>{pet.timeRegistered}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Eye size={18} className="mr-2" />
                    <span>{pet.views} visualizações</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-2">Descrição</h2>
                  <p className="text-gray-600">
                    {/* Simulação de descrição, em produção viria do banco de dados */}
                    {pet.name} é um {pet.type} adorável que precisa de um lar amoroso. 
                    {pet.status === 'perdido' && " Foi perdido recentemente e sua família está procurando por ele."}
                    {pet.status === 'encontrado' && " Foi encontrado recentemente e está procurando por sua família."}
                    {pet.status === 'adocao' && " Está disponível para adoção e procurando por uma família amorosa."}
                  </p>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Contato</h2>
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="https://github.com/shadcn.png" alt="Usuário" />
                      <AvatarFallback>UN</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <p className="font-medium text-gray-800">Usuário da Silva</p>
                      <div className="flex flex-col sm:flex-row sm:space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Phone size={14} className="mr-1" />
                          <span>(11) 98765-4321</span>
                        </div>
                        <div className="flex items-center mt-1 sm:mt-0">
                          <Mail size={14} className="mr-1" />
                          <span>usuario@email.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button variant="purple">Entrar em Contato</Button>
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

export default PetDetail;
