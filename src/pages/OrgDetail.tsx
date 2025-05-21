
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventList from '@/components/EventList';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, MapPin, Phone, Mail, Globe, Instagram, Facebook, Calendar, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Update the OrgCardProps definition to match what's being used
interface OrgCardProps {
  id: string;
  name: string;
  description: string;
  type: string;
  actionArea: string;
  location: string;
  image: string;
  views: number;
  contato: {
    email: string;
    phone: string;
    website?: string;
    socialMedia?: {
      instagram?: string;
      facebook?: string;
    }
  }
}

interface SocialMedia {
  instagram?: string;
  facebook?: string;
}

const OrgDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [org, setOrg] = useState<OrgCardProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sobre');

  useEffect(() => {
    const fetchOrgDetail = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          // Process socialMedia safely
          let socialMedia: SocialMedia = {};
          
          if (data.social_media && typeof data.social_media === 'object') {
            const socialObj = data.social_media as Record<string, string>;
            socialMedia = {
              instagram: socialObj.instagram,
              facebook: socialObj.facebook
            };
          }

          setOrg({
            id: data.id,
            name: data.name,
            description: data.description,
            type: data.type,
            actionArea: data.action_area,
            location: data.location,
            image: data.main_image_url || "https://via.placeholder.com/400x300?text=ONG",
            views: data.views || 0,
            contato: {
              email: data.email,
              phone: data.whatsapp,
              website: data.website,
              socialMedia
            }
          });
        }

        // Increment view count
        try {
          await supabase.rpc('increment_views', { 
            table_name: 'organizations',
            row_id: id 
          });
        } catch (error) {
          console.error('Error incrementing views:', error);
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes da ONG:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as informações da ONG.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrgDetail();
  }, [id, toast]);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="w-full md:w-1/3 h-60 rounded-lg" />
            <div className="w-full md:w-2/3 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-1/4" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!org) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">ONG não encontrada</h2>
          <p className="text-gray-500 mb-8">A organização que você está procurando não está disponível ou não existe.</p>
          <Button onClick={() => window.history.back()}>Voltar</Button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* ONG Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="w-full md:w-1/3">
            <div className="rounded-lg overflow-hidden border shadow-sm">
              <img 
                src={org?.image} 
                alt={org?.name} 
                className="w-full h-full object-cover aspect-video"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/400x300?text=ONG`;
                }}
              />
            </div>
          </div>
          
          <div className="w-full md:w-2/3 space-y-4">
            <h1 className="text-3xl font-bold">{org?.name}</h1>
            
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {org?.type}
              </span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                {org?.actionArea}
              </span>
            </div>
            
            <div className="flex items-center text-gray-500">
              <MapPin size={16} className="mr-1" />
              <span>{org?.location}</span>
            </div>
            
            <div className="flex items-center text-gray-500">
              <Eye size={16} className="mr-1" />
              <span>{org?.views} visualizações</span>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {org?.contato?.email && (
                <Button variant="outline" size="sm">
                  <Mail size={16} className="mr-1" />
                  Contato
                </Button>
              )}
              
              {org?.contato?.website && (
                <Button variant="outline" size="sm" onClick={() => window.open(org?.contato?.website, '_blank')}>
                  <Globe size={16} className="mr-1" />
                  Site
                </Button>
              )}
              
              {org?.contato?.socialMedia?.instagram && (
                <Button variant="outline" size="sm" onClick={() => window.open(`https://instagram.com/${org?.contato?.socialMedia?.instagram}`, '_blank')}>
                  <Instagram size={16} className="mr-1" />
                  Instagram
                </Button>
              )}
              
              {org?.contato?.socialMedia?.facebook && (
                <Button variant="outline" size="sm" onClick={() => window.open(`https://facebook.com/${org?.contato?.socialMedia?.facebook}`, '_blank')}>
                  <Facebook size={16} className="mr-1" />
                  Facebook
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* ONG Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="sobre" className="flex items-center gap-2">
              <Info size={16} />
              Sobre
            </TabsTrigger>
            <TabsTrigger value="eventos" className="flex items-center gap-2">
              <Calendar size={16} />
              Eventos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sobre">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Sobre a ONG</h2>
              <p className="whitespace-pre-line">{org?.description}</p>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contato</h3>
                  
                  {org?.contato?.email && (
                    <div className="flex items-center">
                      <Mail size={20} className="mr-2 text-pet-purple" />
                      <span>{org?.contato.email}</span>
                    </div>
                  )}
                  
                  {org?.contato?.phone && (
                    <div className="flex items-center">
                      <Phone size={20} className="mr-2 text-pet-purple" />
                      <span>{org?.contato.phone}</span>
                    </div>
                  )}
                  
                  {org?.contato?.website && (
                    <div className="flex items-center">
                      <Globe size={20} className="mr-2 text-pet-purple" />
                      <a href={org?.contato.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {org?.contato.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Localização</h3>
                  <div className="flex items-center">
                    <MapPin size={20} className="mr-2 text-pet-purple" />
                    <span>{org?.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="eventos">
            <EventList 
              title="Eventos da ONG"
              viewAllLink={`/eventos`}
              filter={`organization_id.eq.${id}`}
              limit={4}
            />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </>
  );
};

export default OrgDetail;
