
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const navigate = useNavigate();

  const filters = [
    'Perdidos',
    'Encontrados',
    'Para adoção',
    'Cachorros',
    'Gatos'
  ];

  const handleFilterClick = (filter: string) => {
    if (activeFilter === filter) {
      setActiveFilter('');
    } else {
      setActiveFilter(filter);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Map filters to their corresponding values in the database
    let status = '';
    let type = '';
    
    // Process active filter
    if (activeFilter === 'Perdidos') {
      status = 'perdido';
    } else if (activeFilter === 'Encontrados') {
      status = 'encontrado';
    } else if (activeFilter === 'Para adoção') {
      status = 'adocao';
    } else if (activeFilter === 'Cachorros') {
      type = 'Cachorro';
    } else if (activeFilter === 'Gatos') {
      type = 'Gato';
    }
    
    // Build query params
    const params = new URLSearchParams();
    if (searchTerm) {
      params.append('q', searchTerm);
    }
    if (status) {
      params.append('status', status);
    }
    if (type) {
      params.append('type', type);
    }
    
    const queryString = params.toString();
    
    // Check if we have any search parameters
    if (queryString) {
      navigate(`/buscar-pets?${queryString}`);
    } else if (searchTerm === '' && activeFilter === '') {
      toast.info('Por favor, digite um termo de busca ou selecione um filtro');
    } else {
      navigate('/buscar-pets');
    }
    
    console.log('Buscando por:', searchTerm, 'com filtro:', activeFilter);
  };

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Buscar pets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-6 rounded-lg border-gray-300"
            />
          </div>
          <Button type="submit" className="bg-pet-purple hover:bg-pet-lightPurple text-white rounded-lg px-6">
            Buscar
          </Button>
        </form>

        <div className="flex flex-wrap gap-2 mt-4">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant="outline"
              className={`rounded-full px-4 py-2 text-sm ${
                activeFilter === filter 
                  ? 'bg-pet-purple text-white border-pet-purple' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SearchBar;
