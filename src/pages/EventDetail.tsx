
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { eventsMock } from '@/data/mockData';
import { MapPin, Eye, Phone, Mail, Share2, Calendar, Clock, Users } from 'lucide-react';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const event = eventsMock.find(event => event.id === id);

  if (!event) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Evento não encontrado</h1>
            <p className="mt-2 text-gray-600">O evento que você está procurando não existe ou foi removido.</p>
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
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/600x400?text=${event.title}`;
                    }}
                  />
                  <Badge className="absolute top-4 right-4 bg-indigo-100 text-indigo-800 border border-indigo-200">
                    {event.category}
                  </Badge>
                </div>
              </div>
              
              {/* Informações */}
              <div className="md:w-1/2 p-6">
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold text-gray-800">{event.title}</h1>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Calendar size={18} className="mr-2 text-[#5D23BE]" />
                    <span className="font-medium">{event.date}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Clock size={18} className="mr-2" />
                    <span>14:00 - 18:00</span> {/* Horário simulado */}
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin size={18} className="mr-2" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Users size={18} className="mr-2" />
                    <span>Capacidade: 100 pessoas</span> {/* Capacidade simulada */}
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Eye size={18} className="mr-2" />
                    <span>{event.views} visualizações</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-2">Descrição</h2>
                  <p className="text-gray-600">
                    {/* Simulação de descrição, em produção viria do banco de dados */}
                    {event.title} é um evento imperdível para todos os amantes de pets. 
                    {event.category === 'Adoção' && " Venha conhecer e adotar um novo amigo para sua família!"}
                    {event.category === 'Saúde' && " Garanta a saúde do seu pet com profissionais especializados."}
                    {event.category === 'Educação' && " Aprenda técnicas e dicas para melhorar a vida do seu animal de estimação."}
                    {event.category === 'Lazer' && " Momentos de diversão e socialização para você e seu pet."}
                  </p>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Organizador</h2>
                  <div className="space-y-3">
                    <p className="font-medium">ONG Amigos dos Animais</p>
                    <div className="flex items-center text-gray-600">
                      <Phone size={16} className="mr-2" />
                      <span>(11) 98765-4321</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail size={16} className="mr-2" />
                      <span>evento@email.com</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button variant="purple">Participar</Button>
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

export default EventDetail;
