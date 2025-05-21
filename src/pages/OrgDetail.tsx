
// Fix the TypeScript errors in the OrgDetail.tsx file
// The main issues are related to property names and EventList props

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventList from '@/components/EventList';
import { Instagram, Facebook, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Organization {
  id: string;
  name: string;
  type: string;
  action_area: string;
  description: string;
  whatsapp: string;
  email: string;
  website?: string;
  location: string;
  main_image_url?: string;
  social_media?: {
    instagram?: string;
    facebook?: string;
  };
  views: number;
}

const OrgDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchOrgDetail = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          setNotFound(true);
          throw error;
        }

        if (data) {
          setOrg(data);

          // Increment view count
          try {
            await supabase.rpc('increment_views', { 
              table_name: 'organizations',
              row_id: id 
            });
          } catch (error) {
            console.error('Error incrementing views:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching organization details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrgDetail();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (notFound || !org) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">ONG não encontrada</h1>
          <p className="text-gray-600 mb-8">
            Não foi possível encontrar a ONG solicitada. Talvez ela tenha sido removida
            ou o link está incorreto.
          </p>
          <Button
            onClick={() => window.history.back()}
            className="bg-pet-purple hover:bg-pet-lightPurple"
          >
            Voltar
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  const getOrgTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'ong': 'ONG',
      'abrigo': 'Abrigo',
      'protetor': 'Protetor Independente',
      'voluntario': 'Voluntário'
    };
    return types[type] || type;
  };

  const getActionAreaLabel = (area: string) => {
    const areas: Record<string, string> = {
      'resgate': 'Resgate',
      'adocao': 'Adoção',
      'saude': 'Saúde',
      'alimentacao': 'Alimentação',
      'castracao': 'Castração',
      'educacao': 'Educação',
      'multipla': 'Múltiplas áreas'
    };
    return areas[area] || area;
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* ONG Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-pet-darkPurple mb-2">{org.name}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-pet-softPurple text-pet-darkPurple text-sm px-3 py-1 rounded-full">
              {getOrgTypeLabel(org.type)}
            </span>
            <span className="bg-pet-softPurple text-pet-darkPurple text-sm px-3 py-1 rounded-full">
              {getActionAreaLabel(org.action_area)}
            </span>
          </div>
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Image and Description */}
          <div className="lg:col-span-2 space-y-6">
            {org.main_image_url && (
              <div className="rounded-lg overflow-hidden border">
                <img 
                  src={org.main_image_url} 
                  alt={org.name} 
                  className="w-full aspect-video object-cover"
                />
              </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4 text-pet-darkPurple">Sobre a ONG</h2>
              <p className="text-gray-700 whitespace-pre-line">{org.description}</p>
            </div>
          </div>

          {/* Right column - Contact and social info */}
          <div className="space-y-6">
            {/* Contact info */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4 text-pet-darkPurple">Contato</h2>
              <div className="space-y-4">
                {org.location && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-pet-purple mr-2 mt-0.5" />
                    <span>{org.location}</span>
                  </div>
                )}
                
                {org.whatsapp && (
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-pet-purple mr-2 mt-0.5" />
                    <a 
                      href={`https://wa.me/${org.whatsapp.replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-pet-purple"
                    >
                      {org.whatsapp}
                    </a>
                  </div>
                )}
                
                {org.email && (
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-pet-purple mr-2 mt-0.5" />
                    <a 
                      href={`mailto:${org.email}`}
                      className="hover:text-pet-purple break-all"
                    >
                      {org.email}
                    </a>
                  </div>
                )}
                
                {org.website && (
                  <div className="flex items-start">
                    <Globe className="h-5 w-5 text-pet-purple mr-2 mt-0.5" />
                    <a 
                      href={org.website.startsWith('http') ? org.website : `https://${org.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-pet-purple break-all"
                    >
                      {org.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Social media */}
            {org.social_media && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4 text-pet-darkPurple">Redes Sociais</h2>
                <div className="space-y-4">
                  {org.social_media.instagram && (
                    <a 
                      href={`https://instagram.com/${org.social_media.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-pet-purple"
                    >
                      <Instagram className="h-5 w-5 text-pet-purple mr-2" />
                      <span>{org.social_media.instagram}</span>
                    </a>
                  )}
                  
                  {org.social_media.facebook && (
                    <a 
                      href={`https://facebook.com/${org.social_media.facebook.replace('/', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-pet-purple"
                    >
                      <Facebook className="h-5 w-5 text-pet-purple mr-2" />
                      <span>{org.social_media.facebook}</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Events from this organization */}
        <div className="mt-12">
          <EventList
            title="Eventos desta ONG"
            viewAllLink="/ver-eventos"
            limit={4}
            organizationId={id}
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default OrgDetail;
