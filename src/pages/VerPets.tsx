
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PetCard, { PetCardProps } from '@/components/PetCard';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const VerPets = () => {
  const [pets, setPets] = useState<PetCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'todos' | 'adocao' | 'perdido' | 'encontrado' | 'avistado'>('todos');

  useEffect(() => {
    const fetchPets = async () => {
      setIsLoading(true);
      try {
        let query = supabase.from('pets').select('*');
        
        if (filter !== 'todos') {
          query = query.eq('status', filter);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
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
        console.error('Erro ao carregar pets:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPets();
  }, [filter]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-[#5D23BE] uppercase mb-2">Todos os Pets</h1>
            <p className="text-lg text-gray-600 mb-8">Encontre o pet ideal para você</p>
            
            <div className="mb-8 w-full md:w-1/3">
              <Label htmlFor="statusFilter" className="mb-2 block">Filtrar por status</Label>
              <Select 
                value={filter}
                onValueChange={(value: 'todos' | 'adocao' | 'perdido' | 'encontrado' | 'avistado') => setFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="adocao">Para Adoção</SelectItem>
                  <SelectItem value="perdido">Perdidos</SelectItem>
                  <SelectItem value="encontrado">Encontrados</SelectItem>
                  <SelectItem value="avistado">Avistados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array(8).fill(0).map((_, index) => (
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
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum pet encontrado com os critérios selecionados.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default VerPets;
