
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import ProfileTab from '@/components/dashboard/ProfileTab';
import PetsTab from '@/components/dashboard/PetsTab';
import FavoritesTab from '@/components/dashboard/FavoritesTab';
import { useAuth } from '@/contexts/AuthContext';

// We'll only use mock data for favorites since we're not implementing that functionality yet
import { productsMock, organizationsMock } from '@/data/mockData';

const Dashboard = () => {
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('perfil');
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    bio: '',
  });
  
  const [userPets, setUserPets] = useState([]);
  
  const [favorites, setFavorites] = useState<{
    pets: string[];
    products: string[];
    organizations: string[];
  }>({
    pets: [],
    products: [],
    organizations: [],
  });

  // Verificar se o usuário está logado como usuário comum
  useEffect(() => {
    if (!user) {
      navigate('/entrar');
      return;
    }
    
    if (userType === 'company') {
      navigate('/empresa/dashboard');
      return;
    }
    
    // Carregar dados do perfil
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setProfile({
            name: data.name || '',
            email: data.email || user.email || '',
            phone: data.phone || '',
            avatar: data.avatar_url || 'https://github.com/shadcn.png',
            bio: data.bio || '',
          });
        }
      } catch (error: any) {
        console.error('Erro ao carregar perfil:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar seu perfil.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Buscar os pets do usuário
    const fetchUserPets = async () => {
      try {
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        if (data) {
          // Convertendo para o formato do PetCard
          const formattedPets = data.map(pet => ({
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
          
          setUserPets(formattedPets);
        }
      } catch (error) {
        console.error('Erro ao buscar pets do usuário:', error);
      }
    };

    // Carregar favoritos do localStorage (em produção viria do Supabase)
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    setFavorites({
      pets: storedFavorites.pets || [],
      products: storedFavorites.products || [],
      organizations: storedFavorites.organizations || [],
    });
    
    fetchProfile();
    fetchUserPets();
  }, [user, navigate, userType, toast]);
  
  // Atualizar perfil
  const updateProfile = async (updatedProfile: any) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updatedProfile.name,
          phone: updatedProfile.phone,
          bio: updatedProfile.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);
      
      if (error) throw error;
      
      setProfile(updatedProfile);
      toast({
        title: 'Sucesso',
        description: 'Seu perfil foi atualizado com sucesso!',
      });
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar seu perfil.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filtragem baseada em IDs salvos no localStorage
  const favoritePets = Array.isArray(favorites.pets) ? 
    userPets.filter(pet => favorites.pets?.includes(pet.id)) : [];
  const favoriteProducts = productsMock.filter(product => favorites.products?.includes(product.id));
  const favoriteOrgs = organizationsMock.filter(org => favorites.organizations?.includes(org.id));

  const handleRemoveFavorite = (type: 'pets' | 'products' | 'organizations', id: string) => {
    const newFavorites = {...favorites};
    newFavorites[type] = favorites[type].filter(itemId => itemId !== id);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <DashboardSidebar 
                user={profile} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
              />
            </div>
            
            {/* Main Content */}
            <div className="md:w-3/4">
              <div className="bg-white p-6 rounded-lg shadow">
                {activeTab === 'perfil' && (
                  <ProfileTab 
                    isLoading={isLoading}
                    user={profile}
                    setUser={updateProfile}
                  />
                )}
                
                {activeTab === 'pets' && (
                  <PetsTab 
                    isLoading={isLoading}
                    userPets={userPets}
                  />
                )}

                {activeTab === 'favoritos' && (
                  <FavoritesTab 
                    isLoading={isLoading}
                    favoritePets={favoritePets}
                    favoriteProducts={favoriteProducts}
                    favoriteOrgs={favoriteOrgs}
                    handleRemoveFavorite={handleRemoveFavorite}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
