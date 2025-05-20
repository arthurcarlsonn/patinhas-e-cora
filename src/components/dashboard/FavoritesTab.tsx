
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2 } from 'lucide-react';

interface Pet {
  id: string;
  name: string;
  type: string;
  image: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
}

interface Organization {
  id: string;
  name: string;
  category: string;
  image: string;
}

interface FavoritesTabProps {
  isLoading: boolean;
  favoritePets: Pet[];
  favoriteProducts: Product[];
  favoriteOrgs: Organization[];
  handleRemoveFavorite: (type: 'pets' | 'products' | 'organizations', id: string) => void;
}

const FavoritesTab = ({ 
  isLoading, 
  favoritePets, 
  favoriteProducts, 
  favoriteOrgs, 
  handleRemoveFavorite 
}: FavoritesTabProps) => {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Meus Favoritos</h1>
      
      {isLoading ? (
        <div className="space-y-6">
          {Array(3).fill(0).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-6 w-1/4 mb-2" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <div className="flex p-4">
                    <Skeleton className="w-20 h-20" />
                    <div className="ml-4 space-y-2 flex-1">
                      <Skeleton className="h-5 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                      <div className="flex justify-between">
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                </Card>
                <Card>
                  <div className="flex p-4">
                    <Skeleton className="w-20 h-20" />
                    <div className="ml-4 space-y-2 flex-1">
                      <Skeleton className="h-5 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                      <div className="flex justify-between">
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Tabs defaultValue="pets" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pets">Pets</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="orgs">ONGs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pets" className="mt-6">
            {favoritePets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Você ainda não adicionou nenhum pet aos favoritos.</p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/pets')}
                  className="mt-4"
                >
                  Explorar Pets
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {favoritePets.map(pet => (
                  <Card key={pet.id} className="overflow-hidden">
                    <div className="p-4">
                      <div className="flex">
                        <div className="w-20 h-20">
                          <img 
                            src={pet.image} 
                            alt={pet.name} 
                            className="w-full h-full object-cover rounded"
                            loading="lazy"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium">{pet.name}</h3>
                          <p className="text-sm text-gray-500">{pet.type}</p>
                          <div className="mt-2 flex justify-between">
                            <Link to={`/pet/${pet.id}`}>
                              <Button variant="outline" size="sm">Ver Detalhes</Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveFavorite('pets', pet.id)}
                            >
                              <Trash2 size={16} className="text-gray-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="products" className="mt-6">
            {favoriteProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Você ainda não adicionou nenhum produto aos favoritos.</p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/produtos')}
                  className="mt-4"
                >
                  Explorar Produtos
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {favoriteProducts.map(product => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="p-4">
                      <div className="flex">
                        <div className="w-20 h-20">
                          <img 
                            src={product.image} 
                            alt={product.title} 
                            className="w-full h-full object-cover rounded"
                            loading="lazy"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium">{product.title}</h3>
                          <p className="text-sm text-gray-500">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(product.price)}
                          </p>
                          <div className="mt-2 flex justify-between">
                            <Link to={`/produto/${product.id}`}>
                              <Button variant="outline" size="sm">Ver Detalhes</Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveFavorite('products', product.id)}
                            >
                              <Trash2 size={16} className="text-gray-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="orgs" className="mt-6">
            {favoriteOrgs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Você ainda não adicionou nenhuma ONG aos favoritos.</p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/ongs')}
                  className="mt-4"
                >
                  Explorar ONGs
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {favoriteOrgs.map(org => (
                  <Card key={org.id} className="overflow-hidden">
                    <div className="p-4">
                      <div className="flex">
                        <div className="w-20 h-20">
                          <img 
                            src={org.image} 
                            alt={org.name} 
                            className="w-full h-full object-cover rounded"
                            loading="lazy"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium">{org.name}</h3>
                          <p className="text-sm text-gray-500">{org.category}</p>
                          <div className="mt-2 flex justify-between">
                            <Link to={`/ong/${org.id}`}>
                              <Button variant="outline" size="sm">Ver Detalhes</Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveFavorite('organizations', org.id)}
                            >
                              <Trash2 size={16} className="text-gray-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default FavoritesTab;
