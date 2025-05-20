
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Edit, Eye, Trash2, Settings, Plus, Heart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

import { petsMock, productsMock, organizationsMock } from '@/data/mockData';

const Dashboard = () => {
  const navigate = useNavigate();
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

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Em produção, aqui seria feito o envio dos dados para o backend
    alert('Perfil atualizado com sucesso!');
  };

  const handleDeletePet = (petId: string) => {
    // Em produção, aqui seria feito o envio da requisição de exclusão para o backend
    alert(`Pet ${petId} deletado com sucesso!`);
  };

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
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                
                <nav className="space-y-2">
                  <Button 
                    variant={activeTab === 'perfil' ? 'purple' : 'outline'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('perfil')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Meu Perfil
                  </Button>
                  <Button 
                    variant={activeTab === 'pets' ? 'purple' : 'outline'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('pets')}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Meus Pets
                  </Button>
                  <Button 
                    variant={activeTab === 'favoritos' ? 'purple' : 'outline'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('favoritos')}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Meus Favoritos
                  </Button>
                </nav>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:w-3/4">
              <div className="bg-white p-6 rounded-lg shadow">
                {activeTab === 'perfil' && (
                  <div>
                    <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
                    {isLoading ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="h-16 w-16 rounded-full" />
                          <Skeleton className="h-8 w-24" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-10 w-32" />
                      </div>
                    ) : (
                      <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="avatar">Foto de Perfil</Label>
                            <div className="mt-2 flex items-center space-x-4">
                              <Avatar className="w-16 h-16">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <Button type="button" variant="outline" size="sm">
                                Alterar foto
                              </Button>
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="name">Nome</Label>
                            <Input 
                              id="name" 
                              value={user.name} 
                              onChange={(e) => setUser({...user, name: e.target.value})} 
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="email">E-mail</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              value={user.email} 
                              onChange={(e) => setUser({...user, email: e.target.value})} 
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="phone">Telefone</Label>
                            <Input 
                              id="phone" 
                              value={user.phone} 
                              onChange={(e) => setUser({...user, phone: e.target.value})} 
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="bio">Sobre mim</Label>
                            <Textarea 
                              id="bio" 
                              rows={4} 
                              value={user.bio} 
                              onChange={(e) => setUser({...user, bio: e.target.value})} 
                            />
                          </div>
                        </div>
                        
                        <Button type="submit" variant="purple">
                          Salvar Alterações
                        </Button>
                      </form>
                    )}
                  </div>
                )}
                
                {activeTab === 'pets' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h1 className="text-2xl font-bold">Meus Pets</h1>
                      <Button 
                        variant="purple" 
                        onClick={() => navigate('/cadastrar-pet')}
                        className="flex items-center"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Cadastrar Pet
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                          <Card key={i}>
                            <div className="flex p-4">
                              <Skeleton className="w-24 h-24 sm:w-36 sm:h-36" />
                              <div className="flex-1 ml-4 space-y-2">
                                <Skeleton className="h-6 w-1/3" />
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-4 w-1/5" />
                                <Skeleton className="h-8 w-full mt-4" />
                              </div>
                            </div>
                          </Card>
                        ))
                      ) : userPets.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500 mb-4">Você ainda não cadastrou nenhum pet.</p>
                          <Button 
                            variant="purple" 
                            onClick={() => navigate('/cadastrar-pet')}
                          >
                            Cadastrar meu primeiro pet
                          </Button>
                        </div>
                      ) : (
                        userPets.map(pet => (
                          <Card key={pet.id} className="overflow-hidden">
                            <div className="flex">
                              <div className="w-24 h-24 sm:w-36 sm:h-36">
                                <img 
                                  src={pet.image} 
                                  alt={pet.name} 
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = `https://via.placeholder.com/300x200?text=${pet.name}`;
                                  }}
                                />
                              </div>
                              <CardContent className="flex-1 p-4">
                                <div className="flex justify-between">
                                  <div>
                                    <h3 className="text-lg font-medium">{pet.name}</h3>
                                    <p className="text-sm text-gray-500">{pet.type}</p>
                                    <div className="mt-1 flex items-center text-sm text-gray-500">
                                      <Eye size={14} className="mr-1" />
                                      <span>{pet.views} visualizações</span>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => navigate(`/pet/${pet.id}/edit`)}
                                      className="flex items-center"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                      onClick={() => handleDeletePet(pet.id)}
                                      className="flex items-center"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="mt-4">
                                  <Link to={`/pet/${pet.id}`}>
                                    <Button variant="outline" size="sm" className="w-full">
                                      Ver Detalhes
                                    </Button>
                                  </Link>
                                </div>
                              </CardContent>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'favoritos' && (
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
