
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Calendar, Clock, Share2, User, Building } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { shareContent } from '@/utils/shareUtils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { IncrementViewsParams } from '@/integrations/supabase/types-extended';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  category: string;
  main_image_url?: string;
  organization_id: string;
  views: number;
  organization?: {
    name: string;
    id: string;
  };
}

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchEventData = async () => {
      setLoading(true);
      try {
        // Incrementar visualizações - use type assertion with any
        const incrementResult = await supabase.rpc(
          'increment_views', 
          { 
            table_name: 'events',
            row_id: id 
          } as any
        );
        
        if (incrementResult.error) {
          console.error("Erro ao incrementar visualizações:", incrementResult.error);
        }

        // Buscar dados do evento
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            organization:organization_id (
              id,
              name
            )
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error('Erro ao buscar evento:', error);
          throw error;
        }

        if (data) {
          setEvent(data);
        }
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  const handleShare = () => {
    if (!event) return;
    
    const url = window.location.href;
    shareContent(
      event.title,
      `Confira o evento ${event.title} em ${event.location}`,
      url
    );
  };

  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
      adocao: 'Adoção',
      castracao: 'Castração',
      feira: 'Feira',
      vacinacao: 'Vacinação',
      arrecadacao: 'Arrecadação',
      educacao: 'Educação',
      outro: 'Outro'
    };
    
    return categories[category] || category;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Skeleton className="h-64 w-full" />
              <div className="p-6">
                <Skeleton className="h-10 w-3/4 mb-4" />
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-6 w-1/3 mb-4" />
                <Skeleton className="h-24 w-full mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Evento não encontrado</h1>
            <p className="mt-2 text-gray-600">O evento que você está procurando não existe ou foi removido.</p>
            <Button className="mt-4" variant="default" onClick={() => window.history.back()}>Voltar</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const eventDate = new Date(event.date);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Banner do evento */}
            <div className="h-64 bg-gray-300 relative">
              <img
                src={event.main_image_url || `https://via.placeholder.com/1200x400?text=${event.title}`}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-purple-100 text-purple-800 border border-purple-200">
                  {getCategoryName(event.category)}
                </Badge>
              </div>
            </div>
            
            {/* Informações do evento */}
            <div className="p-6">
              {/* Título e organização */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{event.title}</h1>
                {event.organization && (
                  <div className="flex items-center mt-2">
                    <Building size={16} className="text-gray-600 mr-2" />
                    <a 
                      href={`/ong/${event.organization.id}`} 
                      className="text-pet-purple hover:underline"
                    >
                      {event.organization.name}
                    </a>
                  </div>
                )}
              </div>
              
              {/* Data, hora, local */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                  <Calendar size={24} className="text-pet-purple mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Data</div>
                    <div className="font-medium">{format(eventDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</div>
                  </div>
                </div>
                
                <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                  <Clock size={24} className="text-pet-purple mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Horário</div>
                    <div className="font-medium">{format(eventDate, "HH:mm", { locale: ptBR })}</div>
                  </div>
                </div>
                
                <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                  <MapPin size={24} className="text-pet-purple mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Local</div>
                    <div className="font-medium">{event.location}</div>
                  </div>
                </div>
              </div>
              
              {/* Descrição */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Sobre o evento</h2>
                <div className="text-gray-700 whitespace-pre-line">
                  {event.description}
                </div>
              </div>
              
              {/* Botões de ação */}
              <div className="flex flex-wrap gap-3">
                <Button variant="default" className="bg-pet-purple hover:bg-pet-lightPurple">
                  Confirmar presença
                </Button>
                <Button variant="outline" className="flex items-center" onClick={handleShare}>
                  <Share2 size={16} className="mr-2" />
                  Compartilhar
                </Button>
                {event.organization && (
                  <Button variant="outline" className="flex items-center" asChild>
                    <a href={`/ong/${event.organization.id}`}>
                      <Building size={16} className="mr-2" />
                      Conhecer a organização
                    </a>
                  </Button>
                )}
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
