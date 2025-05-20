
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Eye, Phone, Mail, Share2, Globe, Heart, Instagram, Facebook, FileText, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import EventCard from '@/components/EventCard';
import { shareContent } from '@/utils/shareUtils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Json } from '@/integrations/supabase/types';

interface Organization {
  id: string;
  name: string;
  type: string;
  action_area: string;
  whatsapp: string;
  email: string;
  website?: string;
  location: string;
  description: string;
  main_image_url?: string;
  views: number;
  social_media?: {
    instagram?: string;
    facebook?: string;
  };
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  category: string;
  main_image_url?: string;
  organization_id: string;
}

const OrgDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [org, setOrg] = useState<Organization | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sobre');

  useEffect(() => {
    if (!id) return;

    const fetchOrgData = async () => {
      setLoading(true);
      try {
        // Incrementar visualizações
        await supabase.rpc('increment_views', { 
          table_name: 'organizations',
          row_id: id 
        } as any).then(result => {
          if (result.error) {
            console.error("Erro ao incrementar visualizações:", result.error);
          }
        });

        // Buscar dados da organização
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Erro ao buscar organização:', error);
          throw error;
        }

        if (data) {
          // Transform the data to match the Organization interface
          const orgData: Organization = {
            ...data,
            social_media: data.social_media as { instagram?: string; facebook?: string; }
          };
          setOrg(orgData);

          // Buscar eventos da organização
          const { data: eventsData, error: eventsError } = await supabase
            .from('events')
            .select('*')
            .eq('organization_id', data.id)
            .order('date', { ascending: true });

          if (eventsError) {
            console.error('Erro ao buscar eventos:', eventsError);
          } else {
            setEvents(eventsData || []);
          }
        }
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrgData();
  }, [id]);

  const handleShare = () => {
    if (!org) return;
    
    const url = window.location.href;
    shareContent(
      org.name,
      `Conheça a ${org.name}, uma organização dedicada a ${org.action_area} em ${org.location}`,
      url
    );
  };

  const getActionAreaName = (area: string) => {
    const areas: Record<string, string> = {
      resgate: 'Resgate',
      adocao: 'Adoção',
      saude: 'Saúde',
      alimentacao: 'Alimentação',
      castracao: 'Castração',
      educacao: 'Educação',
      multipla: 'Múltiplas áreas'
    };
    
    return areas[area] || area;
  };

  const getOrgTypeName = (type: string) => {
    const types: Record<string, string> = {
      ong: 'ONG',
      voluntario: 'Voluntário',
      abrigo: 'Abrigo',
      protetor: 'Protetor Independente'
    };
    
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <Skeleton className="h-64 md:h-full w-full" />
                </div>
                <div className="md:w-1/2 p-6">
                  <Skeleton className="h-10 w-3/4 mb-4" />
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-6 w-1/3 mb-4" />
                  <Skeleton className="h-24 w-full mb-4" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-6 w-full mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Organização não encontrada</h1>
            <p className="mt-2 text-gray-600">A organização que você está procurando não existe ou foi removida.</p>
            <Button className="mt-4" variant="default" onClick={() => window.history.back()}>Voltar</Button>
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
                    src={org.main_image_url || `https://via.placeholder.com/600x400?text=${org.name}`}
                    alt={org.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 flex gap-1">
                    <Badge className="bg-purple-100 text-purple-800 border border-purple-200">
                      {getOrgTypeName(org.type)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Informações */}
              <div className="md:w-1/2 p-6">
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold text-gray-800">{org.name}</h1>
                </div>
                
                <div className="flex items-center mt-2">
                  <Badge variant="outline" className="bg-blue-50">
                    Área de Atuação: {getActionAreaName(org.action_area)}
                  </Badge>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={18} className="mr-2" />
                    <span>{org.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Eye size={18} className="mr-2" />
                    <span>{org.views || 0} visualizações</span>
                  </div>
                </div>
                
                {/* Tabs */}
                <div className="mt-6 border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab('sobre')}
                      className={`pb-4 px-1 ${activeTab === 'sobre' 
                        ? 'border-b-2 border-pet-purple font-medium text-pet-purple' 
                        : 'border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                      Sobre
                    </button>
                    <button
                      onClick={() => setActiveTab('eventos')}
                      className={`pb-4 px-1 ${activeTab === 'eventos' 
                        ? 'border-b-2 border-pet-purple font-medium text-pet-purple' 
                        : 'border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                      Eventos{events.length > 0 && ` (${events.length})`}
                    </button>
                  </nav>
                </div>
                
                {/* Tab Content */}
                <div className="mt-6">
                  {activeTab === 'sobre' && (
                    <>
                      <h2 className="text-xl font-semibold mb-2">Sobre a Organização</h2>
                      <p className="text-gray-600 whitespace-pre-line">
                        {org.description}
                      </p>
                    
                      <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">Contato</h2>
                        <div className="space-y-3">
                          <div className="flex items-center text-gray-600">
                            <Phone size={16} className="mr-2" />
                            <span>{org.whatsapp} (WhatsApp)</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Mail size={16} className="mr-2" />
                            <span>{org.email}</span>
                          </div>
                          {org.website && (
                            <div className="flex items-center text-gray-600">
                              <Globe size={16} className="mr-2" />
                              <a 
                                href={org.website.startsWith('http') ? org.website : `https://${org.website}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[#5D23BE] hover:underline"
                              >
                                {org.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {org.social_media && (
                        <div className="mt-6">
                          <h3 className="font-medium text-gray-800 mb-2">Redes Sociais</h3>
                          <div className="flex flex-col space-y-2">
                            {org.social_media.instagram && (
                              <div className="flex items-center text-gray-600">
                                <Instagram size={16} className="mr-2 text-pink-600" />
                                <span>{org.social_media.instagram}</span>
                              </div>
                            )}
                            {org.social_media.facebook && (
                              <div className="flex items-center text-gray-600">
                                <Facebook size={16} className="mr-2 text-blue-600" />
                                <span>{org.social_media.facebook}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-8 flex flex-wrap gap-3">
                        <Button variant="default" className="bg-pet-purple hover:bg-pet-lightPurple flex items-center">
                          <Heart size={16} className="mr-2" />
                          Doar Agora
                        </Button>
                        <Button variant="outline">Entrar em Contato</Button>
                        <Button variant="outline" className="flex items-center" onClick={handleShare}>
                          <Share2 size={16} className="mr-2" />
                          Compartilhar
                        </Button>
                        <Button variant="outline" className="flex items-center">
                          <FileText size={16} className="mr-2" />
                          Ver Relatórios
                        </Button>
                      </div>
                    </>
                  )}
                  
                  {activeTab === 'eventos' && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold">Eventos da {org.name}</h2>
                      {events.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {events.map(event => (
                            <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex flex-col">
                                <div className="mb-2">
                                  {event.main_image_url ? (
                                    <img 
                                      src={event.main_image_url}
                                      alt={event.title}
                                      className="w-full h-40 object-cover rounded-md"
                                    />
                                  ) : (
                                    <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center">
                                      <Calendar className="h-12 w-12 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <h3 className="font-medium text-lg">{event.title}</h3>
                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                  <Calendar className="mr-1 h-4 w-4" />
                                  {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy', às' HH:mm", { locale: ptBR })}
                                </div>
                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                  <MapPin className="mr-1 h-4 w-4" />
                                  {event.location}
                                </div>
                                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{event.description}</p>
                                
                                <Badge className="mt-2 w-fit">
                                  {getActionAreaName(event.category)}
                                </Badge>
                                
                                <Button 
                                  variant="link"
                                  className="text-pet-purple mt-2 px-0" 
                                  asChild
                                >
                                  <a href={`/evento/${event.id}`}>Ver detalhes</a>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 border rounded-lg">
                          <Calendar className="h-12 w-12 text-gray-400 mx-auto" />
                          <p className="mt-2 text-gray-600">Esta organização ainda não cadastrou eventos.</p>
                        </div>
                      )}
                    </div>
                  )}
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

export default OrgDetail;
