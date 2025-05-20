
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrgCard from '@/components/OrgCard';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { OrgCardProps } from '@/components/OrgCard';

const VerONGs = () => {
  const [organizations, setOrganizations] = useState<OrgCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar ONGs:', error);
          return;
        }

        if (data) {
          // Converter dados do banco para o formato do OrgCard
          const formattedOrgs: OrgCardProps[] = data.map(org => ({
            id: org.id,
            name: org.name,
            image: org.main_image_url || `https://via.placeholder.com/300x200?text=ONG`,
            location: org.location,
            type: org.type,
            category: org.action_area,
            actionAreas: [org.action_area],
            views: org.views || 0,
            contactInfo: {
              whatsapp: org.whatsapp,
              email: org.email,
              website: org.website || ''
            }
          }));

          setOrganizations(formattedOrgs);
        }
      } catch (error) {
        console.error('Erro ao buscar ONGs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="py-12 bg-[#7900ff]">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white uppercase mb-2">Todas as ONGs</h1>
            <p className="text-lg text-white/80 mb-8">Conheça ONGs e grupos de voluntários</p>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array(8).fill(0).map((_, index) => (
                  <div key={index} className="rounded-lg overflow-hidden border border-white/20 bg-white/10">
                    <Skeleton className="h-48 w-full bg-white/20" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-6 w-3/4 bg-white/20" />
                      <Skeleton className="h-4 w-1/2 bg-white/20" />
                      <Skeleton className="h-4 w-1/2 bg-white/20" />
                      <Skeleton className="h-4 w-full bg-white/20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : organizations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {organizations.map((org) => (
                  <OrgCard key={org.id} {...org} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-white">Nenhuma ONG encontrada. Cadastre a primeira!</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default VerONGs;
