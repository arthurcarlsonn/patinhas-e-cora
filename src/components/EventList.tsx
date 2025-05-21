
import React, { useState, useEffect } from 'react';
import EventCard, { EventCardProps } from './EventCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface EventListProps {
  title: string;
  viewAllLink?: string;
  limit?: number;
  organizationId?: string;
}

const EventList = ({
  title,
  viewAllLink,
  limit = 6,
  organizationId
}: EventListProps) => {
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('events')
          .select(`
            id,
            title,
            date,
            location,
            category,
            main_image_url,
            views,
            organization_id
          `)
          .order('date', { ascending: true });
        
        // If organizationId is provided, filter by it
        if (organizationId) {
          query = query.eq('organization_id', organizationId);
        }
        
        // Apply limit
        query = query.limit(limit);
        
        const { data, error } = await query;

        if (error) {
          console.error('Erro ao buscar eventos:', error);
          return;
        }

        if (data) {
          // Convert data from database to EventCard format
          const formattedEvents: EventCardProps[] = data.map(event => ({
            id: event.id,
            title: event.title,
            category: event.category,
            image: event.main_image_url || `https://via.placeholder.com/300x200?text=Evento`,
            date: new Date(event.date).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            }),
            location: event.location,
            views: event.views || 0
          }));

          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [limit, organizationId]); // Add organizationId as a dependency

  return (
    <section className="py-12 bg-[#4e049c]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold text-white uppercase">{title}</h2>
            <p className="text-sm md:text-base text-white/80">Encontre tudo o que seu pet precisa em um só lugar</p>
          </div>
          {viewAllLink && (
            <Link to={viewAllLink}>
              <Button variant="purple" className="bg-white text-[#5D23BE] hover:bg-white/90">
                Ver tudo
              </Button>
            </Link>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-12 w-12 text-white animate-spin" />
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {events.map(event => <EventCard key={event.id} {...event} />)}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/10 rounded-lg">
            <p className="text-white">Nenhum evento encontrado no momento.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventList;
