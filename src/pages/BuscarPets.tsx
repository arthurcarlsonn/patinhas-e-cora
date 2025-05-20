
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

import { petsMock } from '@/data/mockData';

const BuscarPets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState('todos');
  
  const filterOptions = [
    { label: 'Perdidos', value: 'perdido' },
    { label: 'Encontrados', value: 'encontrado' },
    { label: 'Para adoção', value: 'adocao' },
    { label: 'Cachorros', value: 'cachorro' },
    { label: 'Gatos', value: 'gato' }
  ];

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const tabs = [
    { id: 'todos', label: 'Todos' },
    { id: 'perdido', label: 'Perdidos' },
    { id: 'encontrado', label: 'Encontrados' },
    { id: 'adocao', label: 'Para adoção' }
  ];

  // Filtragem dos pets com base nos critérios selecionados
  const filteredPets = petsMock.filter(pet => {
    // Filtragem por pesquisa de texto
    const matchesSearch = searchTerm === '' || 
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.location.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtragem por categoria (tab)
    const matchesTab = currentTab === 'todos' || pet.status === currentTab;

    // Filtragem por filtros ativos
    const matchesFilters = activeFilters.length === 0 || 
      (activeFilters.includes(pet.status) || activeFilters.includes(pet.type.toLowerCase()));

    return matchesSearch && matchesTab && matchesFilters;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-pet-purple text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Buscar Pets</h1>
            <p className="text-lg max-w-3xl mx-auto">
              Encontre pets perdidos ou esperando por um novo lar. Use os filtros para refinar sua busca.
            </p>
          </div>
        </section>

        {/* Barra de Pesquisa */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar pet por nome, tipo ou localização..."
                  className="pl-10 py-6 text-lg rounded-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Button 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-pet-purple hover:bg-pet-lightPurple rounded-full"
                  size="sm"
                >
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Filtros */}
        <section className="py-4 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap gap-2 justify-center">
                {filterOptions.map((filter) => (
                  <Badge 
                    key={filter.value}
                    variant={activeFilters.includes(filter.value) ? "default" : "outline"} 
                    className={`
                      cursor-pointer py-2 px-4 text-sm
                      ${activeFilters.includes(filter.value) 
                        ? 'bg-pet-purple hover:bg-pet-lightPurple' 
                        : 'border-pet-purple text-pet-purple hover:bg-pet-purple hover:text-white'}
                    `}
                    onClick={() => toggleFilter(filter.value)}
                  >
                    {filter.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Abas e Lista de Pets */}
        <section className="py-8 bg-pet-softGray">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <Tabs defaultValue="todos" onValueChange={setCurrentTab} className="space-y-8">
                <div className="flex justify-center">
                  <TabsList className="bg-white">
                    {tabs.map(tab => (
                      <TabsTrigger 
                        key={tab.id} 
                        value={tab.id}
                        className="data-[state=active]:bg-pet-purple data-[state=active]:text-white"
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                
                {tabs.map(tab => (
                  <TabsContent key={tab.id} value={tab.id} className="p-0 border-none">
                    {filteredPets.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredPets.map((pet) => (
                          <Card key={pet.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all">
                            <div className="aspect-square relative">
                              <img 
                                src={pet.image} 
                                alt={pet.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "https://via.placeholder.com/300x300?text=Pet";
                                }}
                              />
                              <Badge 
                                className={`absolute top-2 right-2 
                                  ${pet.status === 'perdido' ? 'bg-red-500' : 
                                    pet.status === 'encontrado' ? 'bg-yellow-500' : 
                                    'bg-green-500'}`}
                              >
                                {pet.status === 'perdido' ? 'Perdido' : 
                                  pet.status === 'encontrado' ? 'Encontrado' : 'Para Adoção'}
                              </Badge>
                            </div>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-pet-darkPurple">{pet.name}</h3>
                                <Badge variant="outline" className="border-pet-purple text-pet-purple">
                                  {pet.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 mb-2">{pet.location}</p>
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>{pet.timeRegistered}</span>
                                <span>{pet.views} visualizações</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <p className="text-lg text-gray-500">Nenhum pet encontrado com esses critérios.</p>
                        <Button 
                          variant="link" 
                          className="text-pet-purple mt-2"
                          onClick={() => {
                            setSearchTerm('');
                            setActiveFilters([]);
                            setCurrentTab('todos');
                          }}
                        >
                          Limpar filtros
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BuscarPets;
