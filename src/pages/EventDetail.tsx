
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventHeader from '@/components/event-detail/EventHeader';
import EventInfo from '@/components/event-detail/EventInfo';
import EventDescription from '@/components/event-detail/EventDescription';
import EventActions from '@/components/event-detail/EventActions';
import EventNotFound from '@/components/event-detail/EventNotFound';
import EventLoading from '@/components/event-detail/EventLoading';

// Define proper interfaces for the components
interface EventHeaderProps {
  title: string;
  date: string;
  location: string;
  category: string;
  organization: {
    id: string;
    name: string;
  };
  mainImageUrl?: string;
}

interface EventInfoProps {
  date: string;
  location: string;
  views: number;
  organization: {
    id: string;
    name: string;
  };
}

interface EventActionsProps {
  id: string;
  title: string;
}

interface EventDetail {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  category: string;
  main_image_url?: string;
  views: number;
  organization: {
    id: string;
    name: string;
  };
}

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchEventDetail = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            organization:organization_id (
              id, name
            )
          `)
          .eq('id', id)
          .single();

        if (error || !data) {
          setNotFound(true);
          throw error;
        }

        setEvent({
          id: data.id,
          title: data.title,
          date: data.date,
          location: data.location,
          description: data.description,
          category: data.category,
          main_image_url: data.main_image_url,
          views: data.views || 0,
          organization: {
            id: data.organization.id,
            name: data.organization.name,
          }
        });

        // Increment view count - fix the type error
        if (id) {
          try {
            await supabase.rpc('increment_views', { 
              table_name: 'events',
              row_id: id 
            });
          } catch (error) {
            console.error('Error incrementing views:', error);
          }
        }

      } catch (error) {
        console.error('Error fetching event details:', error);
        if (!notFound) {
          setNotFound(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetail();
  }, [id, notFound]);

  if (isLoading) {
    return (
      <>
        <Header />
        <EventLoading />
        <Footer />
      </>
    );
  }

  if (notFound || !event) {
    return (
      <>
        <Header />
        <EventNotFound />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <EventHeader 
          title={event.title}
          date={event.date}
          location={event.location}
          category={event.category}
          organization={event.organization}
          mainImageUrl={event.main_image_url}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2">
            <EventDescription description={event.description} />
          </div>
          <div className="space-y-6">
            <EventInfo 
              date={event.date}
              location={event.location}
              views={event.views}
              organization={event.organization}
            />
            <EventActions 
              id={event.id}
              title={event.title}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default EventDetail;
