
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';
import { EventCardProps } from '@/components/EventCard';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { eventsMock } from '@/data/mockData';

const VerEventos = () => {
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Temporarily using mock data as the events table is not created yet
        // When the events table is created, uncomment the code below and remove the mock data
        /*
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });

        if (error) {
          console.error('Erro ao buscar eventos:', error);
          return;
        }

        if (data) {
          // Convert data from database to EventCard format
          const formattedEvents: EventCardProps[] = data.map(event => ({
            id: event.id,
            title: event.title,
            image: event.image_url || `https://via.placeholder.com/300x200?text=Evento`,
            date: new Date(event.date),
            location: event.location,
            organizer: event.organizer,
            description: event.description,
            category: event.category
          }));

          setEvents(formattedEvents);
        }
        */
        
        // Using mock data for now
        setEvents(eventsMock);
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="py-12 bg-[#4e049c]">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white uppercase mb-2">Todos os Eventos</h1>
            <p className="text-lg text-white/80 mb-8">Confira os próximos eventos para pets</p>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array(8).fill(0).map((_, index) => (
                  <div key={index} className="rounded-lg overflow-hidden border border-white/20 bg-white/10">
                    <Skeleton className="h-48 w-full bg-white/20" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-6 w-3/4 bg-white/20" />
                      <Skeleton className="h-4 w-1/2 bg-white/20" />
                      <Skeleton className="h-4 w-1/2 bg-white/20" />
                      <Skeleton className="h-4 w-full bg-white/20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : events.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {events.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-white">Nenhum evento encontrado. Cadastre o primeiro!</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default VerEventos;
