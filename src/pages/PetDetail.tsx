import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Clock, Eye, Phone, Mail, Share2, Ruler, PawPrint, ShieldCheck, Baby, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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
          });
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
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pet-purple mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando informações do pet...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Pet não encontrado</h1>
            <p className="mt-2 text-gray-600">O pet que você está procurando não existe ou foi removido.</p>
            <Button className="mt-4" variant="purple" onClick={() => window.history.back()}>Voltar</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const statusColors = {
    perdido: 'bg-red-100 text-red-800 border-red-200',
    encontrado: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    adocao: 'bg-green-100 text-green-800 border-green-200',
  };
  
  const statusLabels = {
    perdido: 'Perdido',
    encontrado: 'Encontrado',
    adocao: 'Para Adoção',
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="md:flex">
              {/* Imagem */}
              <div className="md:w-1/2">
                <div className="h-64 md:h-full bg-gray-300 relative">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/600x400?text=${pet.name}`;
                    }}
                  />
                  <Badge 
                    className={`absolute top-4 right-4 ${statusColors[pet.status as keyof typeof statusColors]} border`}
                  >
                    {statusLabels[pet.status as keyof typeof statusLabels]}
                  </Badge>
                </div>
              </div>
              
              {/* Informações */}
              <div className="md:w-1/2 p-6">
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold text-gray-800">{pet.name}</h1>
                  <Badge variant="outline">{pet.type}</Badge>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={18} className="mr-2" />
                    <span>{pet.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Clock size={18} className="mr-2" />
                    <span>{pet.timeRegistered}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Eye size={18} className="mr-2" />
                    <span>{pet.views} visualizações</span>
                  </div>
                </div>
                
                {/* Detalhes do Pet */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {pet.raca && (
                    <div className="flex items-center text-gray-700">
                      <PawPrint size={16} className="mr-2 text-pet-purple" />
                      <span>Raça: {pet.raca}</span>
                    </div>
                  )}
                  {pet.idade && (
                    <div className="flex items-center text-gray-700">
                      <Clock size={16} className="mr-2 text-pet-purple" />
                      <span>Idade: {pet.idade}</span>
                    </div>
                  )}
                  {pet.genero && (
                    <div className="flex items-center text-gray-700">
                      {pet.genero === 'Macho' ? (
                        <div className="flex items-center">
                          <span className="mr-2 text-blue-500 text-lg">♂</span>
                          <span>Macho</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="mr-2 text-pink-500 text-lg">♀</span>
                          <span>Fêmea</span>
                        </div>
                      )}
                    </div>
                  )}
                  {pet.porte && (
                    <div className="flex items-center text-gray-700">
                      <Ruler size={16} className="mr-2 text-pet-purple" />
                      <span>Porte: {pet.porte}</span>
                    </div>
                  )}
                </div>
                
                {/* Status extras */}
                {pet.status === 'adocao' && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant={pet.castrado ? "default" : "outline"} className={pet.castrado ? "bg-green-100 text-green-800 border-green-200" : ""}>
                      {pet.castrado ? "Castrado" : "Não castrado"}
                    </Badge>
                    <Badge variant={pet.vacinasEmDia ? "default" : "outline"} className={pet.vacinasEmDia ? "bg-green-100 text-green-800 border-green-200" : ""}>
                      {pet.vacinasEmDia ? "Vacinas em dia" : "Vacinas pendentes"}
                    </Badge>
                    <Badge variant={pet.aceitaCriancas ? "default" : "outline"} className={pet.aceitaCriancas ? "bg-blue-100 text-blue-800 border-blue-200" : ""}>
                      <Baby size={14} className="mr-1" />
                      {pet.aceitaCriancas ? "Aceita crianças" : "Não aceita crianças"}
                    </Badge>
                    <Badge variant={pet.aceitaOutrosAnimais ? "default" : "outline"} className={pet.aceitaOutrosAnimais ? "bg-blue-100 text-blue-800 border-blue-200" : ""}>
                      <Users size={14} className="mr-1" />
                      {pet.aceitaOutrosAnimais ? "Aceita outros animais" : "Não aceita outros animais"}
                    </Badge>
                  </div>
                )}
                
                {/* Data desaparecimento para pets perdidos */}
                {pet.status === 'perdido' && (
                  <div className="mt-4 p-3 bg-red-50 rounded-md border border-red-200">
                    <p className="text-sm text-red-700 font-medium">
                      <Clock size={14} className="inline-block mr-1" />
                      Desaparecido desde: {pet.timeRegistered}
                    </p>
                  </div>
                )}
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-2">Descrição</h2>
                  <p className="text-gray-600">
                    {pet.descricao || "Sem descrição disponível."}
                  </p>
                </div>

                {/* Temperamento para adoção */}
                {pet.status === 'adocao' && pet.temperamento && (
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-800">Temperamento</h3>
                    <p className="text-gray-600">{pet.temperamento}</p>
                  </div>
                )}
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Contato</h2>
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="https://github.com/shadcn.png" alt="Usuário" />
                      <AvatarFallback>UN</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <p className="font-medium text-gray-800">Cadastrado por</p>
                      <div className="flex flex-col sm:flex-row sm:space-x-4 text-sm text-gray-600">
                        {pet.contactWhatsapp && (
                          <div className="flex items-center">
                            <Phone size={14} className="mr-1" />
                            <span>{pet.contactWhatsapp}</span>
                          </div>
                        )}
                        <div className="flex items-center mt-1 sm:mt-0">
                          <Mail size={14} className="mr-1" />
                          <span>Contato via site</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex flex-wrap gap-3">
                  {pet.contactWhatsapp && (
                    <Button 
                      variant="purple"
                      onClick={() => window.open(`https://wa.me/${pet.contactWhatsapp.replace(/\D/g, '')}`, '_blank')}
                    >
                      Contatar via WhatsApp
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="flex items-center"
                    onClick={() => {
                      const url = window.location.href;
                      const text = `${statusLabels[pet.status as keyof typeof statusLabels]}: ${pet.name} - ${pet.type}`;
                      navigator.share?.({
                        title: text,
                        text: `${text} em ${pet.location}`,
                        url: url,
                      }).catch(console.error);
                    }}
                  >
                    <Share2 size={16} className="mr-2" />
                    Compartilhar
                  </Button>
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
