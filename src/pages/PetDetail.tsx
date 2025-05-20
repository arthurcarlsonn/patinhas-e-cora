
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import PetImage, { statusLabels } from '@/components/pet-detail/PetImage';
import PetDetails from '@/components/pet-detail/PetDetails';
import PetContact from '@/components/pet-detail/PetContact';
import OwnerActions from '@/components/pet-detail/OwnerActions';
import PetLoading from '@/components/pet-detail/PetLoading';

const PetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserOwner, setIsUserOwner] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        console.log("Fetching pet with ID:", id);
        
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error("Error fetching pet:", error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar as informações do pet",
            variant: "destructive",
          });
          throw error;
        }
        
        if (data) {
          console.log("Pet data found:", data);
          
          // Incrementar visualizações
          await supabase
            .from('pets')
            .update({ views: (data.views || 0) + 1 })
            .eq('id', id);
          
          setPet({
            id: data.id,
            name: data.name,
            type: data.type,
            status: data.status,
            image: data.main_image_url || `https://place-puppy.com/300x300`,
            location: data.location,
            timeRegistered: new Date(data.created_at).toLocaleDateString('pt-BR'),
            views: (data.views || 0) + 1, // Já incrementando localmente
            raca: data.breed,
            idade: data.age,
            genero: data.gender,
            porte: data.size,
            cor: data.color,
            temperamento: data.temperament,
            castrado: data.is_neutered,
            vacinasEmDia: data.is_vaccinated,
            aceitaCriancas: data.accepts_children,
            aceitaOutrosAnimais: data.accepts_other_animals,
            descricao: data.description,
            contactWhatsapp: data.contact_whatsapp,
            user_id: data.user_id,
          });

          // Check if current user is the owner of this pet
          if (user && data.user_id === user.id) {
            setIsUserOwner(true);
          }
        } else {
          console.log("No pet found with ID:", id);
          toast({
            title: "Pet não encontrado",
            description: "O pet que você está procurando não existe ou foi removido.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Erro ao buscar dados do pet:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPet();
  }, [id, toast, user]);

  // Handle loading and not found states
  const petLoading = (
    <PetLoading 
      isLoading={isLoading} 
      petExists={!!pet} 
      goBack={() => window.history.back()}
    />
  );

  if (isLoading || !pet) {
    return petLoading;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="md:flex">
              {/* Imagem */}
              <div className="md:w-1/2">
                <PetImage 
                  image={pet.image} 
                  name={pet.name} 
                  status={pet.status} 
                />
              </div>
              
              {/* Informações */}
              <div className="md:w-1/2 p-6">
                <PetDetails pet={pet} />
                
                {/* Owner Actions */}
                {isUserOwner && (
                  <OwnerActions petId={pet.id} userId={pet.user_id} />
                )}
                
                <div className="mt-8">
                  <PetContact 
                    contactWhatsapp={pet.contactWhatsapp} 
                    name={pet.name}
                    status={pet.status}
                    location={pet.location}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PetDetail;
