
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { IncrementViewsParams } from '@/integrations/supabase/types-extended';
import EventLoading from '@/components/event-detail/EventLoading';
import EventNotFound from '@/components/event-detail/EventNotFound';
import EventHeader from '@/components/event-detail/EventHeader';
import EventInfo from '@/components/event-detail/EventInfo';
import EventDescription from '@/components/event-detail/EventDescription';
import EventActions from '@/components/event-detail/EventActions';

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
        // Increment views with proper typing
        const incrementParams = {
          table_name: 'events',
          row_id: id
        };
        
        const incrementResult = await supabase.rpc(
          'increment_views',
          incrementParams
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

  if (loading) {
    return <EventLoading />;
  }

  if (!event) {
    return <EventNotFound />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <EventHeader 
              title={event.title}
              category={event.category}
              imageUrl={event.main_image_url}
              organization={event.organization}
            />
            
            <div className="p-6 pt-0">
              <EventInfo 
                date={event.date}
                location={event.location}
              />
              
              <EventDescription description={event.description} />
              
              <EventActions 
                eventTitle={event.title}
                eventLocation={event.location}
                organization={event.organization}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetail;
