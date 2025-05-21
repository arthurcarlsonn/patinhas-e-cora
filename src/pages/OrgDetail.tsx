
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventList from '@/components/EventList';
import PetList from '@/components/PetList';
import { Loader2, MapPin, Mail, Phone, Globe, Share2, Facebook, Instagram } from 'lucide-react';
import { shareContent } from '@/utils/shareUtils';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';

interface Organization {
  id: string;
  name: string;
  description: string;
  type: string;
  action_area: string;
  location: string;
  whatsapp: string;
  email: string;
  website?: string;
  main_image_url?: string;
  user_id: string;
  social_media: { 
    instagram?: string;
    facebook?: string;
    [key: string]: string | undefined;
  };
  created_at: string;
  updated_at: string;
  views: number;
}

interface OrganizationImage {
  id: string;
  organization_id: string;
  image_url: string;
  created_at: string;
}

const OrgDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [images, setImages] = useState<OrganizationImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState('sobre');

  useEffect(() => {
    const fetchOrganization = async () => {
      if (!id) {
        setNotFound(true);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Erro ao buscar organização:', error);
          setNotFound(true);
          return;
        }

        if (data) {
          // Handle social_media conversion
          let socialMedia = { instagram: '', facebook: '' };
          if (data.social_media) {
            try {
              if (typeof data.social_media === 'string') {
                socialMedia = JSON.parse(data.social_media);
              } else if (typeof data.social_media === 'object') {
                socialMedia = data.social_media as any;
              }
            } catch (e) {
              console.error('Erro ao parsear social_media:', e);
            }
          }

          const orgWithSocialMedia = {
            ...data,
            social_media: socialMedia
          };

          setOrganization(orgWithSocialMedia as Organization);

          // Increment view count
          await supabase
            .from('organizations')
            .update({ views: (data.views || 0) + 1 })
            .eq('id', id);

          // Fetch organization images
          const { data: imagesData, error: imagesError } = await supabase
            .from('organization_images')
            .select('*')
            .eq('organization_id', id)
            .order('created_at', { ascending: false });

          if (!imagesError && imagesData) {
            setImages(imagesData as OrganizationImage[]);
          }
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Erro ao buscar organização:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [id]);

  const handleShare = () => {
    try {
      if (organization) {
        shareContent({
          title: `Conheça ${organization.name}`,
          text: `Veja mais sobre ${organization.name}, uma organização de proteção animal em ${organization.location}`,
          url: window.location.href
        });
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      toast.error('Não foi possível compartilhar. Tente copiar o link manualmente.');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-pet-purple" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (notFound || !organization) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Organização não encontrada</h2>
                <p className="text-gray-600 mb-6">
                  A organização que você está procurando não existe ou foi removida.
                </p>
                <Link to="/ver-ongs">
                  <Button className="bg-pet-purple hover:bg-pet-lightPurple">
                    Ver outras ONGs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coluna da Esquerda - Info da ONG */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-pet-darkPurple mb-2">{organization.name}</h1>
              <div className="flex items-center text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{organization.location}</span>
                <span className="mx-2">•</span>
                <span className="text-pet-purple font-medium">{organization.type}</span>
              </div>
            </div>

            {organization.main_image_url && (
              <div className="rounded-lg overflow-hidden mb-6 max-h-96">
                <img 
                  src={organization.main_image_url} 
                  alt={organization.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <Tabs 
              defaultValue={activeTab} 
              onValueChange={setActiveTab}
              className="mb-8"
            >
              <TabsList className="mb-6">
                <TabsTrigger value="sobre">Sobre</TabsTrigger>
                <TabsTrigger value="galeria">Galeria</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sobre">
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Sobre {organization.name}</h3>
                    <p className="text-gray-700 whitespace-pre-line">{organization.description}</p>
                    
                    <Separator className="my-6" />
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold">Área de atuação</h4>
                      <p className="text-gray-700">{organization.action_area}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="galeria">
                <Card>
                  <CardContent className="pt-6">
                    {images.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {images.map(image => (
                          <div 
                            key={image.id} 
                            className="aspect-square rounded-lg overflow-hidden"
                          >
                            <img 
                              src={image.image_url} 
                              alt={`Imagem de ${organization.name}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4">Esta organização ainda não possui fotos na galeria.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Coluna da Direita - Contato e ações */}
          <div>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Contato</h3>
                
                <div className="space-y-4">
                  {organization.whatsapp && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-3 text-pet-purple" />
                      <div>
                        <p className="text-sm text-gray-500">WhatsApp</p>
                        <a 
                          href={`https://wa.me/${organization.whatsapp.replace(/\D/g, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-pet-darkPurple hover:text-pet-purple"
                        >
                          {organization.whatsapp}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {organization.email && (
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-3 text-pet-purple" />
                      <div>
                        <p className="text-sm text-gray-500">E-mail</p>
                        <a 
                          href={`mailto:${organization.email}`}
                          className="text-pet-darkPurple hover:text-pet-purple"
                        >
                          {organization.email}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {organization.website && (
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 mr-3 text-pet-purple" />
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <a 
                          href={organization.website.startsWith('http') ? organization.website : `https://${organization.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-pet-darkPurple hover:text-pet-purple"
                        >
                          {organization.website}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* Redes Sociais */}
                  <div className="pt-2">
                    <p className="text-sm text-gray-500 mb-2">Redes Sociais</p>
                    <div className="flex space-x-2">
                      {organization.social_media?.facebook && (
                        <a 
                          href={organization.social_media.facebook.startsWith('http') ? organization.social_media.facebook : `https://${organization.social_media.facebook}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                        >
                          <Facebook className="h-5 w-5 text-pet-darkPurple" />
                        </a>
                      )}
                      
                      {organization.social_media?.instagram && (
                        <a 
                          href={organization.social_media.instagram.startsWith('http') ? organization.social_media.instagram : `https://${organization.social_media.instagram}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                        >
                          <Instagram className="h-5 w-5 text-pet-darkPurple" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <Button 
                    onClick={handleShare}
                    variant="outline" 
                    className="w-full"
                  >
                    <Share2 className="h-4 w-4 mr-2" /> Compartilhar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Seção de pets para adoção */}
        <div className="mt-12">
          <EventList 
            title="Eventos desta ONG" 
            viewAllLink="/ver-eventos" 
            limit={4}
            organizationId={organization.id} 
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default OrgDetail;
