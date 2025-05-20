
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import ProfileTab from '@/components/dashboard/ProfileTab';
import PetsTab from '@/components/dashboard/PetsTab';
import FavoritesTab from '@/components/dashboard/FavoritesTab';

import { petsMock, productsMock, organizationsMock } from '@/data/mockData';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('perfil');
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulação de dados do usuário (em produção viria do backend)
  const [user, setUser] = useState({
    name: 'Usuário da Silva',
    email: 'usuario@email.com',
    phone: '(11) 98765-4321',
    avatar: 'https://github.com/shadcn.png',
    bio: 'Amante de animais e defensor da causa animal.',
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

  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    setFavorites({
      pets: storedFavorites.pets || [],
      products: storedFavorites.products || [],
      organizations: storedFavorites.organizations || [],
    });
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
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
                user={user} 
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
                    user={user}
                    setUser={setUser}
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
