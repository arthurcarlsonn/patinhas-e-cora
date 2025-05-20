
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { Loader2, CalendarPlus, Calendar, MapPin, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  category: string;
  main_image_url: string | null;
  organization_id: string;
  organization_name?: string;
}

const OngEventList = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchEvents = async () => {
      try {
        // Primeiro, buscar todas as organizações do usuário
        const { data: orgs, error: orgsError } = await supabase
          .from('organizations')
          .select('id, name')
          .eq('user_id', user.id);

        if (orgsError) {
          throw orgsError;
        }

        if (!orgs || orgs.length === 0) {
          setEvents([]);
          setLoading(false);
          return;
        }

        // Buscar eventos para todas as organizações do usuário
        const orgIds = orgs.map(org => org.id);
        
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .in('organization_id', orgIds)
          .order('date', { ascending: true });

        if (eventsError) {
          throw eventsError;
        }

        // Adicionar nome da organização a cada evento
        const formattedEvents = eventsData.map(event => {
          const org = orgs.find(o => o.id === event.organization_id);
          return {
            ...event,
            organization_name: org?.name || 'Organização desconhecida'
          };
        });

        setEvents(formattedEvents);
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        toast({
          description: 'Não foi possível carregar seus eventos',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  const handleDelete = async (eventId: string) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) {
      return;
    }
    
    setDeleting(eventId);
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);
      
      if (error) throw error;
      
      setEvents(prev => prev.filter(event => event.id !== eventId));
      
      toast({
        description: 'O evento foi removido com sucesso'
      });
    } catch (error: any) {
      console.error('Erro ao excluir evento:', error);
      toast({
        description: 'Não foi possível excluir o evento',
        variant: 'destructive'
      });
    } finally {
      setDeleting(null);
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      adocao: 'Adoção',
      castracao: 'Castração',
      feira: 'Feira',
      vacinacao: 'Vacinação',
      arrecadacao: 'Arrecadação',
      educacao: 'Educação',
      outro: 'Outro'
    };
    
    return categories[category as keyof typeof categories] || category;
  };
  
  const getCategoryColor = (category: string) => {
    const colors = {
      adocao: 'bg-green-100 text-green-800',
      castracao: 'bg-blue-100 text-blue-800',
      feira: 'bg-purple-100 text-purple-800',
      vacinacao: 'bg-indigo-100 text-indigo-800',
      arrecadacao: 'bg-amber-100 text-amber-800',
      educacao: 'bg-teal-100 text-teal-800',
      outro: 'bg-gray-100 text-gray-800'
    };
    
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-pet-purple" />
        </div>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Nenhum evento encontrado</h2>
            <p className="text-gray-600 mb-6">
              Você ainda não criou nenhum evento para suas ONGs ou iniciativas.
            </p>
            <Link to="#novo-evento">
              <Button
                className="bg-pet-purple hover:bg-pet-lightPurple"
              >
                <CalendarPlus className="mr-2 h-4 w-4" />
                Criar meu primeiro evento
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-pet-darkPurple">Meus Eventos</h2>
          <Link to="#novo-evento">
            <Button className="bg-pet-purple hover:bg-pet-lightPurple">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Novo Evento
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="flex-1">
                  <div className="flex items-start">
                    {event.main_image_url ? (
                      <img 
                        src={event.main_image_url}
                        alt={event.title}
                        className="w-24 h-24 object-cover rounded-md mr-4 hidden md:block"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded-md mr-4 flex items-center justify-center hidden md:flex">
                        <Calendar className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-lg">{event.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Calendar className="mr-1 h-4 w-4" />
                        {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy', às' HH:mm", { locale: ptBR })}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="mr-1 h-4 w-4" />
                        {event.location}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge className={getCategoryColor(event.category)}>
                          {getCategoryLabel(event.category)}
                        </Badge>
                        <Badge variant="outline">{event.organization_name}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/eventos/${event.id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Link>
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDelete(event.id)}
                    disabled={deleting === event.id}
                  >
                    {deleting === event.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OngEventList;
