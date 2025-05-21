import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, MapPin, Calendar, Mail, Phone, Globe, Instagram, Facebook, Clock, Info } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import PetList from '@/components/PetList';
import EventList from '@/components/EventList';
import { useAuth } from '@/contexts/AuthContext';

interface Organization {
  id: string;
  name: string;
  type: string;
  action_area: string;
  description: string;
  location: string;
  email: string;
  whatsapp: string;
  website?: string;
  main_image_url?: string;
  social_media?: Record<string, string>; // Changed from {instagram?: string; facebook?: string}
  user_id: string;
  views: number;
  created_at: string;
  updated_at: string;
}

const OrgDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('sobre');
  const { user } = useAuth();
  const isOwner = user?.id === organization?.user_id;

  useEffect(() => {
    if (id) {
      fetchOrganizationDetails(id);
    }
  }, [id]);

  const fetchOrganizationDetails = async (id: string) => {
    try {
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', id)
        .single();

      if (orgError) throw orgError;
      
      if (orgData) {
        // Convert social_media to the right format
        const org: Organization = {
          ...orgData,
          social_media: typeof orgData.social_media === 'object' ? 
            orgData.social_media : {}
        };
        
        setOrganization(org);
        setIsLoading(false);

        // Update view count
        updateViewCount(id, orgData.views || 0);
      }
    } catch (error) {
      console.error('Erro ao buscar ONG:', error);
      setError('Não foi possível carregar os detalhes da ONG.');
      setIsLoading(false);
    }
  };

  const updateViewCount = async (orgId: string, currentViews: number) => {
    try {
      await supabase
        .from('organizations')
        .update({ views: currentViews + 1 })
        .eq('id', orgId);
    } catch (error) {
      console.error('Erro ao atualizar visualizações:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Erro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">{error || 'ONG não encontrada'}</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link to="/ongs">
                <Button>Voltar para ONGs</Button>
              </Link>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="relative rounded-lg overflow-hidden mb-8 bg-gradient-to-r from-pet-purple to-pet-lightPurple">
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center md:items-end gap-6">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-white">
                <AvatarImage src={organization.main_image_url || ''} alt={organization.name} />
                <AvatarFallback className="text-2xl md:text-4xl bg-pet-purple text-white">
                  {organization.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{organization.name}</h1>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="outline" className="bg-white/20 text-white border-white/40">
                    {organization.type}
                  </Badge>
                  <Badge variant="outline" className="bg-white/20 text-white border-white/40">
                    {organization.action_area}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{organization.location}</span>
                  </div>
                </div>
              </div>
              {isOwner && (
                <div className="ml-auto">
                  <Link to={`/ong/dashboard`}>
                    <Button variant="outline" className="bg-white text-pet-purple hover:bg-gray-100">
                      Gerenciar ONG
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
              <TabsTrigger value="sobre">Sobre</TabsTrigger>
              <TabsTrigger value="pets">Pets</TabsTrigger>
              <TabsTrigger value="eventos">Eventos</TabsTrigger>
            </TabsList>

            {/* About Tab */}
            <TabsContent value="sobre" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5" /> Sobre a ONG
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line">{organization.description}</p>
                    </CardContent>
                  </Card>

                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" /> Histórico
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>
                          Cadastrada em{' '}
                          {format(parseISO(organization.created_at), "dd 'de' MMMM 'de' yyyy", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Contato</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {organization.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-pet-purple" />
                          <a
                            href={`mailto:${organization.email}`}
                            className="text-pet-purple hover:underline"
                          >
                            {organization.email}
                          </a>
                        </div>
                      )}

                      {organization.whatsapp && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-pet-purple" />
                          <a
                            href={`https://wa.me/${organization.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pet-purple hover:underline"
                          >
                            {organization.whatsapp}
                          </a>
                        </div>
                      )}

                      {organization.website && (
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-pet-purple" />
                          <a
                            href={organization.website.startsWith('http') ? organization.website : `https://${organization.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pet-purple hover:underline"
                          >
                            {organization.website}
                          </a>
                        </div>
                      )}

                      {organization.social_media && (
                        <div className="mt-4">
                          <Separator className="my-4" />
                          <div className="flex gap-4">
                            {organization.social_media.instagram && (
                              <a
                                href={`https://instagram.com/${organization.social_media.instagram.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-pet-purple hover:text-pet-lightPurple"
                              >
                                <Instagram className="h-6 w-6" />
                              </a>
                            )}
                            {organization.social_media.facebook && (
                              <a
                                href={`https://facebook.com/${organization.social_media.facebook}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-pet-purple hover:text-pet-lightPurple"
                              >
                                <Facebook className="h-6 w-6" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Pets Tab */}
            <TabsContent value="pets" className="mt-6">
              <PetList
                title="Pets para Adoção"
                viewAllLink="/pets"
                limit={6}
                organizationId={organization.id}
              />
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="eventos" className="mt-6">
              <EventList
                title="Eventos da ONG"
                viewAllLink="/eventos"
                limit={6}
                organizationId={organization.id}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrgDetail;
