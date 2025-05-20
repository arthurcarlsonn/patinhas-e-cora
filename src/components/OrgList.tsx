
import React, { useEffect, useState } from 'react';
import OrgCard, { OrgCardProps } from './OrgCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface OrgListProps {
  title: string;
  organizations?: OrgCardProps[];
  viewAllLink: string;
  useMockData?: boolean;
  limit?: number;
  type?: string;
}

const OrgList = ({
  title,
  organizations: initialOrganizations,
  viewAllLink,
  useMockData = false,
  limit = 8,
  type
}: OrgListProps) => {
  const [organizations, setOrganizations] = useState<OrgCardProps[]>(initialOrganizations || []);
  const [isLoading, setIsLoading] = useState(!useMockData);

  useEffect(() => {
    if (useMockData && initialOrganizations) {
      setOrganizations(initialOrganizations);
      return;
    }

    const fetchOrganizations = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('organizations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (type) {
          query = query.eq('type', type);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Erro ao buscar organizações:', error);
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
            actionAreas: [org.action_area],
            contactInfo: {
              whatsapp: org.whatsapp,
              email: org.email,
              website: org.website || ''
            }
          }));

          setOrganizations(formattedOrgs);
        }
      } catch (error) {
        console.error('Erro ao buscar organizações:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, [useMockData, initialOrganizations, limit, type]);

  return (
    <section className="py-12 bg-[#7900ff]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold text-white uppercase">{title}</h2>
            <p className="text-sm md:text-base text-white/80">Encontre tudo o que seu pet precisa em um só lugar</p>
          </div>
          <Link to={viewAllLink}>
            <Button variant="purple" className="bg-white text-[#5D23BE] hover:bg-white/90">
              Ver tudo
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(limit).fill(0).map((_, index) => (
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
            {organizations.map(org => <OrgCard key={org.id} {...org} />)}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white">Nenhuma organização encontrada.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default OrgList;
