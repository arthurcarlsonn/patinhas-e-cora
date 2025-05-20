
import React, { useState, useEffect } from 'react';
import ClinicCard, { ClinicCardProps } from './ClinicCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface ClinicListProps {
  title: string;
  viewAllLink: string;
  limit?: number;
}

const ClinicList = ({ title, viewAllLink, limit = 4 }: ClinicListProps) => {
  const [clinics, setClinics] = useState<ClinicCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('clinics')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) {
          console.error('Erro ao buscar clínicas:', error);
          return;
        }

        if (data) {
          // Converter os dados do banco para o formato ClinicCard
          const formattedClinics: ClinicCardProps[] = data.map(clinic => ({
            id: clinic.id,
            name: clinic.name,
            image: clinic.main_image_url || `https://via.placeholder.com/300x200?text=Clínica`,
            location: clinic.location,
            category: clinic.category,
            views: clinic.views || 0
          }));

          setClinics(formattedClinics);
        }
      } catch (error) {
        console.error('Erro ao buscar clínicas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClinics();
  }, [limit]);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold text-[#5D23BE] uppercase">{title}</h2>
            <p className="text-sm md:text-base text-gray-600">Encontre tudo o que seu pet precisa em um só lugar</p>
          </div>
          <Link to={viewAllLink}>
            <Button variant="purple">
              Ver tudo
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(limit).fill(0).map((_, index) => (
              <div key={index} className="rounded-lg overflow-hidden border border-gray-200">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : clinics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {clinics.map((clinic) => (
              <ClinicCard key={clinic.id} {...clinic} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma clínica encontrada.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ClinicList;
