
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventHeader from '@/components/event-detail/EventHeader';
import EventInfo from '@/components/event-detail/EventInfo';
import EventDescription from '@/components/event-detail/EventDescription';
import EventActions from '@/components/event-detail/EventActions';
import EventNotFound from '@/components/event-detail/EventNotFound';
import EventLoading from '@/components/event-detail/EventLoading';
import { Separator } from '@/components/ui/separator';

interface Organization {
  id: string;
  name: string;
  main_image_url?: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  main_image_url?: string;
  organization_id: string;
  organization?: Organization;
  views: number;
  created_at: string;
  updated_at: string;
}

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [organization, setOrganization] = useState<Organization | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setNotFound(true);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            organization:organization_id (
              id,
              name,
              main_image_url
            )
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error('Erro ao buscar evento:', error);
          setNotFound(true);
          return;
        }

        if (data) {
          setEvent(data as Event);
          if (data.organization) {
            setOrganization(data.organization as unknown as Organization);
          }

          // Increment view count
          await supabase
            .from('events')
            .update({ views: (data.views || 0) + 1 })
            .eq('id', id);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Erro ao buscar evento:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
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
          category={event.category}
          organization={event.organization}
          imageUrl={event.main_image_url}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2">
            <EventDescription description={event.description} />
          </div>
          <div className="space-y-6">
            <EventInfo 
              date={event.date}
              location={event.location}
            />
            <EventActions 
              eventId={event.id}
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
