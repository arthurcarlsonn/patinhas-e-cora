
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const Stats = () => {
  const [stats, setStats] = useState([
    { title: 'Pets Cadastrados', count: 0 },
    { title: 'Pets Encontrados', count: 0 },
    { title: 'Pets Adotados', count: 0 }
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPetStats = async () => {
      try {
        // Fetch total registered pets
        const { count: totalPets, error: totalError } = await supabase
          .from('pets')
          .select('*', { count: 'exact', head: true });
        
        if (totalError) throw totalError;

        // Fetch found pets
        const { count: foundPets, error: foundError } = await supabase
          .from('pets')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'encontrado');
        
        if (foundError) throw foundError;

        // Fetch pets for adoption
        const { count: adoptionPets, error: adoptionError } = await supabase
          .from('pets')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'adocao');
        
        if (adoptionError) throw adoptionError;

        setStats([
          { title: 'Pets Cadastrados', count: totalPets || 0 },
          { title: 'Pets Encontrados', count: foundPets || 0 },
          { title: 'Pets Adotados', count: adoptionPets || 0 }
        ]);
      } catch (error) {
        console.error('Error fetching pet statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPetStats();
  }, []);

  return (
    <section className="bg-pet-softGray py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-none shadow-md hover-scale">
              <CardContent className="flex flex-col items-center justify-center p-6">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 text-pet-purple animate-spin mb-2" />
                ) : (
                  <span className="text-4xl font-bold text-pet-purple mb-2">{stat.count}</span>
                )}
                <h3 className="text-xl font-medium text-gray-700">{stat.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
