
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2 } from 'lucide-react';
import PetCard, { PetCardProps } from '@/components/PetCard';
import { supabase } from '@/integrations/supabase/client';
import { useLocation, useNavigate } from 'react-router-dom';

const BuscarPets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState('todos');
  const [pets, setPets] = useState<PetCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [filteredPets, setFilteredPets] = useState<PetCardProps[]>([]);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const filterOptions = [
    { label: 'Perdidos', value: 'perdido' },
    { label: 'Encontrados', value: 'encontrado' },
    { label: 'Para adoção', value: 'adocao' },
    { label: 'Avistados', value: 'avistado' },
    { label: 'Cachorros', value: 'Cachorro' },
    { label: 'Gatos', value: 'Gato' },
    { label: 'Pequeno', value: 'Pequeno' },
    { label: 'Médio', value: 'Médio' },
    { label: 'Grande', value: 'Grande' },
    { label: 'Macho', value: 'Macho' },
    { label: 'Fêmea', value: 'Fêmea' },
  ];

  const tabs = [
    { id: 'todos', label: 'Todos' },
    { id: 'perdido', label: 'Perdidos' },
    { id: 'encontrado', label: 'Encontrados' },
    { id: 'adocao', label: 'Para adoção' },
    { id: 'avistado', label: 'Avistados' },
  ];

  // Parse query parameters when the page loads
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    const status = params.get('status') || '';
    const type = params.get('type') || '';
    
    setSearchTerm(query);
    
    // Set active filters based on URL params
    const newFilters: string[] = [];
    if (status) newFilters.push(status);
    if (type) newFilters.push(type);
    setActiveFilters(newFilters);
    
    // Set current tab based on status
    if (status && tabs.some(tab => tab.id === status)) {
      setCurrentTab(status);
    }
  }, [location.search]);

  // Fetch pets from Supabase
  useEffect(() => {
    const fetchPets = async () => {
      setIsLoading(true);
      try {
        // Buscar todos os pets
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar pets:', error);
          return;
        }

        if (data) {
          // Calcular o total de pets
          setTotalCount(data.length);

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
        console.error('Erro ao buscar pets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPets();
  }, []);

  // Apply filters whenever pets, searchTerm, activeFilters, or currentTab change
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...pets];
      
      // Filter by text search
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(pet => 
          pet.name.toLowerCase().includes(term) ||
          pet.type.toLowerCase().includes(term) ||
          pet.location.toLowerCase().includes(term) ||
          (pet.raca && pet.raca.toLowerCase().includes(term)) ||
          (pet.cor && pet.cor.toLowerCase().includes(term))
        );
      }
      
      // Filter by tab (status)
      if (currentTab !== 'todos') {
        filtered = filtered.filter(pet => pet.status === currentTab);
      }
      
      // Apply active filters (tags)
      if (activeFilters.length > 0) {
        filtered = filtered.filter(pet => {
          // Check if any active filter matches any pet property
          return activeFilters.some(filter => 
            pet.status === filter || 
            pet.type === filter ||
            pet.porte === filter ||
            pet.genero === filter
          );
        });
      }

      setFilteredPets(filtered);
    };
    
    applyFilters();
  }, [pets, searchTerm, activeFilters, currentTab]);

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
    
    // Update URL with new filters
    updateURL();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search term
    updateURL();
  };
  
  const updateURL = () => {
    const params = new URLSearchParams();
    
    if (searchTerm) {
      params.append('q', searchTerm);
    }
    
    // Add status from currentTab if not 'todos'
    if (currentTab !== 'todos') {
      params.append('status', currentTab);
    }
    
    // Add type filters
    const typeFilters = activeFilters.filter(f => f === 'Cachorro' || f === 'Gato');
    if (typeFilters.length > 0) {
      params.append('type', typeFilters[0]); // We only support one type filter at a time
    }
    
    navigate(`/buscar-pets?${params.toString()}`);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setActiveFilters([]);
    setCurrentTab('todos');
    navigate('/buscar-pets');
  };

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
            <p className="text-lg mt-2">
              <span className="font-bold">{totalCount}</span> pets cadastrados
            </p>
          </div>
        </section>

        {/* Barra de Pesquisa */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar pet por nome, tipo, raça, cor ou localização..."
                  className="pl-10 py-6 text-lg rounded-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pet-purple hover:bg-pet-lightPurple">
                  Buscar
                </Button>
              </div>
            </form>
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
              <Tabs value={currentTab} onValueChange={(value) => {
                setCurrentTab(value);
                // Update URL when changing tabs
                const params = new URLSearchParams(location.search);
                if (value !== 'todos') {
                  params.set('status', value);
                } else {
                  params.delete('status');
                }
                navigate(`/buscar-pets?${params.toString()}`);
              }} className="space-y-8">
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
                
                {isLoading ? (
                  <div className="flex justify-center items-center py-16">
                    <Loader2 className="h-12 w-12 animate-spin text-pet-purple" />
                    <span className="ml-2 text-xl text-gray-600">Carregando pets...</span>
                  </div>
                ) : (
                  tabs.map(tab => (
                    <TabsContent key={tab.id} value={tab.id} className="p-0 border-none">
                      {filteredPets.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                          {filteredPets.map((pet) => (
                            <PetCard key={pet.id} {...pet} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-16">
                          <p className="text-lg text-gray-500">Nenhum pet encontrado com esses critérios.</p>
                          <Button 
                            variant="link" 
                            className="text-pet-purple mt-2"
                            onClick={clearFilters}
                          >
                            Limpar filtros
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                  ))
                )}
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
