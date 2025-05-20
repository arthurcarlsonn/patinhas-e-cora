
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

import { petsMock, productsMock, organizationsMock } from '@/data/mockData';

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

    // Carregar favoritos do localStorage (em produção viria do Supabase)
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    setFavorites({
      pets: storedFavorites.pets || [],
      products: storedFavorites.products || [],
      organizations: storedFavorites.organizations || [],
    });
    
    fetchProfile();
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
  const userPets = petsMock.slice(0, 3); // Simulando que os 3 primeiros pets são do usuário
  const favoritePets = petsMock.filter(pet => favorites.pets?.includes(pet.id));
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
