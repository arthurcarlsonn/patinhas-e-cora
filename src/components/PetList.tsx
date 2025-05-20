
import React, { useEffect, useState } from 'react';
import PetCard, { PetCardProps } from './PetCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface PetListProps {
  title: string;
  pets?: PetCardProps[];
  viewAllLink: string;
  useMockData?: boolean;
  limit?: number;
  status?: 'adocao' | 'perdido' | 'encontrado' | 'avistado' | 'all';
}

const PetList = ({ 
  title, 
  pets: initialPets, 
  viewAllLink, 
  useMockData = false,
  limit = 8,
  status = 'all'
}: PetListProps) => {
  const [pets, setPets] = useState<PetCardProps[]>(initialPets || []);
  const [isLoading, setIsLoading] = useState(!useMockData);

  useEffect(() => {
    if (useMockData && initialPets) {
      setPets(initialPets);
      return;
    }

    const fetchPets = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('pets')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (status !== 'all') {
          query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Erro ao buscar pets:', error);
          return;
        }

        if (data) {
          // Converter dados do banco para o formato do PetCard
          const formattedPets: PetCardProps[] = data.map(pet => ({
            id: pet.id,
            name: pet.name,
            type: pet.type,
            status: pet.status as 'perdido' | 'encontrado' | 'adocao',
            image: pet.main_image_url || `https://place-puppy.com/300x300`,
            location: pet.location,
            timeRegistered: new Date(pet.created_at).toLocaleDateString('pt-BR'),
            views: pet.views || 0,
            raca: pet.breed,
            idade: pet.age,
            genero: pet.gender as 'Macho' | 'Fêmea',
            porte: pet.size as 'Pequeno' | 'Médio' | 'Grande',
            cor: pet.color,
            temperamento: pet.temperament,
            castrado: pet.is_neutered,
            vacinasEmDia: pet.is_vaccinated,
            aceitaCriancas: pet.accepts_children,
            aceitaOutrosAnimais: pet.accepts_other_animals
          }));

          setPets(formattedPets);
        }
      } catch (error) {
        console.error('Erro ao buscar pets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPets();
  }, [useMockData, initialPets, limit, status]);

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
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : pets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pets.map((pet) => (
              <PetCard key={pet.id} {...pet} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum pet encontrado.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PetList;
