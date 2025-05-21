import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventList from '@/components/EventList';
import PetList from '@/components/PetList';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Mail, Phone, Globe, Instagram, Facebook, Users, ArrowLeft, Eye, Share2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { share } from '@/utils/shareUtils';

interface Organization {
  id: string;
  name: string;
  description: string;
  location: string;
  main_image_url?: string;
  email: string;
  whatsapp: string;
  website?: string;
  action_area: string;
  type: string;
  views: number;
  social_media: Record<string, string>;
  user_id: string;
  created_at: string;
  updated_at: string;
}

const OrgDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        if (!id) {
          setNotFound(true);
          return;
        }

        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Erro ao buscar ONG:', error);
          setNotFound(true);
          return;
        }

        if (data) {
          // Convert social_media JSON to record type
          let socialMedia: Record<string, string> = {};
          if (data.social_media) {
            try {
              if (typeof data.social_media === 'string') {
                socialMedia = JSON.parse(data.social_media);
              } else if (typeof data.social_media === 'object') {
                // Try to convert to Record<string, string>
                Object.entries(data.social_media).forEach(([key, value]) => {
                  if (typeof value === 'string') {
                    socialMedia[key] = value;
                  }
                });
              }
            } catch (e) {
              console.error('Error parsing social media:', e);
              // Default to empty object if parsing fails
            }
          }

          setOrganization({
            ...data,
            social_media: socialMedia
          });

          // Increment view count
          await supabase
            .from('organizations')
            .update({ views: (data.views || 0) + 1 })
            .eq('id', id);
        }
      } catch (error) {
        console.error('Erro ao buscar ONG:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-pet-softGray py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Main Content */}
              <div className="md:col-span-1">
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="mb-4">
                    <Skeleton className="h-12 w-3/4 rounded-md" />
                  </div>
                  <Skeleton className="h-48 w-full rounded-md mb-4" />
                  <Skeleton className="h-6 w-full rounded-md mb-2" />
                  <Skeleton className="h-6 w-5/6 rounded-md mb-2" />
                  <Skeleton className="h-6 w-1/2 rounded-md mb-4" />
                  <div className="flex space-x-4">
                    <Skeleton className="h-10 w-20 rounded-md" />
                    <Skeleton className="h-10 w-20 rounded-md" />
                  </div>
                </div>
              </div>
              {/* Sidebar */}
              <div className="md:col-span-1">
                <div className="bg-white shadow rounded-lg p-6">
                  <Skeleton className="h-10 w-1/2 rounded-md mb-4" />
                  <Skeleton className="h-8 w-full rounded-md mb-2" />
                  <Skeleton className="h-8 w-full rounded-md mb-2" />
                  <Skeleton className="h-8 w-full rounded-md mb-2" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-pet-softGray py-12">
          <div className="container mx-auto px-4">
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">ONG não encontrada</h2>
              <p className="text-gray-600">A ONG que você está procurando não existe ou foi removida.</p>
              <Link to="/ongs" className="text-pet-purple hover:underline block mt-4">
                Voltar para a lista de ONGs
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!organization) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-pet-softGray py-12">
        <div className="container mx-auto px-4">
          <Link to="/ongs" className="inline-flex items-center mb-4 text-pet-purple hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a lista de ONGs
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                {/* Organization Image */}
                <div className="relative h-64">
                  <img
                    src={organization.main_image_url || 'https://via.placeholder.com/600x400?text=ONG'}
                    alt={organization.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/600x400?text=ONG';
                    }}
                  />
                </div>

                <div className="p-6">
                  {/* Organization Name */}
                  <h1 className="text-3xl font-bold text-pet-darkPurple mb-2">{organization.name}</h1>

                  {/* Organization Description */}
                  <p className="text-gray-700 mb-4">{organization.description}</p>

                  {/* Action Area and Type */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-block bg-pet-purple/10 text-pet-purple px-3 py-1 rounded-full text-sm font-medium">
                      Área: {organization.action_area}
                    </span>
                    <span className="inline-block bg-pet-purple/10 text-pet-purple px-3 py-1 rounded-full text-sm font-medium">
                      Tipo: {organization.type}
                    </span>
                  </div>

                  {/* Contact Information */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Informações de Contato</h3>
                    <div className="flex items-center text-gray-600 mb-1">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>{organization.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Mail className="mr-2 h-4 w-4" />
                      <a href={`mailto:${organization.email}`} className="hover:underline">
                        {organization.email}
                      </a>
                    </div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Phone className="mr-2 h-4 w-4" />
                      <span>{organization.whatsapp}</span>
                    </div>
                    {organization.website && (
                      <div className="flex items-center text-gray-600 mb-1">
                        <Globe className="mr-2 h-4 w-4" />
                        <a href={organization.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {organization.website}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Social Media Links */}
                  {organization.social_media && Object.keys(organization.social_media).length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">Redes Sociais</h3>
                      <div className="flex space-x-4">
                        {organization.social_media.instagram && (
                          <a href={organization.social_media.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pet-purple">
                            <Instagram className="h-6 w-6" />
                          </a>
                        )}
                        {organization.social_media.facebook && (
                          <a href={organization.social_media.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pet-purple">
                            <Facebook className="h-6 w-6" />
                          </a>
                        )}
                        {/* Add more social media icons as needed */}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-500">
                      <Eye className="mr-1 h-4 w-4" />
                      <span>{organization.views} visualizações</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline">
                        <Share2 className="mr-2 h-4 w-4" />
                        Compartilhar
                      </Button>
                      <Button>
                        <Users className="mr-2 h-4 w-4" />
                        Apoiar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              {/* Contact Section */}
              <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Entre em Contato</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <Mail className="mr-2 h-4 w-4" />
                  <a href={`mailto:${organization.email}`} className="hover:underline">
                    {organization.email}
                  </a>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Phone className="mr-2 h-4 w-4" />
                  <span>{organization.whatsapp}</span>
                </div>
                {organization.website && (
                  <div className="flex items-center text-gray-600">
                    <Globe className="mr-2 h-4 w-4" />
                    <a href={organization.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {organization.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Pet List */}
              <PetList title="Pets desta ONG" viewAllLink="/pets" limit={3} organizationId={organization.id} />
            </div>
          </div>

          {organization && (
            <EventList
              title="Eventos desta ONG"
              viewAllLink="/eventos"
              limit={4}
              organizationId={organization.id}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrgDetail;
