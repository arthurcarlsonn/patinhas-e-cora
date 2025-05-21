
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, Clock, Edit, Eye, MapPin, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

interface EventListProps {}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  main_image_url?: string;
  organization_id: string;
  views: number;
  organization?: {
    name: string;
  };
}

const getCategoryName = (category: string): string => {
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

const OngEventList = ({}: EventListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [userOrgIds, setUserOrgIds] = useState<string[]>([]);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchUserOrgs = async () => {
      try {
        const { data: orgs, error } = await supabase
          .from('organizations')
          .select('id')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        if (orgs) {
          const ids = orgs.map(org => org.id);
          setUserOrgIds(ids);
        }
      } catch (error) {
        console.error('Error fetching user organizations:', error);
      }
    };
    
    fetchUserOrgs();
  }, [user]);
  
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user || userOrgIds.length === 0) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            organization:organization_id (
              name
            )
          `)
          .in('organization_id', userOrgIds)
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        setEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os eventos.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [user, userOrgIds, toast]);
  
  const handleDeleteEvent = async (eventId: string) => {
    if (!user) return;
    
    setDeleting(eventId);
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);
        
      if (error) throw error;
      
      // Update local state
      setEvents(prev => prev.filter(event => event.id !== eventId));
      
      toast({
        title: "Evento excluído",
        description: "O evento foi removido com sucesso."
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o evento.",
        variant: "destructive"
      });
    } finally {
      setDeleting(null);
    }
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold text-pet-darkPurple">Meus Eventos</h2>
        </div>
        
        {Array(3).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-56 h-48">
                <Skeleton className="h-full w-full" />
              </div>
              <CardContent className="flex-grow p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-pet-darkPurple">Meus Eventos</h2>
        <Button 
          onClick={() => navigate('/ong/dashboard/novo-evento')} 
          className="bg-pet-purple hover:bg-pet-lightPurple"
        >
          <Plus className="mr-2 h-4 w-4" /> Criar Evento
        </Button>
      </div>
      
      {events.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Nenhum evento encontrado</h3>
          <p className="text-gray-500 mb-4">Você ainda não criou nenhum evento.</p>
          <Button 
            onClick={() => navigate('/ong/dashboard/novo-evento')} 
            className="bg-pet-purple hover:bg-pet-lightPurple"
          >
            <Plus className="mr-2 h-4 w-4" /> Criar meu primeiro evento
          </Button>
        </div>
      ) : (
        events.map((event) => {
          const eventDate = new Date(event.date);
          return (
            <Card key={event.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-56 h-48">
                  <img
                    src={event.main_image_url || `https://via.placeholder.com/400x300?text=${event.title}`}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/400x300?text=${event.title}`;
                    }}
                  />
                </div>
                <CardContent className="flex-grow p-6">
                  <div className="flex justify-between mb-2">
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                    <Badge className="bg-purple-100 text-purple-800 border border-purple-200">
                      {getCategoryName(event.category)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(eventDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    <Clock className="ml-4 mr-2 h-4 w-4" />
                    {format(eventDate, "HH:mm", { locale: ptBR })}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MapPin className="mr-2 h-4 w-4" />
                    {event.location}
                  </div>
                  
                  <p className="text-gray-600 line-clamp-2 mb-4">{event.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Eye className="mr-1 h-4 w-4" />
                    <span>{event.views || 0} visualizações</span>
                  </div>
                </CardContent>
              </div>
              <CardFooter className="bg-gray-50 px-6 py-3 flex justify-end space-x-2">
                <Link to={`/evento/${event.id}`}>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/ong/dashboard/evento/${event.id}/edit`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Excluir evento</DialogTitle>
                      <DialogDescription>
                        Tem certeza que deseja excluir o evento "{event.title}"? Esta ação não pode ser desfeita.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DialogClose>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteEvent(event.id)}
                        disabled={deleting === event.id}
                      >
                        {deleting === event.id ? "Excluindo..." : "Sim, excluir"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default OngEventList;
